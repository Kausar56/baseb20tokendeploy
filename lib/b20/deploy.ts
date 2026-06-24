import { B20DeploymentParams } from './types';
import { B20_FACTORY_ABI, DEFAULT_ADMIN_ROLE, MINTER_ROLE } from './constants';
import { getB20FactoryConfig } from './factory';
import { isAddress, encodeAbiParameters, encodeFunctionData } from 'viem';

export interface DeploymentValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateB20Deployment(
  params: B20DeploymentParams,
  chainId: number | undefined
): DeploymentValidationResult {
  // Validate factory configuration
  const config = getB20FactoryConfig(chainId);
  if (!config.isConfigured || !config.factoryAddress) {
    return {
      isValid: false,
      error: 'B20 Factory Not Configured',
    };
  }

  // Validate addresses using standard viem checks
  if (!isAddress(params.treasury)) {
    return {
      isValid: false,
      error: 'Invalid Treasury Address',
    };
  }

  if (!isAddress(params.owner)) {
    return {
      isValid: false,
      error: 'Invalid Owner Address',
    };
  }

  if (!isAddress(config.factoryAddress)) {
    return {
      isValid: false,
      error: 'Invalid Factory Address configured',
    };
  }

  return {
    isValid: true,
  };
}

/**
 * Encodes the creation parameters for an Asset variant.
 */
export function encodeAssetCreateParams(name: string, symbol: string, decimals: number): `0x${string}` {
  return encodeAbiParameters(
    [
      { name: 'name', type: 'string' },
      { name: 'symbol', type: 'string' },
      { name: 'decimals', type: 'uint8' }
    ],
    [name, symbol, decimals]
  );
}

/**
 * Encodes the creation parameters for a Stablecoin variant.
 */
export function encodeStablecoinCreateParams(name: string, symbol: string, decimals: number): `0x${string}` {
  return encodeAbiParameters(
    [
      { name: 'name', type: 'string' },
      { name: 'symbol', type: 'string' },
      { name: 'decimals', type: 'uint8' }
    ],
    [name, symbol, decimals]
  );
}

/**
 * Encodes a grantRole(bytes32,address) call.
 */
export function encodeGrantRole(role: `0x${string}`, account: `0x${string}`): `0x${string}` {
  return encodeFunctionData({
    abi: [
      {
        name: 'grantRole',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'role', type: 'bytes32' },
          { name: 'account', type: 'address' }
        ],
        outputs: []
      }
    ],
    functionName: 'grantRole',
    args: [role, account]
  });
}

/**
 * Encodes an updateSupplyCap(uint256) call.
 */
export function encodeUpdateSupplyCap(newCap: bigint): `0x${string}` {
  return encodeFunctionData({
    abi: [
      {
        name: 'updateSupplyCap',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'newCap', type: 'uint256' }
        ],
        outputs: []
      }
    ],
    functionName: 'updateSupplyCap',
    args: [newCap]
  });
}

/**
 * Encodes a mint(address,uint256) call.
 */
export function encodeMint(to: `0x${string}`, amount: bigint): `0x${string}` {
  return encodeFunctionData({
    abi: [
      {
        name: 'mint',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'to', type: 'address' },
          { name: 'amount', type: 'uint256' }
        ],
        outputs: []
      }
    ],
    functionName: 'mint',
    args: [to, amount]
  });
}

export function getB20DeploymentPayload(
  params: B20DeploymentParams,
  chainId: number | undefined,
  serviceFeeWei: bigint,
  variant: number = 0,
  salt: `0x${string}` = '0x0000000000000000000000000000000000000000000000000000000000000000'
) {
  const config = getB20FactoryConfig(chainId);
  if (!config.isConfigured || !config.factoryAddress) {
    throw new Error('B20 Factory Not Configured');
  }

  // 1. Encode creation parameters based on variant
  const encodedParams = variant === 1 
    ? encodeStablecoinCreateParams(params.name, params.symbol, params.decimals)
    : encodeAssetCreateParams(params.name, params.symbol, params.decimals);

  // 2. Build initCalls dynamically
  const initCalls: `0x${string}`[] = [];

  // Grant admin role to owner
  initCalls.push(encodeGrantRole(DEFAULT_ADMIN_ROLE, params.owner));

  // Grant minter role to owner
  initCalls.push(encodeGrantRole(MINTER_ROLE, params.owner));

  // If there's an initial supply, mint it to the treasury
  if (params.initialSupply > 0n) {
    initCalls.push(encodeMint(params.treasury, params.initialSupply));
  }

  // Update supply cap if a maximum supply is defined
  if (params.maxSupply > 0n) {
    initCalls.push(encodeUpdateSupplyCap(params.maxSupply));
  }

  return {
    address: config.factoryAddress,
    abi: B20_FACTORY_ABI,
    functionName: 'createB20',
    args: [
      variant,
      salt,
      encodedParams,
      initCalls
    ] as const,
    value: serviceFeeWei,
  };
}
