import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';

// RainbowKit and Wagmi v2 config with Base Mainnet only
export const config = getDefaultConfig({
  appName: 'Base B20 Launchpad',
  projectId: '0446605e505531d0446b38c218204cd1', // Public WalletConnect project ID
  chains: [base],
  ssr: false,
});
