/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

import React, { useMemo, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

import { ISection9Data, defaultDataSection9, Section9Props } from './data';

const ClientSection9: React.FC<Section9Props> = ({ data }) => {
  const [isHovered, setIsHovered] = useState(false);

  const sectionData: ISection9Data = useMemo(() => {
    if (!data) return defaultDataSection9;
    try {
      return typeof data === 'string' ? JSON.parse(data) : data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return defaultDataSection9;
    }
  }, [data]);

  return (
    <section className="relative h-screen w-full snap-center flex items-center justify-center bg-zinc-950 overflow-hidden z-20">
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] mix-blend-screen" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-10 max-w-5xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-sm shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)]">
            <Sparkles size={12} />
            <span>Start Your Journey</span>
          </div>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-none mb-6 drop-shadow-2xl">{sectionData.title}</h2>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light">{sectionData.subTitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Link
            href={sectionData.buttonUrl || '#'}
            className="group relative inline-block px-10 py-5 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full text-white font-bold text-lg md:text-xl shadow-[0_0_40px_-10px_rgba(79,70,229,0.4)] overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(79,70,229,0.6)]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />

            <span className="relative flex items-center gap-3">
              {sectionData.buttonText}
              <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
            </span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-zinc-700 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};

export default ClientSection9;
