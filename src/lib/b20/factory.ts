import { B20_FACTORY_SEPOLIA, B20_FACTORY_MAINNET, SUPPORTED_CHAIN_IDS } from './constants';
import { B20AdapterConfig } from './types';

export function getB20FactoryConfig(chainId: number | undefined): B20AdapterConfig {
  if (!chainId) {
    return {
      factoryAddress: null,
      chainId: 0,
      isConfigured: false,
    };
  }

  let factoryAddress: `0x${string}` | null = null;

  if (chainId === SUPPORTED_CHAIN_IDS.BASE_SEPOLIA) {
    factoryAddress = B20_FACTORY_SEPOLIA;
  } else if (chainId === SUPPORTED_CHAIN_IDS.BASE_MAINNET) {
    factoryAddress = B20_FACTORY_MAINNET;
  }

  return {
    factoryAddress,
    chainId,
    isConfigured: factoryAddress !== null,
  };
}
