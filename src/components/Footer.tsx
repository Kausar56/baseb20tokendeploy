import { Compass, Shield, FileText, Activity, Github, Twitter, MessageSquare, ExternalLink } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: 'home' | 'deploy' | 'docs' | 'my-tokens') => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-400 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                <div className="absolute h-5.5 w-5.5 rounded-full border-2 border-white"></div>
                <div className="absolute h-3 w-3 rounded-full bg-yellow-400"></div>
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-white">
                Base <span className="text-blue-500">B20</span> Launchpad
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              The premier, gas-optimized token launcher built native to the Base L2 ecosystem. Design, test, and broadcast custom B20 tokens with zero coding required.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display">Launchpad</h4>
            <ul className="space-y-1.5 text-xs font-medium">
              <li>
                <button 
                  onClick={() => setActiveTab('home')} 
                  className="hover:text-white transition-all text-left flex items-center space-x-1"
                >
                  <Compass className="h-3 w-3 text-slate-600" />
                  <span>Launchpad Home</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('deploy')} 
                  className="hover:text-white transition-all text-left flex items-center space-x-1"
                >
                  <Shield className="h-3 w-3 text-slate-600" />
                  <span>Configure & Deploy</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('my-tokens')} 
                  className="hover:text-white transition-all text-left flex items-center space-x-1"
                >
                  <Activity className="h-3 w-3 text-slate-600" />
                  <span>My Active Tokens</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('docs')} 
                  className="hover:text-white transition-all text-left flex items-center space-x-1"
                >
                  <FileText className="h-3 w-3 text-slate-600" />
                  <span>Technical Docs</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Ecosystem Column */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display">Resources</h4>
            <ul className="space-y-1.5 text-xs font-medium">
              <li>
                <a href="https://base.org" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center space-x-1">
                  <span>Base Ecosystem</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </li>
              <li>
                <a href="https://coinbase.com/wallet" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center space-x-1">
                  <span>Coinbase Wallet</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </li>
              <li>
                <a href="https://warpcast.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center space-x-1">
                  <span>Farcaster warp</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Social icons */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display">Socials</h4>
            <div className="flex items-center space-x-2.5">
              <a 
                href="https://twitter.com/base" 
                target="_blank" 
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="https://github.com/base-org" 
                target="_blank" 
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
                title="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a 
                href="https://warpcast.com/~/channel/base" 
                target="_blank" 
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Farcaster"
              >
                <MessageSquare className="h-4 w-4" />
              </a>
            </div>
          </div>

        </div>

        <hr className="border-slate-900" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-600 font-medium">
          <p>© 2026 Base B20 Launchpad. Built for the Base ecosystem. No smart contract guarantees implied.</p>
          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Cookies Settings</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
