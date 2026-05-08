/*
|-----------------------------------------
| setting up TooManyRequest for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Timer, RefreshCw, ShieldAlert, Zap } from 'lucide-react';

interface TooManyRequestsProps {
  message?: string;
  retrySeconds?: number;
}

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const TooManyRequests: React.FC<TooManyRequestsProps> = ({ message = 'System Cooldown Active', retrySeconds = 30 }) => {
  const [countdown, setCountdown] = useState(retrySeconds);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleRetry = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className=" flex items-center justify-center min-h-screen bg-[#050505] overflow-hidden relative px-4 selection:bg-red-500/30">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-900/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-lg relative z-10">
        <div className="bg-neutral-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
          <div className="relative h-40 flex items-center justify-center bg-gradient-to-b from-red-500/10 via-transparent to-transparent">
            <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0],
              }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="relative"
            >
              <div className="absolute inset-0 bg-red-500 blur-3xl opacity-30 animate-pulse" />
              <div className="relative bg-neutral-950 p-6 rounded-3xl border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.15)]">
                <ShieldAlert className="w-14 h-14 text-red-500" />
              </div>
            </motion.div>

            <div className="absolute top-6 right-8">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-[0.2em]">Restricted</span>
              </div>
            </div>
          </div>

          <div className="px-10 pb-12 pt-4 flex flex-col items-center">
            <motion.h3 variants={itemVariants} className="text-3xl md:text-4xl font-black text-center text-white mb-3 tracking-tight">
              {message}
            </motion.h3>

            <motion.p variants={itemVariants} className="text-neutral-400 text-center text-sm md:text-base mb-10 max-w-[320px] leading-relaxed">
              Maximum request threshold reached. Access will be restored shortly.
            </motion.p>

            <motion.div variants={itemVariants} className="w-full space-y-8">
              <div className="relative">
                <div className="flex justify-between items-end mb-3 px-1">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                    <Timer className="w-3.5 h-3.5" />
                    Cooldown Synchronization
                  </span>
                  <span className="text-2xl font-mono font-bold text-white tabular-nums">
                    {countdown}
                    <span className="text-red-500 text-sm ml-1">S</span>
                  </span>
                </div>

                <div className="h-4 bg-neutral-800/50 rounded-full overflow-hidden p-1 border border-white/5">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-red-400 relative"
                    initial={{ width: '100%' }}
                    animate={{ width: `${(countdown / retrySeconds) * 100}%` }}
                    transition={{ duration: 1, ease: 'linear' }}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[size:20px_20px] animate-[shimmer_2s_linear_infinite]" />
                  </motion.div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={handleRetry}
                  disabled={countdown > 0}
                  className={`group relative h-16 w-full rounded-2xl overflow-hidden transition-all duration-500 transform ${
                    countdown > 0
                      ? 'bg-neutral-800/50 text-neutral-500 cursor-not-allowed border border-white/5'
                      : 'bg-white text-black hover:scale-[1.02] active:scale-[0.98] shadow-[0_20px_40px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {countdown > 0 ? (
                      <motion.div
                        key="locked"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-center gap-3 font-bold uppercase text-[11px] tracking-[0.2em]"
                      >
                        <Zap className="w-4 h-4 fill-neutral-600" />
                        Awaiting Sync: {countdown}s
                      </motion.div>
                    ) : (
                      <motion.div
                        key="active"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-3 font-bold uppercase text-[11px] tracking-[0.2em]"
                      >
                        <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700 ease-out" />
                        Re-initialize Session
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>

                <p className="text-[10px] text-center text-neutral-600 font-bold tracking-[0.3em] uppercase opacity-50">Instance ID: 429-RT-LMT</p>
              </div>
            </motion.div>
          </div>

          <div className="bg-neutral-950/80 py-5 px-10 border-t border-white/5 flex items-center justify-between">
            <span className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.2em]">Protocol v2.0.4</span>
            <div className="flex gap-1.5">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-red-500/20" />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 40px 0;
          }
        }
      `}</style>
    </div>
  );
};

export default TooManyRequests;
