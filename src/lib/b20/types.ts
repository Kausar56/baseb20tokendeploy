export enum B20Variant {
  Asset = 0,
  Stablecoin = 1,
}

export type InitCalls = `0x${string}`[];

export interface TokenParams {
  name: string;
  symbol: string;
  variant: B20Variant;
  cap: bigint;
  roles: {
    admin: `0x${string}`;
    minter?: `0x${string}`;
    burner?: `0x${string}`;
    pauser?: `0x${string}`;
  };
}

export interface B20DeploymentPayload {
  to: `0x${string}`;
  data: `0x${string}`;
  value: bigint;
  predictedAddress: `0x${string}`;
  create2Salt: `0x${string}`;
  constructorArgs?: {
    name: string;
    symbol: string;
    decimals: number;
    initialSupply: string;
    maxSupply: string;
    treasury: string;
    owner: string;
    featureFlagsByte: string;
  };
  compilerVersion?: string;
  optimizationRuns?: number;
  evmTarget?: string;
  contractName?: string;
}

export interface B20DeploymentParams {
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: bigint;
  maxSupply: bigint;
  treasury: `0x${string}`;
  owner: `0x${string}`;
  featureFlags: number;
}

export interface B20FactoryCreateParams {
  variant: B20Variant;
  salt: `0x${string}`;
  params: `0x${string}`;
  initCalls: InitCalls;
}

export interface B20AdapterConfig {
  factoryAddress: `0x${string}` | null;
  chainId: number;
  isConfigured: boolean;
}
