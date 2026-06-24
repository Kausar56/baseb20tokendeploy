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

export interface B20AdapterConfig {
  factoryAddress: `0x${string}` | null;
  chainId: number;
  isConfigured: boolean;
}
