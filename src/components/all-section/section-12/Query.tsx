/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import React, { useMemo, useRef } from 'react';
import { motion, useScroll, useSpring, useInView } from 'framer-motion';
import { Briefcase, Trophy, Zap, Calendar, ArrowUpRight, CheckCircle2 } from 'lucide-react';

import { ISection12Data, defaultDataSection12, Section12Props, IExperienceItem } from './data';

const ExperienceCard = ({ item, index }: { item: IExperienceItem; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative pl-8 md:pl-0"
    >
      <div className="absolute left-0 top-0 bottom-0 w-px bg-zinc-800 md:hidden">
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-zinc-950" />
      </div>

      <div className={`flex flex-col md:flex-row gap-8 md:gap-32 items-start group ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
        <div className={`hidden md:flex flex-col justify-center w-full md:w-5/12 ${index % 2 === 0 ? 'items-end text-right' : 'items-start text-left'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 font-mono text-sm font-bold shadow-xl transition-transform duration-300 group-hover:scale-105">
            <Calendar size={14} />
            {item.year}
          </div>
        </div>

        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-zinc-800 justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="sticky top-1/2 w-4 h-4 rounded-full bg-zinc-950 border-4 border-emerald-500 z-10 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
          />
        </div>

        <div className="w-full md:w-5/12 relative">
          <div className="md:hidden mb-4">
            <span className="inline-block px-3 py-1 rounded-md bg-zinc-900 text-emerald-400 text-xs font-bold border border-zinc-800">{item.year}</span>
          </div>

          <div className="group/card relative bg-zinc-900/50 border border-zinc-800 p-6 md:p-8 rounded-3xl hover:border-emerald-500/30 hover:bg-zinc-900/80 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-900/10">
            <div className="absolute -inset-px bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none blur-lg" />

            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover/card:text-emerald-400 transition-colors">{item.role}</h3>
                  <div className="flex items-center gap-2 text-zinc-400 mt-1 font-medium">
                    <Briefcase size={14} />
                    {item.companyName}
                  </div>
                </div>
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 group-hover/card:border-emerald-500/30 transition-colors shrink-0">
                  <div className="text-center">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">{item.highlightMilestone.label}</div>
                    <div className="text-lg font-black text-emerald-400 leading-none">{item.highlightMilestone.value}</div>
                  </div>
                </div>
              </div>

              <p className="text-zinc-400 leading-relaxed text-sm md:text-base">{item.description}</p>

              <div className="pt-6 border-t border-zinc-800/50 space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-950/10 border border-emerald-500/10 group-hover/card:bg-emerald-950/20 transition-colors">
                  <div className="mt-0.5 p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
                    <Trophy size={12} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider block">Key Achievement</span>
                    <p className="text-zinc-300 text-sm font-medium">{item.lastAchievement}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {item.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 group-hover/card:border-zinc-700 transition-colors"
                    >
                      <Zap size={10} className="text-emerald-500/70" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <ArrowUpRight className="absolute top-6 right-6 text-zinc-800 w-6 h-6 group-hover/card:text-emerald-500/50 transition-colors" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ClientSection12: React.FC<Section12Props> = ({ data }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const sectionData: ISection12Data = useMemo(() => {
    if (!data) return defaultDataSection12;
    try {
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch (e) {
      console.error('Failed to parse section data', e);
      return defaultDataSection12;
    }
  }, [data]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-zinc-950 py-24 md:py-32 overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-100"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-emerald-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-teal-600/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-soft-light"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 md:mb-32 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest"
          >
            <Briefcase size={12} />
            <span>Career Path</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight"
          >
            {sectionData.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">{sectionData.subTitle}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-400 leading-relaxed"
          >
            {sectionData.description}
          </motion.p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-zinc-900 hidden md:block">
            <motion.div style={{ scaleY, transformOrigin: 'top' }} className="w-full h-full bg-gradient-to-b from-emerald-500 via-teal-500 to-zinc-900" />
          </div>

          <div className="space-y-12 md:space-y-24">
            {sectionData.experiences.map((item, index) => (
              <ExperienceCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-24 flex justify-center">
          <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span>Open for new opportunities</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ClientSection12;
