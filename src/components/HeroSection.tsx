import { ArrowUpRight, Flame, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroSectionProps {
  onLaunchToken: () => void;
  onLearnMore: () => void;
}

export default function HeroSection({ onLaunchToken, onLearnMore }: HeroSectionProps) {
  // Stagger animation container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 80, damping: 15 },
    },
  };

  const floatingCards = [
    {
      name: 'Base Alpha',
      symbol: '$BALPHA',
      color: 'from-blue-600 via-indigo-500 to-purple-600',
      glow: 'shadow-blue-500/20',
      supply: '1,000,000,000',
      type: 'Utility Token',
      price: '$0.0421',
      change: '+14.2%',
      features: ['Mintable', 'Burnable'],
      chart: [20, 35, 25, 45, 60, 50, 75],
    },
    {
      name: 'Zora Essence',
      symbol: '$ZESS',
      color: 'from-pink-500 via-rose-500 to-yellow-500',
      glow: 'shadow-pink-500/20',
      supply: '10,000,000',
      type: 'Asset-Backed',
      price: '$1.84',
      change: '+22.8%',
      features: ['Pausable', 'Blocklist'],
      chart: [40, 42, 58, 55, 70, 85, 98],
    },
    {
      name: 'Farcaster Cast',
      symbol: '$CAST',
      color: 'from-purple-600 via-fuchsia-500 to-pink-500',
      glow: 'shadow-purple-500/20',
      supply: '88,000,000',
      type: 'Asset Token',
      price: '$0.125',
      change: '-2.4%',
      features: ['Burnable', 'Allowlist'],
      chart: [80, 75, 78, 62, 58, 65, 61],
    },
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pb-28 lg:pt-20">
      
      {/* Background Gradients and Circle Accents */}
      <div className="absolute top-0 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />
      <div className="absolute top-[20%] right-[10%] -z-10 h-[300px] w-[300px] rounded-full bg-purple-600/10 blur-[100px]" />
      <div className="absolute bottom-[5%] left-[5%] -z-10 h-[350px] w-[350px] rounded-full bg-indigo-500/5 blur-[120px]" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-30" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Promo Badge */}
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center space-x-1.5 rounded-full border border-blue-500/30 bg-blue-950/40 px-3 py-1 text-xs font-semibold text-blue-400"
            >
              <Sparkles className="h-3.5 w-3.5 text-blue-400 animate-spin" style={{ animationDuration: '3s' }} />
              <span>Base Native Standard</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              variants={itemVariants}
              className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl"
            >
              Deploy Native <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-yellow-400 bg-clip-text text-transparent">
                B20 Tokens
              </span>{' '}
              on Base
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              variants={itemVariants}
              className="mx-auto lg:mx-0 max-w-xl text-base text-slate-400 sm:text-lg md:text-xl"
            >
              Create your own Base native token in minutes without coding. 
              Fully customizable features, advanced treasury settings, and instant live preview.
            </motion.p>

            {/* Actions */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <button
                id="hero-launch-btn"
                onClick={onLaunchToken}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 text-center flex items-center justify-center space-x-2"
              >
                <span>Launch Token</span>
                <ArrowUpRight className="h-5 w-5" />
              </button>
              
              <button
                id="hero-learn-btn"
                onClick={onLearnMore}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all text-center"
              >
                Learn More
              </button>
            </motion.div>

            {/* Mini stats */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-900 max-w-md mx-auto lg:mx-0"
            >
              <div>
                <p className="text-xl font-bold text-white font-display">12,480+</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Tokens Deployed</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white font-display">0.0001 ETH</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Gas Saving fee</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white font-display">100%</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Verified Audited</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Token Card Column */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center h-[420px] sm:h-[480px]">
            {floatingCards.map((card, idx) => (
              <motion.div
                key={card.symbol}
                initial={{ opacity: 0, scale: 0.8, x: idx === 0 ? -40 : idx === 1 ? 40 : 0, y: idx * 40 + 30 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  x: idx === 0 ? -25 : idx === 1 ? 30 : 0,
                  y: idx * 55,
                  z: 10 - idx
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: idx * 55 - 15,
                  z: 20, 
                  transition: { duration: 0.2 } 
                }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 70, 
                  damping: 14,
                  delay: 0.3 + idx * 0.15 
                }}
                className={`absolute w-full max-w-[280px] sm:max-w-[320px] rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 to-slate-900/90 p-5 shadow-2xl ${card.glow} cursor-pointer backdrop-blur-md`}
                style={{
                  top: `${10 + idx * 10}%`,
                  zIndex: 10 - idx
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r ${card.color} text-white font-bold font-display shadow-lg`}>
                      {card.symbol[1]}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-white text-sm sm:text-base">{card.name}</h4>
                      <p className="font-mono text-[10px] text-slate-400">{card.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-white">{card.symbol}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-baseline justify-between border-t border-slate-900 pt-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">Live Price</p>
                    <p className="font-mono text-sm font-semibold text-white">{card.price}</p>
                  </div>
                  <div className="flex items-center space-x-1 rounded-full bg-emerald-950/40 px-2 py-0.5 text-xs font-medium text-emerald-400">
                    <TrendingUp className="h-3 w-3" />
                    <span>{card.change}</span>
                  </div>
                </div>

                {/* Simulated Chart sparkline */}
                <div className="mt-3 h-8 flex items-end justify-between px-1">
                  {card.chart.map((val, i) => (
                    <div
                      key={i}
                      className={`w-1.5 rounded-t bg-gradient-to-t ${card.color}`}
                      style={{ height: `${val}%`, opacity: 0.3 + (i / 10) }}
                    />
                  ))}
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-slate-900/60">
                  {card.features.map(f => (
                    <span key={f} className="inline-flex items-center rounded-full bg-slate-900 border border-slate-800 px-2 py-0.5 text-[9px] font-medium text-slate-400">
                      {f}
                    </span>
                  ))}
                  <span className="ml-auto inline-flex items-center text-[10px] text-slate-500 font-mono">
                    Supply: {card.supply.split(',')[0]}M
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
