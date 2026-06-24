import { isAddress } from 'viem';

// Environment variables for Base Sepolia and Base Mainnet
const SEPOLIA_ENV = (import.meta as any).env?.NEXT_PUBLIC_B20_FACTORY_SEPOLIA || (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_B20_FACTORY_SEPOLIA) || '';
const MAINNET_ENV = (import.meta as any).env?.NEXT_PUBLIC_B20_FACTORY_MAINNET || (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_B20_FACTORY_MAINNET) || '';

export const B20_FACTORY_SEPOLIA = isAddress(SEPOLIA_ENV) ? (SEPOLIA_ENV as `0x${string}`) : null;
export const B20_FACTORY_MAINNET = isAddress(MAINNET_ENV) ? (MAINNET_ENV as `0x${string}`) : null;

export const B20_FACTORY_ABI = [
  {
    name: 'createB20',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'variant', type: 'uint8' },
      { name: 'salt', type: 'bytes32' },
      { name: 'params', type: 'bytes' },
      { name: 'initCalls', type: 'bytes[]' }
    ],
    outputs: [
      { name: 'tokenAddress', type: 'address' }
    ]
  },
  {
    name: 'deployB20Token',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'symbol', type: 'string' },
      { name: 'decimals', type: 'uint8' },
      { name: 'initialSupply', type: 'uint256' },
      { name: 'maxSupply', type: 'uint256' },
      { name: 'treasury', type: 'address' },
      { name: 'owner', type: 'address' },
      { name: 'featureFlags', type: 'uint8' }
    ],
    outputs: [
      { name: 'tokenAddress', type: 'address' }
    ]
  }
] as const;

export const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`;
export const MINTER_ROLE = '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6' as `0x${string}`; // keccak256("MINTER_ROLE")

export const SUPPORTED_CHAIN_IDS = {
  BASE_SEPOLIA: 84532,
  BASE_MAINNET: 8453,
} as const;
