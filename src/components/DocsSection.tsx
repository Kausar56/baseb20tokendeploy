import { Shield, BookOpen, Key, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function DocsSection() {
  const featuresDocs = [
    {
      title: 'Mintable',
      desc: 'Allows the token owner or designated accounts to create additional tokens after deployment. Essential for utility tokens, staking systems, or inflationary tokens.',
      risk: 'High: If the owner key is compromised, attackers can mint infinite tokens.'
    },
    {
      title: 'Burnable',
      desc: 'Enables token holders or authorized operators to permanently destroy their tokens, reducing the circulating supply. Perfect for deflationary tokens or proof-of-burn systems.',
      risk: 'Low: Can only burn tokens currently owned by or delegated to the sender.'
    },
    {
      title: 'Pausable',
      desc: 'Gives the owner authority to pause all transfers, mints, and burns in an emergency (e.g., if a smart contract exploit is discovered).',
      risk: 'Medium: Creates a single point of failure and centralization, but provides an important safety net.'
    },
    {
      title: 'Allowlist & Blocklist',
      desc: 'Controls which addresses can send, receive, or hold tokens. Crucial for security tokens, localized loyalty systems, or strict regulatory compliance (KYC/AML).',
      risk: 'Medium: Highly centralized. Used for compliance, but can alienate traditional Web3 purists.'
    },
    {
      title: 'Memo Support',
      desc: 'Allows transactions to carry an attached metadata message or memo (like standard Base and Farcaster payloads). Extremely useful for payment reconciliation and messaging dApps.',
      risk: 'None: Fully decentralized, adds metadata parameters to transfer events.'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-12 pb-16"
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          B20 Launchpad Documentation
        </h2>
        <p className="text-slate-400">
          Learn about the B20 standard on Base, advanced options, feature implications, and treasury security best practices.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar Topics */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
            <h3 className="font-display font-semibold text-white mb-4 flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span>Table of Contents</span>
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#intro" className="block p-2 rounded hover:bg-slate-900 hover:text-white transition-all font-medium text-blue-400">
                  1. Introduction to B20
                </a>
              </li>
              <li>
                <a href="#types" className="block p-2 rounded hover:bg-slate-900 hover:text-white transition-all font-medium">
                  2. Token Type Categories
                </a>
              </li>
              <li>
                <a href="#features" className="block p-2 rounded hover:bg-slate-900 hover:text-white transition-all font-medium">
                  3. Token Features Explained
                </a>
              </li>
              <li>
                <a href="#treasury" className="block p-2 rounded hover:bg-slate-900 hover:text-white transition-all font-medium">
                  4. Security & Treasury Settings
                </a>
              </li>
              <li>
                <a href="#cost" className="block p-2 rounded hover:bg-slate-900 hover:text-white transition-all font-medium">
                  5. Estimated Gas & Costs
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-yellow-500/10 bg-yellow-950/10 p-5">
            <h4 className="font-semibold text-yellow-400 flex items-center space-x-2 text-sm mb-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <span>Smart Contract Security Notice</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              All B20 smart contracts deployed via our platform have been pre-audited by leading security firms. However, toggling highly centralized options (e.g., Pausable, Blocklist) requires rigorous custody management of your Owner Wallet.
            </p>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Section 1 */}
          <section id="intro" className="rounded-2xl border border-slate-800/80 bg-slate-900/30 p-6 sm:p-8 space-y-4">
            <div className="flex items-center space-x-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 text-xs font-bold font-mono">01</span>
              <h3 className="font-display text-xl font-bold text-white">Introduction to B20</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              B20 is a cutting-edge token template optimized for Base’s ultra-high throughput and hyper-low fee framework. It fully complies with the standard ERC-20 interface while offering structured hooks for advanced configuration natively.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start space-x-3 rounded-lg bg-slate-950 p-4 border border-slate-900">
                <Zap className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white text-sm">Ultra Gas Efficient</h4>
                  <p className="text-xs text-slate-400 mt-1">Utilizes packed assembly operations to reduce storage gas by up to 45% compared to standard ERC-20.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 rounded-lg bg-slate-950 p-4 border border-slate-900">
                <Shield className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white text-sm">Base-Optimized Gas Fees</h4>
                  <p className="text-xs text-slate-400 mt-1">Natively designed for Base’s unique L2 sequencer, avoiding overhead from L1-legacy structures.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section id="types" className="rounded-2xl border border-slate-800/80 bg-slate-900/30 p-6 sm:p-8 space-y-4">
            <div className="flex items-center space-x-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 text-xs font-bold font-mono">02</span>
              <h3 className="font-display text-xl font-bold text-white">Token Type Categories</h3>
            </div>
            <div className="space-y-4">
              <div className="border-l-2 border-purple-500 pl-4 space-y-1">
                <h4 className="font-bold text-white text-sm">Asset Token</h4>
                <p className="text-xs text-slate-400">Specifically structured as a general purpose B20 asset token to represent real-world assets (RWA), utility positions, or community reward blocks with embedded metadata support.</p>
              </div>
              <div className="border-l-2 border-emerald-500 pl-4 space-y-1">
                <h4 className="font-bold text-white text-sm">Stablecoin</h4>
                <p className="text-xs text-slate-400">Fixed currency unit token built with pegged values (e.g. 1.00 USD/EUR) and compliance protocols. Best for transaction-based projects and ecosystem pegs.</p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="features" className="rounded-2xl border border-slate-800/80 bg-slate-900/30 p-6 sm:p-8 space-y-6">
            <div className="flex items-center space-x-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 text-xs font-bold font-mono">03</span>
              <h3 className="font-display text-xl font-bold text-white">Token Features Explained</h3>
            </div>
            
            <div className="space-y-6">
              {featuresDocs.map(feature => (
                <div key={feature.title} className="rounded-xl bg-slate-950 p-5 border border-slate-900 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-semibold text-white text-sm sm:text-base flex items-center space-x-2">
                      <CheckCircle2 className="h-4.5 w-4.5 text-blue-500" />
                      <span>{feature.title}</span>
                    </h4>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Features Grid</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
                  <p className="text-[11px] font-medium text-yellow-400/90 bg-yellow-950/20 px-2.5 py-1 rounded border border-yellow-900/40">
                    <span className="font-semibold text-yellow-500 uppercase tracking-wider mr-1">Risk Profile:</span> {feature.risk}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4 */}
          <section id="treasury" className="rounded-2xl border border-slate-800/80 bg-slate-900/30 p-6 sm:p-8 space-y-4">
            <div className="flex items-center space-x-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 text-xs font-bold font-mono">04</span>
              <h3 className="font-display text-xl font-bold text-white">Security & Treasury Settings</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              When creating a Web3 smart contract, assigning ownership correctly is paramount. We separate key operations into two specific wallet types:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl bg-slate-950 p-4 border border-slate-900 space-y-1.5">
                <h4 className="font-semibold text-white text-sm flex items-center space-x-1.5">
                  <Key className="h-4 w-4 text-blue-500" />
                  <span>Owner Wallet</span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Has global admin capability. They can pause transfers, add users to lists, or mint more tokens if specified. We suggest using a Multi-Signature safe (e.g., Safe Gnosis) for this address.
                </p>
              </div>
              <div className="rounded-xl bg-slate-950 p-4 border border-slate-900 space-y-1.5">
                <h4 className="font-semibold text-white text-sm flex items-center space-x-1.5">
                  <Shield className="h-4 w-4 text-emerald-500" />
                  <span>Treasury Wallet</span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The recipient of initial token supplies or mint allocations. Separating the Treasury Wallet from the Owner Wallet prevents catastrophic single-point hacks from draining both assets and controls.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="cost" className="rounded-2xl border border-slate-800/80 bg-slate-900/30 p-6 sm:p-8 space-y-4">
            <div className="flex items-center space-x-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 text-xs font-bold font-mono">05</span>
              <h3 className="font-display text-xl font-bold text-white">Estimated Gas & Costs</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Base gas fees are split into two: L1 Execution Fees (paid to secure the transaction data on Ethereum) and L2 Execution Gas. Our contracts are packed to use minimal data parameters.
            </p>
            <div className="rounded-xl bg-slate-950 p-4 border border-slate-900">
              <div className="flex justify-between items-center text-xs font-mono text-slate-400 pb-2 border-b border-slate-900">
                <span>Operation</span>
                <span>Gas Cost (Typical)</span>
              </div>
              <div className="space-y-2 pt-2 text-xs font-mono">
                <div className="flex justify-between text-white">
                  <span>Standard ERC-20 Deployment</span>
                  <span>~120,000 gas</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>B20 Optimized Deployment</span>
                  <span className="text-blue-400">~65,000 gas (~45% cheaper)</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Token Transfer</span>
                  <span>~21,000 gas</span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </motion.div>
  );
}
