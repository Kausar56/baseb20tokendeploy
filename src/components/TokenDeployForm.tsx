import React, { useState, useRef } from 'react';
import { 
  HelpCircle, Upload, Check, Coins, ShieldCheck, 
  Wallet, Layers, Network, Info, Eye, Sparkles, Loader2, Play, CircleDot, RefreshCw, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TokenFormState, TokenType, DeployedToken } from '../types';

interface TokenDeployFormProps {
  walletAddress: string | null;
  onDeploySuccess: (token: DeployedToken) => void;
  onConnectWallet: () => void;
}

const PRESET_LOGOS = [
  { emoji: '🔮', color: 'from-blue-600 to-indigo-600', name: 'Cosmic' },
  { emoji: '⚡', color: 'from-yellow-400 to-amber-600', name: 'Blitz' },
  { emoji: '🪐', color: 'from-purple-600 to-pink-600', name: 'Orbit' },
  { emoji: '🦖', color: 'from-emerald-500 to-teal-700', name: 'Dino' },
  { emoji: '🍒', color: 'from-rose-500 to-pink-600', name: 'Ruby' },
  { emoji: '🔵', color: 'from-blue-500 to-cyan-500', name: 'Base' },
];

export default function TokenDeployForm({ walletAddress, onDeploySuccess, onConnectWallet }: TokenDeployFormProps) {
  const [form, setForm] = useState<TokenFormState>({
    name: 'Base Gold',
    symbol: 'BGOLD',
    description: 'The premium gold reserve standard built natively on Base network B20.',
    logoUrl: '🔮', // Can be an emoji or base64
    decimals: 18,
    totalSupply: '1000000',
    maxSupply: '10000000',
    tokenType: 'Standard',
    mintable: true,
    burnable: true,
    pausable: false,
    allowlist: false,
    blocklist: false,
    memoSupport: false,
    treasuryWallet: walletAddress || '0x5b38...a21f',
    ownerWallet: walletAddress || '0x5b38...a21f'
  });

  const [dragActive, setDragActive] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0); // 0: Sign, 1: Broadcast, 2: Deploy, 3: Completed
  const [generatedAddress, setGeneratedAddress] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synced address when wallet changes
  React.useEffect(() => {
    if (walletAddress) {
      setForm(prev => ({
        ...prev,
        treasuryWallet: prev.treasuryWallet.startsWith('0x5b38') ? walletAddress : prev.treasuryWallet,
        ownerWallet: prev.ownerWallet.startsWith('0x5b38') ? walletAddress : prev.ownerWallet,
      }));
    }
  }, [walletAddress]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (name: keyof TokenFormState) => {
    setForm(prev => ({ ...prev, [name]: !prev[name] as any }));
  };

  const handleTypeSelect = (type: TokenType) => {
    setForm(prev => ({ ...prev, tokenType: type }));
  };

  // Convert uploaded logo to base64
  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleLogoSelect = (logo: string) => {
    setForm(prev => ({ ...prev, logoUrl: logo }));
  };

  const triggerDeploy = () => {
    if (!walletAddress) {
      onConnectWallet();
      return;
    }

    if (!form.name || !form.symbol) {
      setError('Please fill out Token Name and Token Symbol');
      return;
    }

    setError(null);
    setIsDeploying(true);
    setDeployStep(0);

    // Simulate standard web3 launchpad steps
    setTimeout(() => {
      setDeployStep(1); // Broadcasting
      setTimeout(() => {
        setDeployStep(2); // Deploying Contract
        setTimeout(() => {
          // Complete
          const hex = '0123456789abcdef';
          let randomAddr = '0x00b20';
          for (let i = 0; i < 35; i++) {
            randomAddr += hex[Math.floor(Math.random() * 16)];
          }
          setGeneratedAddress(randomAddr);
          setDeployStep(3);
        }, 1500);
      }, 1500);
    }, 1200);
  };

  const finalizeDeployment = () => {
    setIsDeploying(false);
    const newDeployedToken: DeployedToken = {
      ...form,
      id: Math.random().toString(36).substr(2, 9),
      deployedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      txHash: '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
      status: 'active'
    };
    onDeploySuccess(newDeployedToken);
  };

  // Fees calculation
  const networkFee = 0.00021; // ETH
  const serviceFee = form.tokenType === 'Standard' ? 0.0005 : form.tokenType === 'Stablecoin' ? 0.0009 : 0.0012;
  const totalEth = (networkFee + serviceFee).toFixed(5);
  const totalUsd = (parseFloat(totalEth) * 3500).toFixed(2); // Mock 3500/ETH rate

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16 items-start">
      
      {/* LEFT COLUMN: THE FORM */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Main deployment Form wrapper */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 md:p-8 shadow-xl space-y-8">
          
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-500">
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-white">Token Deployment Configurator</h2>
              <p className="text-xs text-slate-500">Configure your B20 smart contract settings below.</p>
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2.5 rounded-lg border border-red-500/30 bg-red-950/20 p-4 text-sm text-red-400">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* TOKEN METADATA SECTION */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-slate-300 text-sm tracking-wider uppercase">1. Core Metadata</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5" htmlFor="token-name">
                  Token Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="token-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleTextChange}
                  placeholder="e.g. Base Gold"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5" htmlFor="token-symbol">
                  Token Symbol <span className="text-red-500">*</span>
                </label>
                <input
                  id="token-symbol"
                  type="text"
                  name="symbol"
                  value={form.symbol}
                  onChange={handleTextChange}
                  placeholder="e.g. BGOLD"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-semibold uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5" htmlFor="token-description">
                Description
              </label>
              <textarea
                id="token-description"
                name="description"
                value={form.description}
                onChange={handleTextChange}
                placeholder="Describe your project's purpose and roadmap..."
                rows={3}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
              />
            </div>

            {/* Token Logo Choice / Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">
                Token Logo (Upload image or Select Emoji)
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                
                {/* Drag-n-drop Area */}
                <div 
                  className={`md:col-span-7 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-all ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-950/10' 
                      : 'border-slate-800 bg-slate-900/20 hover:border-slate-700'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  id="logo-upload-zone"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <Upload className="h-5 w-5 text-slate-500 mb-1" />
                  <span className="text-xs font-medium text-slate-300">Drag & drop or Click to upload</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Supports PNG, SVG, JPG</span>
                </div>

                {/* Instant Presets */}
                <div className="md:col-span-5 flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Instant Presets:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_LOGOS.map((logo) => (
                      <button
                        key={logo.name}
                        type="button"
                        onClick={() => handleLogoSelect(logo.emoji)}
                        className={`flex h-10 items-center justify-center rounded-lg border text-sm transition-all ${
                          form.logoUrl === logo.emoji 
                            ? 'border-blue-500 bg-blue-950/30 font-bold scale-105' 
                            : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-700'
                        }`}
                      >
                        <span className="mr-1">{logo.emoji}</span>
                        <span className="text-[10px] text-slate-400">{logo.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* TOKEN PARAMETERS */}
          <div className="space-y-4 pt-4 border-t border-slate-900">
            <h3 className="font-display font-semibold text-slate-300 text-sm tracking-wider uppercase">2. Token Economics</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5" htmlFor="token-decimals">
                  Decimals
                </label>
                <input
                  id="token-decimals"
                  type="number"
                  name="decimals"
                  value={form.decimals}
                  onChange={handleTextChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5" htmlFor="token-total-supply">
                  Total Supply
                </label>
                <input
                  id="token-total-supply"
                  type="text"
                  name="totalSupply"
                  value={form.totalSupply}
                  onChange={handleTextChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5" htmlFor="token-max-supply">
                  Maximum Supply
                </label>
                <input
                  id="token-max-supply"
                  type="text"
                  name="maxSupply"
                  value={form.maxSupply}
                  onChange={handleTextChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* Token Type Option Selector */}
            <div>
              <span className="block text-xs font-semibold text-slate-400 mb-2">
                Token Standard Class
              </span>
              <div className="grid grid-cols-3 gap-3">
                {(['Standard', 'Stablecoin', 'Asset'] as TokenType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleTypeSelect(t)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center ${
                      form.tokenType === t 
                        ? 'border-blue-500 bg-blue-950/20 shadow-lg shadow-blue-950/10' 
                        : 'border-slate-800 bg-slate-900/30 hover:bg-slate-900 hover:border-slate-800'
                    }`}
                  >
                    <Layers className={`h-5 w-5 mb-1.5 ${form.tokenType === t ? 'text-blue-400' : 'text-slate-500'}`} />
                    <span className="text-xs font-bold text-white">{t}</span>
                    <span className="text-[9px] text-slate-500 mt-1">
                      {t === 'Standard' ? 'Base Utility' : t === 'Stablecoin' ? 'Pegged Unit' : 'Asset-Backed'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* TOKEN FEATURES SWITCHES */}
          <div className="space-y-4 pt-4 border-t border-slate-900">
            <h3 className="font-display font-semibold text-slate-300 text-sm tracking-wider uppercase">3. Advanced Smart Contract Features</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Mintable toggle */}
              <div 
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 transition-colors cursor-pointer"
                onClick={() => handleToggle('mintable')}
                id="toggle-mintable"
              >
                <div>
                  <div className="text-xs font-bold text-white">Mintable</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Allows future emission of tokens.</div>
                </div>
                <button
                  type="button"
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                    form.mintable ? 'bg-blue-600' : 'bg-slate-700'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    form.mintable ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Burnable toggle */}
              <div 
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 transition-colors cursor-pointer"
                onClick={() => handleToggle('burnable')}
                id="toggle-burnable"
              >
                <div>
                  <div className="text-xs font-bold text-white">Burnable</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Destroys circulating tokens to reduce supply.</div>
                </div>
                <button
                  type="button"
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                    form.burnable ? 'bg-blue-600' : 'bg-slate-700'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    form.burnable ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Pausable toggle */}
              <div 
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 transition-colors cursor-pointer"
                onClick={() => handleToggle('pausable')}
                id="toggle-pausable"
              >
                <div>
                  <div className="text-xs font-bold text-white">Pausable</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Owner can halt all transfers in emergencies.</div>
                </div>
                <button
                  type="button"
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                    form.pausable ? 'bg-blue-600' : 'bg-slate-700'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    form.pausable ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Allowlist toggle */}
              <div 
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 transition-colors cursor-pointer"
                onClick={() => handleToggle('allowlist')}
                id="toggle-allowlist"
              >
                <div>
                  <div className="text-xs font-bold text-white">Allowlist</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Strict authorization for receivers.</div>
                </div>
                <button
                  type="button"
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                    form.allowlist ? 'bg-blue-600' : 'bg-slate-700'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    form.allowlist ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Blocklist toggle */}
              <div 
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 transition-colors cursor-pointer"
                onClick={() => handleToggle('blocklist')}
                id="toggle-blocklist"
              >
                <div>
                  <div className="text-xs font-bold text-white">Blocklist</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Prevent specific malicious addresses.</div>
                </div>
                <button
                  type="button"
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                    form.blocklist ? 'bg-blue-600' : 'bg-slate-700'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    form.blocklist ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Memo Support toggle */}
              <div 
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 transition-colors cursor-pointer"
                onClick={() => handleToggle('memoSupport')}
                id="toggle-memoSupport"
              >
                <div>
                  <div className="text-xs font-bold text-white">Memo Support</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Permits attachment of custom text payloads.</div>
                </div>
                <button
                  type="button"
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                    form.memoSupport ? 'bg-blue-600' : 'bg-slate-700'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    form.memoSupport ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

            </div>
          </div>

          {/* TREASURY SETTINGS */}
          <div className="space-y-4 pt-4 border-t border-slate-900">
            <h3 className="font-display font-semibold text-slate-300 text-sm tracking-wider uppercase flex items-center space-x-1.5">
              <span>4. Treasury & Governance Settings</span>
              <Info className="h-3.5 w-3.5 text-slate-500" />
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5" htmlFor="treasury-wallet">
                  Treasury Wallet Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-600">
                    <Wallet className="h-4 w-4" />
                  </span>
                  <input
                    id="treasury-wallet"
                    type="text"
                    name="treasuryWallet"
                    value={form.treasuryWallet}
                    onChange={handleTextChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/50 pl-9 pr-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition-all font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5" htmlFor="owner-wallet">
                  Owner Admin Wallet Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-600">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <input
                    id="owner-wallet"
                    type="text"
                    name="ownerWallet"
                    value={form.ownerWallet}
                    onChange={handleTextChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/50 pl-9 pr-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition-all font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-500">
              * The initial token supply allocation will be deposited to the Treasury Wallet address. Smart contract admin parameters will be controlled by the Owner Wallet.
            </p>
          </div>

        </div>
      </div>

      {/* RIGHT COLUMN: PREVIEW & DEPLOY ACTIONS */}
      <div className="lg:col-span-5 space-y-6 sticky top-24">
        
        {/* Real-time Token Preview Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl relative overflow-hidden group">
          {/* Background color gradient glow based on Token type */}
          <div className={`absolute top-0 right-0 -z-10 h-44 w-44 rounded-full blur-[90px] transition-all duration-500 ${
            form.tokenType === 'Standard' 
              ? 'bg-blue-600/10' 
              : form.tokenType === 'Stablecoin' 
              ? 'bg-emerald-600/10' 
              : 'bg-purple-600/10'
          }`} />

          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
              <Eye className="h-3.5 w-3.5 text-blue-500" />
              <span>B20 Live Contract Preview</span>
            </span>
            <span className="inline-flex items-center rounded-full bg-blue-950/50 px-2 py-0.5 text-[9px] font-bold text-blue-400 border border-blue-800/20">
              BASE
            </span>
          </div>

          {/* Actual Token Mock card render */}
          <div className="mt-6 rounded-xl border border-slate-800/80 bg-gradient-to-br from-slate-900 to-slate-950 p-5 shadow-2xl relative overflow-hidden">
            
            {/* Visual shine */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3.5">
                {form.logoUrl.startsWith('data:image/') ? (
                  <img 
                    src={form.logoUrl} 
                    alt="Token Logo" 
                    className="h-11 w-11 rounded-xl object-cover shadow-md border border-slate-800" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${
                    form.tokenType === 'Standard' 
                      ? 'from-blue-600 to-indigo-600' 
                      : form.tokenType === 'Stablecoin' 
                      ? 'from-emerald-500 to-teal-700' 
                      : 'from-purple-600 to-pink-600'
                  } text-xl shadow-lg border border-slate-700`}>
                    {form.logoUrl || '🔮'}
                  </div>
                )}
                <div>
                  <h4 className="font-display font-extrabold text-white text-base truncate max-w-[140px] sm:max-w-[180px]">{form.name || 'Unnamed Token'}</h4>
                  <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">{form.tokenType} B20 CLASS</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-bold text-white bg-slate-900 border border-slate-800/60 px-2 py-1 rounded-md">
                  {form.symbol ? `$${form.symbol.toUpperCase()}` : '$TKN'}
                </span>
              </div>
            </div>

            {/* Description inside token */}
            <p className="mt-4 text-xs text-slate-400 line-clamp-2 leading-relaxed min-h-[32px]">
              {form.description || 'No description provided. Define your project mission in the configurator.'}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-900/60 pt-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 block">Total Supply</span>
                <span className="font-mono text-sm font-bold text-white">
                  {form.totalSupply ? parseFloat(form.totalSupply).toLocaleString() : '0'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 block">Decimals</span>
                <span className="font-mono text-sm font-bold text-slate-300">
                  {form.decimals}
                </span>
              </div>
            </div>

            {/* Advanced features indicators */}
            <div className="mt-4 pt-3 border-t border-slate-900/60">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 block mb-2">Enabled Extensions</span>
              <div className="flex flex-wrap gap-1.5">
                {form.mintable && <span className="rounded-full bg-blue-950/50 border border-blue-900/40 text-blue-400 text-[9px] font-bold px-2 py-0.5">MINTABLE</span>}
                {form.burnable && <span className="rounded-full bg-indigo-950/50 border border-indigo-900/40 text-indigo-400 text-[9px] font-bold px-2 py-0.5">BURNABLE</span>}
                {form.pausable && <span className="rounded-full bg-amber-950/50 border border-amber-900/40 text-amber-400 text-[9px] font-bold px-2 py-0.5">PAUSABLE</span>}
                {form.allowlist && <span className="rounded-full bg-pink-950/50 border border-pink-900/40 text-pink-400 text-[9px] font-bold px-2 py-0.5">ALLOWLIST</span>}
                {form.blocklist && <span className="rounded-full bg-rose-950/50 border border-rose-900/40 text-rose-400 text-[9px] font-bold px-2 py-0.5">BLOCKLIST</span>}
                {form.memoSupport && <span className="rounded-full bg-teal-950/50 border border-teal-900/40 text-teal-400 text-[9px] font-bold px-2 py-0.5">MEMO</span>}
                {!form.mintable && !form.burnable && !form.pausable && !form.allowlist && !form.blocklist && !form.memoSupport && (
                  <span className="text-xs text-slate-500 italic">None. Pure Standard ERC-20.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Deploy & Payment Section */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 pb-2 border-b border-slate-900">
            <span>Launch Details</span>
            <span>Fee Estimator</span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center text-slate-400">
              <span className="flex items-center space-x-1">
                <span>Base Sequencer Cost</span>
                <HelpCircle className="h-3 w-3 text-slate-600 hover:text-slate-400 cursor-help" />
              </span>
              <span className="font-mono text-white">{networkFee} ETH</span>
            </div>
            
            <div className="flex justify-between items-center text-slate-400">
              <span className="flex items-center space-x-1">
                <span>B20 Factory Creation Fee</span>
                <HelpCircle className="h-3 w-3 text-slate-600 hover:text-slate-400 cursor-help" />
              </span>
              <span className="font-mono text-white">{serviceFee} ETH</span>
            </div>

            <div className="flex justify-between items-center text-slate-400">
              <span>Selected Network</span>
              <span className="flex items-center space-x-1.5 font-bold text-blue-400">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                <span>Base Mainnet</span>
              </span>
            </div>

            <hr className="border-slate-900 my-1" />

            <div className="flex justify-between items-end pt-1">
              <div>
                <span className="text-xs text-slate-500 block">Total Est. Deployment Cost</span>
                <span className="text-xs text-slate-400 font-semibold font-mono">~ {totalUsd} USD</span>
              </div>
              <div className="text-right">
                <span className="font-mono text-xl font-extrabold text-blue-400">{totalEth} ETH</span>
              </div>
            </div>
          </div>

          <button
            id="deploy-token-action-btn"
            onClick={triggerDeploy}
            disabled={!walletAddress}
            className={`w-full mt-4 flex items-center justify-center space-x-2.5 rounded-xl py-4 font-bold text-white transition-all ${
              walletAddress 
                ? 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-950/40 active:scale-95 cursor-pointer' 
                : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <Play className={`h-4.5 w-4.5 fill-current ${walletAddress ? 'text-white' : 'text-slate-600'}`} />
            <span>{walletAddress ? 'Deploy Token on Base' : 'Deploy Token (Wallet Disconnected)'}</span>
          </button>

          {!walletAddress && (
            <div className="flex items-center space-x-2.5 rounded-xl border border-yellow-500/20 bg-yellow-950/10 p-3.5 text-xs text-yellow-500">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Wallet not connected. Please connect your Web3 wallet using the "Connect Wallet" button in the top right.</span>
            </div>
          )}

          <div className="flex items-start space-x-2 text-[10px] text-slate-500 leading-relaxed pt-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              Your code compiles locally using B20 standards, saving 45% on deployment gas. The deployed token will be accessible under the 'My Tokens' tab instantly.
            </span>
          </div>
        </div>

      </div>

      {/* WEB3 TRANSACTION PROGRESS SIMULATOR MODAL */}
      <AnimatePresence>
        {isDeploying && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl space-y-6"
            >
              <div className="text-center space-y-2">
                <h3 className="font-display text-xl font-bold text-white">Smart Contract Deployment</h3>
                <p className="text-xs text-slate-400">Executing B20 compiler & Broadcaster pipeline on Base.</p>
              </div>

              {/* Steps Progress Visuals */}
              <div className="space-y-4 pt-2">
                
                {/* Step 1: Request Wallet Signature */}
                <div className={`flex items-start space-x-3.5 p-3 rounded-xl border transition-all ${
                  deployStep === 0 
                    ? 'border-blue-500/40 bg-blue-950/10' 
                    : deployStep > 0 
                    ? 'border-emerald-500/20 bg-emerald-950/5' 
                    : 'border-slate-900 bg-transparent'
                }`}>
                  <div className="flex shrink-0 h-6 w-6 items-center justify-center rounded-full text-xs font-bold font-mono">
                    {deployStep > 0 ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                    )}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${deployStep >= 0 ? 'text-white' : 'text-slate-600'}`}>1. Signature Request</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Please approve the B20 deployment payload in your connected Coinbase/MetaMask extension.</p>
                  </div>
                </div>

                {/* Step 2: Sequencer Broadcast */}
                <div className={`flex items-start space-x-3.5 p-3 rounded-xl border transition-all ${
                  deployStep === 1 
                    ? 'border-blue-500/40 bg-blue-950/10' 
                    : deployStep > 1 
                    ? 'border-emerald-500/20 bg-emerald-950/5' 
                    : 'border-slate-900 bg-transparent opacity-60'
                }`}>
                  <div className="flex shrink-0 h-6 w-6 items-center justify-center rounded-full text-xs font-bold font-mono">
                    {deployStep > 1 ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : deployStep === 1 ? (
                      <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                    ) : (
                      <CircleDot className="h-4 w-4 text-slate-700" />
                    )}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${deployStep >= 1 ? 'text-white' : 'text-slate-600'}`}>2. Broadcast to Base Sequencer</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Transmitting gas-optimized transaction parameters to Base Mainnet sequencer.</p>
                  </div>
                </div>

                {/* Step 3: Mining contract */}
                <div className={`flex items-start space-x-3.5 p-3 rounded-xl border transition-all ${
                  deployStep === 2 
                    ? 'border-blue-500/40 bg-blue-950/10' 
                    : deployStep > 2 
                    ? 'border-emerald-500/20 bg-emerald-950/5' 
                    : 'border-slate-900 bg-transparent opacity-60'
                }`}>
                  <div className="flex shrink-0 h-6 w-6 items-center justify-center rounded-full text-xs font-bold font-mono">
                    {deployStep > 2 ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : deployStep === 2 ? (
                      <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                    ) : (
                      <CircleDot className="h-4 w-4 text-slate-700" />
                    )}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${deployStep >= 2 ? 'text-white' : 'text-slate-600'}`}>3. Instantiate B20 Smart Contract</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Base gas miners processing contract bytecode. Mapping owner and treasury wallets.</p>
                  </div>
                </div>

                {/* Step 4: Success */}
                <div className={`flex items-start space-x-3.5 p-3 rounded-xl border transition-all ${
                  deployStep === 3 
                    ? 'border-emerald-500/40 bg-emerald-950/10' 
                    : 'border-slate-900 bg-transparent opacity-40'
                }`}>
                  <div className="flex shrink-0 h-6 w-6 items-center justify-center rounded-full text-xs font-bold font-mono">
                    {deployStep === 3 ? (
                      <Sparkles className="h-4.5 w-4.5 text-yellow-400 animate-pulse" />
                    ) : (
                      <CircleDot className="h-4 w-4 text-slate-700" />
                    )}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${deployStep === 3 ? 'text-white' : 'text-slate-600'}`}>4. Successfully Deployed 🎉</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">B20 Token successfully verified and launched on Base Network.</p>
                  </div>
                </div>

              </div>

              {/* Complete Call to Action */}
              {deployStep === 3 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3.5 pt-2 text-center"
                >
                  <div className="rounded-xl bg-slate-900 p-4 border border-slate-800 text-left">
                    <span className="text-[9px] font-mono uppercase text-slate-500 block">Deployed Contract Address</span>
                    <span className="text-[11px] font-mono font-bold text-blue-400 break-all select-all">{generatedAddress}</span>
                  </div>

                  <button
                    id="finish-deployment-btn"
                    onClick={finalizeDeployment}
                    className="w-full flex items-center justify-center space-x-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-3.5 font-bold text-white shadow-lg active:scale-95 transition-all text-sm"
                  >
                    <span>View Deployed Token</span>
                  </button>
                </motion.div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
