import { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import TokenDeployForm from './components/TokenDeployForm';
import MyTokensSection from './components/MyTokensSection';
import DocsSection from './components/DocsSection';
import Footer from './components/Footer';
import { DeployedToken } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Coins, Sparkles, TrendingUp, HelpCircle, ChevronRight, Check } from 'lucide-react';
import { useAccount, useBalance } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

const LOCAL_STORAGE_KEY = 'base_b20_deployed_tokens_list';

// Pre-seeded default tokens to give the dashboard a populated, high-fidelity feel on first load
const SEED_TOKENS: DeployedToken[] = [
  {
    id: 'b20-seed-1',
    name: 'Base Alpha',
    symbol: 'BALPHA',
    description: 'The premier community engagement and gas-back reward utility token native to Base B20.',
    logoUrl: '🔮',
    decimals: 18,
    totalSupply: '1000000000',
    maxSupply: '10000000000',
    tokenType: 'Standard',
    mintable: true,
    burnable: true,
    pausable: true,
    allowlist: false,
    blocklist: true,
    memoSupport: true,
    treasuryWallet: '0x32a1...4d2e',
    ownerWallet: '0x32a1...4d2e',
    deployedAt: '06/20/2026 10:24 AM',
    txHash: '0x88f2191a38bcbe3901ca9f848b30129cd88fef2a8b301e89f2ca03810f229a1d',
    status: 'active'
  },
  {
    id: 'b20-seed-2',
    name: 'Zora Essence',
    symbol: 'ZESS',
    description: 'Representing fractionized high-fidelity generative artwork curation blocks natively secured on Base network.',
    logoUrl: '🪐',
    decimals: 18,
    totalSupply: '10000000',
    maxSupply: '100000000',
    tokenType: 'Asset',
    mintable: false,
    burnable: true,
    pausable: true,
    allowlist: true,
    blocklist: false,
    memoSupport: false,
    treasuryWallet: '0xf71a...991c',
    ownerWallet: '0xf71a...991c',
    deployedAt: '06/22/2026 04:15 PM',
    txHash: '0xfa39cd210e1a8b3941ca8e2039ab1b0a8f8e02bc8f3c7e091de9ca10fa8c8f02',
    status: 'active'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'deploy' | 'docs' | 'my-tokens'>('home');
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({ address });
  const { openConnectModal } = useConnectModal();

  // Derive shortened address and formatted balance for display
  const walletAddress = isConnected && address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;
  const walletBalance = isConnected && balanceData
    ? `${parseFloat(balanceData.formatted).toFixed(4)}`
    : '0.00';

  const [deployedTokens, setDeployedTokens] = useState<DeployedToken[]>([]);

  // Load deployed tokens from localStorage or populate with seed tokens
  useEffect(() => {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        setDeployedTokens(JSON.parse(cached));
      } catch (e) {
        setDeployedTokens(SEED_TOKENS);
      }
    } else {
      setDeployedTokens(SEED_TOKENS);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_TOKENS));
    }
  }, []);

  // Sync to localStorage on update
  useEffect(() => {
    if (deployedTokens.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(deployedTokens));
    }
  }, [deployedTokens]);

  const handleNewDeployment = (newToken: DeployedToken) => {
    const updatedList = [newToken, ...deployedTokens];
    setDeployedTokens(updatedList);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
    setActiveTab('my-tokens');
  };

  const handleWalletConnectRequest = () => {
    if (openConnectModal) {
      openConnectModal();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600/30 selection:text-blue-300">
      
      {/* HEADER SECTION */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        walletAddress={walletAddress}
        walletBalance={walletBalance}
      />

      {/* MAIN CONTAINER */}
      <main className="flex-grow">
        
        <AnimatePresence mode="wait">
          
          {/* TAB 1: HOME LANDING VIEW */}
          {activeTab === 'home' && (
            <motion.div
              key="home-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <HeroSection 
                onLaunchToken={() => setActiveTab('deploy')} 
                onLearnMore={() => setActiveTab('docs')}
              />

              {/* Bento-grid Features Highlights Section */}
              <section className="py-16 border-t border-slate-900 bg-slate-950/40 relative">
                <div className="absolute top-1/2 left-1/4 -z-10 h-64 w-64 rounded-full bg-indigo-600/5 blur-[80px]" />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
                  <div className="text-center max-w-2xl mx-auto space-y-3">
                    <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                      Next-Generation Base Token Standard
                    </h2>
                    <p className="text-slate-400 text-sm">
                      Base B20 standard is fully compatible with global ERC-20 tools while utilizing advanced state packing for significant gas reductions.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Feature Card 1 */}
                    <div className="rounded-2xl border border-slate-900 bg-slate-950 p-6 space-y-4 hover:border-slate-800 transition-colors">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-500">
                        <Coins className="h-5 w-5" />
                      </div>
                      <h3 className="font-display font-bold text-white">Interactive Custom Mint/Burn</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Control token emissions directly from your dashboard. Increase total circulating supply or permanently destroy tokens to drive community scarcity instantly.
                      </p>
                    </div>

                    {/* Feature Card 2 */}
                    <div className="rounded-2xl border border-slate-900 bg-slate-950 p-6 space-y-4 hover:border-slate-800 transition-colors">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/10 text-purple-400">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <h3 className="font-display font-bold text-white">Pre-Audited Safe Bytecode</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        All templates have gone through thorough audits. Toggle powerful controls like Allowlist, Blocklist, or Emergency Pause with absolute security confidence.
                      </p>
                    </div>

                    {/* Feature Card 3 */}
                    <div className="rounded-2xl border border-slate-900 bg-slate-950 p-6 space-y-4 hover:border-slate-800 transition-colors">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-400">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <h3 className="font-display font-bold text-white">45% Gas Overhead Savings</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        By utilizing L2 state optimization and custom Solidity compilers, B20 contracts are the most lightweight, cost-effective tokens to deploy on Base today.
                      </p>
                    </div>
                  </div>

                  {/* Dynamic Interactive Call-to-action bar */}
                  <div className="rounded-2xl bg-gradient-to-r from-blue-900/40 via-slate-900 to-slate-900 p-6 sm:p-8 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="space-y-1.5 text-center sm:text-left">
                      <div className="inline-flex items-center space-x-1 rounded-full bg-blue-950/60 border border-blue-900/30 px-2 py-0.5 text-[10px] font-bold text-blue-400">
                        <span>L2 SEQUENCER ONLINE</span>
                      </div>
                      <h4 className="font-display font-bold text-white text-lg">Ready to deploy your custom token?</h4>
                      <p className="text-xs text-slate-400 max-w-md">Connect your wallet, configure parameters, and see your contract active on Base in 10 seconds.</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('deploy')}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm transition-all flex items-center justify-center space-x-1.5 active:scale-95 cursor-pointer shrink-0"
                    >
                      <span>Get Started</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* TAB 2: DEPLOY TOKEN VIEW */}
          {activeTab === 'deploy' && (
            <motion.div
              key="deploy-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.2 }}
              className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10"
            >
              <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
                <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Deploy Custom B20 Token
                </h1>
                <p className="text-slate-400 text-sm">
                  Launch standard utility assets, stablecoins, or RWA tokens instantly on Base Sepolia Testnet. Ensure a Web3 wallet is connected to authorize deployment signatures.
                </p>
              </div>

              <TokenDeployForm 
                walletAddress={walletAddress}
                onDeploySuccess={handleNewDeployment}
                onConnectWallet={handleWalletConnectRequest}
              />
            </motion.div>
          )}

          {/* TAB 3: MY TOKENS DASHBOARD */}
          {activeTab === 'my-tokens' && (
            <motion.div
              key="my-tokens-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.2 }}
              className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10"
            >
              <MyTokensSection 
                deployedTokens={deployedTokens}
                setDeployedTokens={setDeployedTokens}
                walletAddress={walletAddress}
                onNavigateToDeploy={() => setActiveTab('deploy')}
              />
            </motion.div>
          )}

          {/* TAB 4: DOCUMENTATION VIEW */}
          {activeTab === 'docs' && (
            <motion.div
              key="docs-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.2 }}
              className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10"
            >
              <DocsSection />
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* FOOTER SECTION */}
      <Footer setActiveTab={setActiveTab} />

    </div>
  );
}
