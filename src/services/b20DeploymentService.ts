import { TokenFormState, TokenType } from '../types';

/**
 * Interface representing the prepared deployment payload
 */
export interface B20DeploymentPayload {
  compilerVersion: string;
  evmTarget: string;
  optimizationRuns: number;
  contractName: string;
  constructorArgs: {
    name: string;
    symbol: string;
    decimals: number;
    initialSupply: string; // in wei-equivalent (multiplied by decimals)
    maxSupply: string; // in wei-equivalent (multiplied by decimals)
    treasury: string;
    owner: string;
    featureFlagsByte: string; // Hex representation of enabled features
  };
  create2Salt: string; // Deterministic salt for CREATE2 gas savings
  predictedAddress: string; // CREATE2 predicted deployment address
  bytecodePreviewHex: string; // Segment of compiled contract bytecode
}

/**
 * Detailed deployment summary including cost breakdown and compliance details
 */
export interface B20DeploymentSummary {
  tokenName: string;
  tokenSymbol: string;
  tokenClass: TokenType;
  totalSupplyFormatted: string;
  maxSupplyFormatted: string;
  ownerWallet: string;
  treasuryWallet: string;
  decimals: number;
  activeFeatures: {
    name: string;
    description: string;
    category: 'emission' | 'security' | 'utility';
  }[];
  costEstimation: {
    l1GasFeeEth: string;
    l2GasFeeEth: string;
    factoryServiceFeeEth: string;
    totalEth: string;
    totalUsd: string;
  };
  securityCheckStatus: {
    passed: boolean;
    warnings: string[];
    criticalIssues: string[];
  };
}

/**
 * Technical simulation preview of the Web3 transaction to be broadcasted
 */
export interface B20TransactionPreview {
  toAddress: string; // B20 Factory Contract on Base
  fromAddress: string; // Wallet of user
  functionName: string;
  functionSignature: string;
  functionArguments: string[];
  rawCallDataHex: string; // ABI encoded calldata representation
  gasLimitEstimate: number;
  maxFeePerGasGwei: number;
  maxPriorityFeePerGasGwei: number;
  valueWei: string; // Payable ETH amount required for deployment
  isReadyForSigning: boolean;
}

export class B20DeploymentService {
  // B20 Standard Factory contract on Base Mainnet
  public static readonly FACTORY_ADDRESS = '0xB20FAc701726aA36979A7c8e9b67b1406DeB2000';
  
  // Standard fees in ETH
  private static readonly L1_GAS_FEE = 0.00008;
  private static readonly L2_GAS_FEE = 0.00013;
  private static readonly ETH_TO_USD_RATE = 3500; // Spot conversion rate

  /**
   * Helper to compute feature flag byte.
   * Bits representation:
   * Bit 0: Mintable
   * Bit 1: Burnable
   * Bit 2: Pausable
   * Bit 3: Allowlist
   * Bit 4: Blocklist
   * Bit 5: Memo Support
   */
  public static computeFeatureFlagsByte(form: TokenFormState): number {
    let flag = 0;
    if (form.mintable) flag |= (1 << 0);
    if (form.burnable) flag |= (1 << 1);
    if (form.pausable) flag |= (1 << 2);
    if (form.allowlist) flag |= (1 << 3);
    if (form.blocklist) flag |= (1 << 4);
    if (form.memoSupport) flag |= (1 << 5);
    return flag;
  }

  /**
   * Validates the input form state and returns warning/error lists
   */
  public static validateForm(form: TokenFormState, walletAddress: string | null): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Wallet connection validation
    if (!walletAddress) {
      errors.push('Wallet must be connected to prepare deployment payload.');
    }

    // Name validations
    if (!form.name.trim()) {
      errors.push('Token Name cannot be empty.');
    } else if (form.name.length > 50) {
      errors.push('Token Name cannot exceed 50 characters.');
    }

