/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Quote, Sparkles } from 'lucide-react';

import { ISection10Data, defaultDataSection10, Section10Props } from './data';

const ClientSection10: React.FC<Section10Props> = ({ data }) => {
  const sectionData: ISection10Data = useMemo(() => {
    if (!data) return defaultDataSection10;
    try {
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch (e) {
      console.error('Failed to parse section data', e);
      return defaultDataSection10;
    }
  }, [data]);

  return (
    <section className="relative h-screen w-full snap-center flex flex-col items-center justify-center bg-zinc-950 overflow-hidden z-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 backdrop-blur-sm shadow-xl shadow-indigo-500/10"
          >
            <Quote className="w-8 h-8 text-indigo-400" />
          </motion.div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white mb-8 leading-[0.9]">
            {sectionData.title}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400">{sectionData.subTitle}</span>
          </h1>

          <motion.div className="h-1.5 bg-zinc-800 rounded-full mb-8" />

          <p className="text-xl md:text-2xl text-zinc-400 max-w-xl mx-auto mb-16 font-light leading-relaxed">{sectionData.description}</p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex flex-col items-center gap-3 text-zinc-500"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-600">Discover</span>
            <div className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm animate-bounce">
              <ChevronDown className="w-5 h-5 text-indigo-400" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              scale: 0,
              opacity: 0,
            }}
            animate={{
              top: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              left: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              scale: [0, 1, 0],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <Sparkles size={20 + Math.random() * 30} className="text-indigo-500/20" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ClientSection10;
