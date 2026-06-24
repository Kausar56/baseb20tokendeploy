import { B20DeploymentParams, B20Variant, InitCalls } from './types';
import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from './constants';
import { IB20Factory } from './abi';
import { getB20FactoryConfig } from './factory';
import { isAddress } from 'viem';
import {
  encodeAssetCreateParams,
  encodeStablecoinCreateParams,
  encodeGrantRole,
  encodeUpdateSupplyCap,
  encodeMint
} from './encoder';

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

export function getB20DeploymentPayload(

  params: B20DeploymentParams,
  chainId: number | undefined,
  serviceFeeWei: bigint,
  variant: B20Variant = B20Variant.Asset,
  salt: `0x${string}` = '0x0000000000000000000000000000000000000000000000000000000000000000'
) {
  const config = getB20FactoryConfig(chainId);
  if (!config.isConfigured || !config.factoryAddress) {
    throw new Error('B20 Factory Not Configured');
  }

  // 1. Encode creation parameters based on variant
  const encodedParams = variant === B20Variant.Stablecoin 
    ? encodeStablecoinCreateParams(params.name, params.symbol, params.decimals)
    : encodeAssetCreateParams(params.name, params.symbol, params.decimals);

  // 2. Build initCalls dynamically
  const initCalls: InitCalls = [];

  // Grant admin role to owner
  initCalls.push(encodeGrantRole(DEFAULT_ADMIN_ROLE, params.owner));

  // Grant minter role to owner only if mintable role feature is enabled in feature flags (bit 0)
  const isMintable = (params.featureFlags & 1) !== 0;
  if (isMintable) {
    initCalls.push(encodeGrantRole(MINTER_ROLE, params.owner));
  }

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
    abi: IB20Factory,
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