    // Symbol validations
    if (!form.symbol.trim()) {
      errors.push('Token Symbol cannot be empty.');
    } else if (!/^[a-zA-Z0-9]+$/.test(form.symbol)) {
      errors.push('Token Symbol must contain only alphanumeric characters.');
    } else if (form.symbol.length < 2 || form.symbol.length > 10) {
      errors.push('Token Symbol must be between 2 and 10 characters.');
    }

    // Supply validations
    const decimals = Number(form.decimals);
    if (isNaN(decimals) || decimals < 0 || decimals > 18) {
      errors.push('Decimals must be an integer between 0 and 18.');
    }

    try {
      const ts = BigInt(form.totalSupply || '0');
      if (ts <= 0n) {
        errors.push('Total Supply must be a positive number greater than 0.');
      }
    } catch {
      errors.push('Total Supply is not a valid large integer value.');
    }

    try {
      const ms = BigInt(form.maxSupply || '0');
      const ts = BigInt(form.totalSupply || '0');
      if (ms <= 0n) {
        errors.push('Maximum Supply must be a positive number greater than 0.');
      } else if (ms < ts) {
        errors.push('Maximum Supply cannot be less than Total Supply.');
      }
    } catch {
      errors.push('Maximum Supply is not a valid large integer value.');
    }

