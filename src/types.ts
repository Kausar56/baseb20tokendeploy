export type TokenType = 'Stablecoin' | 'Asset';

export interface TokenFormState {
  name: string;
  symbol: string;
  description: string;
  logoUrl: string;
  decimals: number;
  totalSupply: string;
  maxSupply: string;
  tokenType: TokenType;
  
  // Features
  mintable: boolean;
  burnable: boolean;
  pausable: boolean;
  allowlist: boolean;
  blocklist: boolean;
  memoSupport: boolean;
  
  // Treasury
  treasuryWallet: string;
  ownerWallet: string;
}

export interface DeployedToken extends TokenFormState {
  id: string;
  deployedAt: string;
  txHash: string;
  status: 'active' | 'paused';
  chainId?: number;
}
