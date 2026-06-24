import React, { useState, useEffect } from 'react';
import { 
  Copy, Check, ShieldAlert, Sparkles, Sliders, ChevronDown, ChevronUp, 
  Trash2, Play, Pause, Coins, Flame, PlusCircle, AlertCircle, ExternalLink 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DeployedToken } from '../types';

interface MyTokensSectionProps {
  deployedTokens: DeployedToken[];
  setDeployedTokens: React.Dispatch<React.SetStateAction<DeployedToken[]>>;
  walletAddress: string | null;
  onNavigateToDeploy: () => void;
}

export default function MyTokensSection({
  deployedTokens,
  setDeployedTokens,
  walletAddress,
  onNavigateToDeploy,
}: MyTokensSectionProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedTokenId, setExpandedTokenId] = useState<string | null>(null);
  
  // Interactive forms state
  const [mintAmount, setMintAmount] = useState<string>('');
  const [burnAmount, setBurnAmount] = useState<string>('');
  const [activeActionTokenId, setActiveActionTokenId] = useState<string | null>(null);
  const [activeActionType, setActiveActionType] = useState<'mint' | 'burn' | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const togglePauseStatus = (tokenId: string) => {
    setDeployedTokens(prev => prev.map(token => {
      if (token.id === tokenId) {
        const newStatus = token.status === 'active' ? 'paused' : 'active';
        return { ...token, status: newStatus };
      }
      return token;
    }));
    setActionSuccessMsg("Status updated successfully!");
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const handleMintAction = (token: DeployedToken) => {
    if (!mintAmount || isNaN(Number(mintAmount)) || Number(mintAmount) <= 0) return;

    setDeployedTokens(prev => prev.map(t => {
      if (t.id === token.id) {
        const updatedSupply = (Number(t.totalSupply) + Number(mintAmount)).toString();
        return { ...t, totalSupply: updatedSupply };
      }
      return t;
    }));

    setActionSuccessMsg(`Successfully minted ${Number(mintAmount).toLocaleString()} tokens!`);
    setMintAmount('');
    setActiveActionType(null);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const handleBurnAction = (token: DeployedToken) => {
    if (!burnAmount || isNaN(Number(burnAmount)) || Number(burnAmount) <= 0) return;
    if (Number(burnAmount) > Number(token.totalSupply)) {
      alert("Cannot burn more tokens than the current total supply!");
      return;
    }

    setDeployedTokens(prev => prev.map(t => {
      if (t.id === token.id) {
        const updatedSupply = (Number(t.totalSupply) - Number(burnAmount)).toString();
        return { ...t, totalSupply: updatedSupply };
      }
      return t;
    }));

    setActionSuccessMsg(`Successfully burned ${Number(burnAmount).toLocaleString()} tokens!`);
    setBurnAmount('');
    setActiveActionType(null);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const deleteToken = (tokenId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to remove this token from your local dashboard? This cannot be undone.")) {
      setDeployedTokens(prev => prev.filter(t => t.id !== tokenId));
    }
  };

  const toggleExpand = (tokenId: string) => {
    setExpandedTokenId(expandedTokenId === tokenId ? null : tokenId);
    setActiveActionType(null);
    setActionSuccessMsg(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-8 pb-16"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="font-display text-3xl font-bold tracking-tight text-white">
              My Deployed B20 Tokens
            </h2>
            <span className="rounded-full bg-blue-950/60 text-blue-400 border border-blue-900/40 px-2.5 py-0.5 text-xs font-bold font-mono">
              {deployedTokens.length} Active
            </span>
          </div>
          <p className="text-slate-400 mt-2 text-sm max-w-2xl">
            Monitor, manage, mint, or burn your deployed Base B20 smart contracts. Actions require the appropriate feature toggles enabled at launch.
          </p>
        </div>

        <button
          onClick={onNavigateToDeploy}
          className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-5 py-3 transition-all flex items-center space-x-1.5 self-start md:self-auto"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          <span>Deploy New Token</span>
        </button>
      </div>

      {actionSuccessMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2.5 rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-4 text-sm text-emerald-400"
        >
          <Sparkles className="h-4.5 w-4.5 text-emerald-400" />
          <span className="font-medium">{actionSuccessMsg}</span>
        </motion.div>
      )}

      {/* Grid of Deployed Tokens */}
      {deployedTokens.length === 0 ? (
        <div className="text-center rounded-2xl border border-slate-900 bg-slate-950/40 p-12 space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-500">
            <Coins className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-white text-lg">No Deployed Tokens Found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              You haven't deployed any B20 tokens on this network yet, or your cache was cleared. Deploy your first native token to see it here!
            </p>
          </div>
          <button
            onClick={onNavigateToDeploy}
            className="mt-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 px-5 py-2.5 text-sm font-semibold text-white transition-all"
          >
            Go to Deployer
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {deployedTokens.map((token) => {
            const isExpanded = expandedTokenId === token.id;
            
            return (
              <div 
                key={token.id}
                className={`rounded-2xl border transition-all ${
                  isExpanded ? 'border-blue-500/50 bg-slate-950/80 shadow-lg shadow-blue-950/5' : 'border-slate-800/80 bg-slate-950 hover:bg-slate-900/40'
                }`}
              >
                {/* Collapsed top bar preview */}
                <div 
                  onClick={() => toggleExpand(token.id)}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 md:p-6 cursor-pointer gap-4"
                >
                  <div className="flex items-center space-x-4">
                    {token.logoUrl.startsWith('data:image/') ? (
                      <img 
                        src={token.logoUrl} 
                        alt="Logo" 
                        className="h-12 w-12 rounded-xl object-cover border border-slate-800 shadow" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${
                        token.tokenType === 'Stablecoin' 
                          ? 'from-emerald-500 to-teal-700' 
                          : 'from-blue-600 to-indigo-600'
                      } text-2xl shadow-md border border-slate-800`}>
                        {token.logoUrl || '🔮'}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-display font-bold text-white text-base sm:text-lg">{token.name}</h3>
                        <span className="font-mono text-xs text-slate-500 uppercase tracking-widest bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {token.symbol}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium flex items-center space-x-1.5">
                        <span>Class: {token.tokenType} B20</span>
                        <span>•</span>
                        <span>Deployed {token.deployedAt}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right side information (Status + Supply + Toggles) */}
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Circulating Supply</span>
                      <span className="font-mono font-bold text-white text-sm sm:text-base">
                        {parseFloat(token.totalSupply).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        token.status === 'active' 
                          ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/50' 
                          : 'bg-amber-950/40 text-amber-500 border-amber-900/50'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${token.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                        <span className="capitalize">{token.status}</span>
                      </span>

                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details section */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-900 overflow-hidden"
                    >
                      <div className="p-6 bg-slate-950/40 space-y-6">
                        
                        {/* Summary details bento grid */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                          
                          {/* Left Details block */}
                          <div className="md:col-span-7 space-y-4">
                            <div>
                              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Description</span>
                              <p className="text-sm text-slate-300 leading-relaxed mt-1">
                                {token.description || 'No description provided.'}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                              <div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Decimals</span>
                                <span className="block font-mono text-white text-sm mt-0.5">{token.decimals}</span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Maximum Supply</span>
                                <span className="block font-mono text-white text-sm mt-0.5">
                                  {parseFloat(token.maxSupply).toLocaleString()}
                                </span>
                              </div>
                            </div>

                            {/* Addresses list */}
                            <div className="space-y-2 pt-2">
                              <div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Contract Address</span>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="font-mono text-xs text-blue-400 bg-slate-900 border border-slate-800 px-2 py-1 rounded select-all break-all">
                                    {token.ownerWallet} {/* Mimic a contract */}
                                  </span>
                                  <button
                                    onClick={() => copyToClipboard(token.ownerWallet, `${token.id}-addr`)}
                                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
                                    title="Copy Address"
                                  >
                                    {copiedId === `${token.id}-addr` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Treasury Wallet</span>
                                  <span className="block font-mono text-slate-400 text-xs truncate mt-0.5">{token.treasuryWallet}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Owner Wallet</span>
                                  <span className="block font-mono text-slate-400 text-xs truncate mt-0.5">{token.ownerWallet}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Interactive operations block */}
                          <div className="md:col-span-5 rounded-xl border border-slate-900 bg-slate-950 p-5 space-y-4">
                            <h4 className="font-display font-semibold text-white text-sm flex items-center space-x-1.5">
                              <Sliders className="h-4 w-4 text-blue-500" />
                              <span>Admin Console Commands</span>
                            </h4>

                            {/* Features supported badges list */}
                            <div className="flex flex-wrap gap-1 border-b border-slate-900 pb-3">
                              {token.mintable && <span className="rounded-full bg-blue-950/40 text-blue-400 text-[8px] font-bold px-2 py-0.5 border border-blue-900/30">MINTABLE</span>}
                              {token.burnable && <span className="rounded-full bg-indigo-950/40 text-indigo-400 text-[8px] font-bold px-2 py-0.5 border border-indigo-900/30">BURNABLE</span>}
                              {token.pausable && <span className="rounded-full bg-amber-950/40 text-amber-500 text-[8px] font-bold px-2 py-0.5 border border-amber-900/30">PAUSABLE</span>}
                              {token.allowlist && <span className="rounded-full bg-pink-950/40 text-pink-400 text-[8px] font-bold px-2 py-0.5 border border-pink-900/30">ALLOWLIST</span>}
                              {token.blocklist && <span className="rounded-full bg-rose-950/40 text-rose-400 text-[8px] font-bold px-2 py-0.5 border border-rose-900/30">BLOCKLIST</span>}
                              {token.memoSupport && <span className="rounded-full bg-teal-950/40 text-teal-400 text-[8px] font-bold px-2 py-0.5 border border-teal-900/30">MEMO</span>}
                            </div>

                            <div className="space-y-3">
                              {/* 1. Toggle pause/resume (Emergency control) */}
                              {token.pausable ? (
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-slate-300">Emergency Stop Valve</span>
                                  <button
                                    onClick={() => togglePauseStatus(token.id)}
                                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                      token.status === 'active'
                                        ? 'bg-amber-950/30 text-amber-400 hover:bg-amber-950/50 border border-amber-900/50'
                                        : 'bg-emerald-950/30 text-emerald-400 hover:bg-emerald-950/50 border border-emerald-900/50'
                                    }`}
                                  >
                                    {token.status === 'active' ? (
                                      <>
                                        <Pause className="h-3.5 w-3.5" />
                                        <span>Pause Contract</span>
                                      </>
                                    ) : (
                                      <>
                                        <Play className="h-3.5 w-3.5" />
                                        <span>Resume Contract</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              ) : (
                                <div className="text-[10px] text-slate-500 italic">Pausability is disabled for this token.</div>
                              )}

                              {/* 2. Mint tokens */}
                              {token.mintable && (
                                <div className="space-y-1.5 pt-2 border-t border-slate-900/50">
                                  <label className="block text-[10px] uppercase font-bold text-slate-500">Mint Additional Supply</label>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="text"
                                      placeholder="Amount to mint..."
                                      value={activeActionTokenId === token.id && activeActionType === 'mint' ? mintAmount : ''}
                                      onChange={(e) => {
                                        setActiveActionTokenId(token.id);
                                        setActiveActionType('mint');
                                        setMintAmount(e.target.value);
                                      }}
                                      className="flex-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-white placeholder-slate-600 outline-none font-mono"
                                    />
                                    <button
                                      onClick={() => handleMintAction(token)}
                                      className="rounded-lg bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-xs font-bold text-white transition-all flex items-center space-x-1 shrink-0"
                                    >
                                      <PlusCircle className="h-3.5 w-3.5" />
                                      <span>Mint</span>
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* 3. Burn tokens */}
                              {token.burnable && (
                                <div className="space-y-1.5 pt-2 border-t border-slate-900/50">
                                  <label className="block text-[10px] uppercase font-bold text-slate-500">Burn Supply (Deflation)</label>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="text"
                                      placeholder="Amount to burn..."
                                      value={activeActionTokenId === token.id && activeActionType === 'burn' ? burnAmount : ''}
                                      onChange={(e) => {
                                        setActiveActionTokenId(token.id);
                                        setActiveActionType('burn');
                                        setBurnAmount(e.target.value);
                                      }}
                                      className="flex-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-white placeholder-slate-600 outline-none font-mono"
                                    />
                                    <button
                                      onClick={() => handleBurnAction(token)}
                                      className="rounded-lg bg-rose-950/30 border border-rose-900/40 text-rose-400 hover:bg-rose-950/50 px-3 py-1.5 text-xs font-bold transition-all flex items-center space-x-1 shrink-0"
                                    >
                                      <Flame className="h-3.5 w-3.5" />
                                      <span>Burn</span>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* View in block explorer button */}
                            <div className="pt-3 border-t border-slate-900">
                              <a
                                href={`https://basescan.org/tx/${token.txHash}`}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full flex items-center justify-center space-x-1 text-[10px] font-bold text-slate-400 hover:text-white transition-colors bg-slate-900 hover:bg-slate-800/80 py-2 rounded-lg border border-slate-800"
                              >
                                <span>Verify on BaseScan Explorer</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>

                          </div>

                        </div>

                        {/* Expandable Footer buttons */}
                        <div className="flex justify-between items-center pt-4 border-t border-slate-900 text-[10px] text-slate-500">
                          <span>Transaction Hash: <span className="font-mono text-slate-400">{token.txHash.substr(0,18)}...</span></span>
                          <button
                            onClick={(e) => deleteToken(token.id, e)}
                            className="flex items-center space-x-1 text-slate-600 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Remove from Board</span>
                          </button>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