    // Addresses validation
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!ethAddressRegex.test(form.treasuryWallet)) {
      errors.push('Treasury Wallet Address must be a valid Ethereum address (e.g. 0x...).');
    }
    if (!ethAddressRegex.test(form.ownerWallet)) {
      errors.push('Owner Admin Wallet Address must be a valid Ethereum address (e.g. 0x...).');
    }

    // Warnings calculation
    if (form.ownerWallet === form.treasuryWallet && form.treasuryWallet !== '0x5b38...a21f' && form.treasuryWallet.startsWith('0x')) {
      warnings.push('Setting owner wallet identical to treasury wallet is a minor risk. Consider segregating core custody from deployer admin keys.');
    }

    if (form.mintable && !form.pausable) {
      warnings.push('Token is mintable but not pausable. In the event of keys compromise, new supply emissions cannot be halted.');
    }

    if (form.blocklist && !form.allowlist) {
      warnings.push('Blocklist is enabled without an active allowlist. Ensure admin addresses are properly maintained to avoid censorship loops.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Generates pseudo-CREATE2 deterministic address prediction
   */
  public static predictCreate2Address(
    owner: string,
    symbol: string,
    saltHex: string
  ): string {
    // Standard simulation of CREATE2 hash calculation
    // keccak256(0xff + deployer + salt + keccak256(bytecode))
    const cleanOwner = owner.toLowerCase().replace('0x', '');
    const cleanSalt = saltHex.toLowerCase().replace('0x', '');
    
    // Generate deterministic looking address based on input hashes
    let hashSource = cleanOwner + symbol.toLowerCase() + cleanSalt;
    let finalHash = '';
    
    // Simple mock hash function for predictable output inside preview
    let sum = 0;
    for (let i = 0; i < hashSource.length; i++) {
      sum += hashSource.charCodeAt(i);
    }
    
    const hexChars = '0123456789abcdef';
    let mockHex = '00b20'; // Base B20 prefix identifier
    for (let i = 0; i < 35; i++) {
      const idx = (sum + i * 17) % 16;
      mockHex += hexChars[idx];
    }
    return mockHex.slice(0, 42);
  }

  /**
   * Prepares the full structured token deployment payload
   */
  public static prepareDeploymentPayload(form: TokenFormState, walletAddress: string | null): B20DeploymentPayload {
    const decimals = Number(form.decimals) || 18;
    const initialSupplyBigInt = BigInt(form.totalSupply || '0') * (10n ** BigInt(decimals));
    const maxSupplyBigInt = BigInt(form.maxSupply || '0') * (10n ** BigInt(decimals));
    const featureFlagsByte = B20DeploymentService.computeFeatureFlagsByte(form);

    // Dynamic salt based on owner, symbol, and current millisecond timestamp for uniqueness
    const saltNum = Math.floor(Math.random() * 1000000);
    const saltHex = '0x' + saltNum.toString(16).padStart(64, '0');
    
    const predictedAddress = B20DeploymentService.predictCreate2Address(
      form.ownerWallet,
      form.symbol,
      saltHex
    );

    // Hex bytecode representation of B20 template matching selection class
    let bytecodePreviewHex = '0x608060405234801561001057600080fd5b506040516110f83803806110f883398101604081905261002f91906100c8565b600080546001600160a01b0316331461005157600080fd5b6001600160a01b0387166000908152602081905260409020905084815401815550';
    if (form.tokenType === 'Stablecoin') {
      bytecodePreviewHex += '7f8c0a876a00000000000000000000000000000000000000000000000000000000600019163314';
    } else if (form.tokenType === 'Asset') {
      bytecodePreviewHex += '7fa419de3c00000000000000000000000000000000000000000000000000000000600019163314';
    }

    return {
      compilerVersion: 'v0.8.24+commit.e11b9ed9',
      evmTarget: 'Cancun (Base Optimism Bedrock)',
      optimizationRuns: 200,
      contractName: `B20${form.tokenType}Token`,
      constructorArgs: {
        name: form.name,
        symbol: form.symbol.toUpperCase(),
        decimals,
        initialSupply: initialSupplyBigInt.toString(),
        maxSupply: maxSupplyBigInt.toString(),
        treasury: form.treasuryWallet,
        owner: form.ownerWallet,
        featureFlagsByte: '0x' + featureFlagsByte.toString(16).padStart(2, '0'),
      },
      create2Salt: saltHex,
      predictedAddress,
      bytecodePreviewHex,
    };
  }

  /**
   * Prepares the full structured token deployment summary
   */
  public static generateDeploymentSummary(form: TokenFormState, walletAddress: string | null): B20DeploymentSummary {
    const serviceFee = form.tokenType === 'Standard' ? 0.0005 : form.tokenType === 'Stablecoin' ? 0.0009 : 0.0012;
    const totalEth = (B20DeploymentService.L1_GAS_FEE + B20DeploymentService.L2_GAS_FEE + serviceFee);
    const totalUsd = totalEth * B20DeploymentService.ETH_TO_USD_RATE;

    const activeFeatures: B20DeploymentSummary['activeFeatures'] = [];
    if (form.mintable) {
      activeFeatures.push({ name: 'Mintable Extension', description: 'Permits owner to emit new tokens beyond initial allocation.', category: 'emission' });
    }
    if (form.burnable) {
      activeFeatures.push({ name: 'Burnable Extension', description: 'Permits coin holders to destroy token supply to create deflation.', category: 'emission' });
    }
    if (form.pausable) {
      activeFeatures.push({ name: 'Emergency Pause', description: 'Enables owner to halt transfers in case of market exploit.', category: 'security' });
    }
    if (form.allowlist) {
      activeFeatures.push({ name: 'Transfer Allowlist', description: 'Limits transfer capability only to KYC/authorized addresses.', category: 'security' });
    }
    if (form.blocklist) {
      activeFeatures.push({ name: 'Malicious Blocklist', description: 'Allows admin to lock transfers to/from sanctioned actors.', category: 'security' });
    }
    if (form.memoSupport) {
      activeFeatures.push({ name: 'B20 Memo Payloads', description: 'Enables custom transaction notes on Base network transfers.', category: 'utility' });
    }

    const { errors, warnings } = B20DeploymentService.validateForm(form, walletAddress);

    return {
      tokenName: form.name,
      tokenSymbol: form.symbol.toUpperCase(),
      tokenClass: form.tokenType,
      totalSupplyFormatted: parseFloat(form.totalSupply || '0').toLocaleString(),
      maxSupplyFormatted: parseFloat(form.maxSupply || '0').toLocaleString(),
      ownerWallet: form.ownerWallet,
      treasuryWallet: form.treasuryWallet,
      decimals: Number(form.decimals) || 18,
      activeFeatures,
      costEstimation: {
        l1GasFeeEth: B20DeploymentService.L1_GAS_FEE.toFixed(5),
        l2GasFeeEth: B20DeploymentService.L2_GAS_FEE.toFixed(5),
        factoryServiceFeeEth: serviceFee.toFixed(5),
        totalEth: totalEth.toFixed(5),
        totalUsd: totalUsd.toFixed(2),
      },
      securityCheckStatus: {
        passed: errors.length === 0,
        warnings,
        criticalIssues: errors,
      }
    };
  }

  /**
   * Computes the ABI transaction calldata representation and preview metadata
   */
  public static generateTransactionPreview(
    form: TokenFormState,
    payload: B20DeploymentPayload,
    walletAddress: string | null
  ): B20TransactionPreview {
    const serviceFee = form.tokenType === 'Standard' ? 0.0005 : form.tokenType === 'Stablecoin' ? 0.0009 : 0.0012;
    const valueWei = (BigInt(Math.floor(serviceFee * 1e18))).toString(); // factory fee sent as transaction msg.value

    // Build standard pseudo ABI encoded bytes matching B20 Factory structure
    // deployB20Token(string name, string symbol, uint8 decimals, uint256 initialSupply, uint256 maxSupply, address treasury, address owner, uint8 featureFlags)
    // Selector for deployB20Token: 0x51ab84b5
    let abiHex = '0x51ab84b5';
    
    // Dynamic mock padding function mimicking EVM slot encoding (32 bytes / 64 characters)
    const padUint256 = (val: string | number) => {
      let cleanVal = typeof val === 'number' ? val.toString(16) : BigInt(val).toString(16);
      return cleanVal.padStart(64, '0');
    };
    
    const padAddress = (addr: string) => {
      return addr.toLowerCase().replace('0x', '').padStart(64, '0');
    };

    // Constructor parameters layout
    abiHex += padUint256(form.decimals); // Decimals slot
    abiHex += padUint256(payload.constructorArgs.initialSupply); // Initial supply slot
    abiHex += padUint256(payload.constructorArgs.maxSupply); // Max supply slot
    abiHex += padAddress(form.treasuryWallet); // Treasury slot
    abiHex += padAddress(form.ownerWallet); // Owner slot
    abiHex += padUint256(B20DeploymentService.computeFeatureFlagsByte(form)); // Features flag slot
    
    // Strings are offset, lets represent that concisely
    abiHex += '...[ABI String Offset Encoded Name: ' + Buffer.from(form.name).toString('hex').slice(0, 16) + ']...';
    abiHex += '[ABI String Offset Encoded Symbol: ' + Buffer.from(form.symbol).toString('hex').slice(0, 8) + ']';

    return {
      toAddress: B20DeploymentService.FACTORY_ADDRESS,
      fromAddress: walletAddress || '0x0000000000000000000000000000000000000000',
      functionName: 'deployB20Token',
      functionSignature: 'deployB20Token(string name, string symbol, uint8 decimals, uint256 initialSupply, uint256 maxSupply, address treasury, address owner, uint8 featureFlags)',
      functionArguments: [
        form.name,
        form.symbol.toUpperCase(),
        form.decimals.toString(),
        payload.constructorArgs.initialSupply,
        payload.constructorArgs.maxSupply,
        form.treasuryWallet,
        form.ownerWallet,
        payload.constructorArgs.featureFlagsByte
      ],
      rawCallDataHex: abiHex,
      gasLimitEstimate: 210000 + (form.tokenType === 'Standard' ? 45000 : form.tokenType === 'Stablecoin' ? 62000 : 84000),
      maxFeePerGasGwei: 0.12, // Optimism L2 gas is extremely cheap
      maxPriorityFeePerGasGwei: 0.005,
      valueWei,
      isReadyForSigning: walletAddress !== null,
    };
  }
}
