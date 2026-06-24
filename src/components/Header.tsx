import { useState } from 'react';
import { Compass, Shield, FileText, Activity } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface HeaderProps {
  activeTab: 'home' | 'deploy' | 'docs' | 'my-tokens';
  setActiveTab: (tab: 'home' | 'deploy' | 'docs' | 'my-tokens') => void;
  walletAddress: string | null;
  setWalletAddress?: (address: string | null) => void;
  walletBalance: string;
  setWalletBalance?: (balance: string) => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  walletAddress,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div 
          className="flex cursor-pointer items-center space-x-2.5" 
          onClick={() => setActiveTab('home')}
          id="logo-container"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <div className="absolute h-6 w-6 rounded-full border-2 border-white"></div>
            <div className="absolute h-3.5 w-3.5 rounded-full bg-yellow-400"></div>
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-white sm:block">
            Base <span className="text-blue-500">B20</span> Launchpad
          </span>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-1">
          <button
            id="nav-home"
            onClick={() => setActiveTab('home')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'home'
                ? 'bg-blue-950/50 text-blue-400 border border-blue-800/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>Home</span>
          </button>
          
          <button
            id="nav-deploy"
            onClick={() => setActiveTab('deploy')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'deploy'
                ? 'bg-blue-950/50 text-blue-400 border border-blue-800/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <Shield className="h-4 w-4" />
            <span>Deploy Token</span>
          </button>

          <button
            id="nav-my-tokens"
            onClick={() => setActiveTab('my-tokens')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'my-tokens'
                ? 'bg-blue-950/50 text-blue-400 border border-blue-800/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>My Tokens</span>
          </button>
          
          <button
            id="nav-docs"
            onClick={() => setActiveTab('docs')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'docs'
                ? 'bg-blue-950/50 text-blue-400 border border-blue-800/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Docs</span>
          </button>
        </nav>

        {/* Right Action: Wallet Connection */}
        <div className="flex items-center space-x-3">
          <ConnectButton 
            showBalance={true}
            chainStatus="icon"
            accountStatus={{
              smallScreen: 'avatar',
              largeScreen: 'full',
            }}
          />
        </div>
      </div>
    </header>
  );
}
