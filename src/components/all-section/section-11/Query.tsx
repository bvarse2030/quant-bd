/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import React, { useRef, useEffect, useState, useMemo } from 'react';

import { ISection11Data, defaultDataSection11, Section11Props, IStory } from './data';

const SnakeLine = ({ count, viewportHeight }: { count: number; viewportHeight: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const totalHeight = count * viewportHeight;

  const generateReelPath = () => {
    const width = 200;
    const center = width / 2;
    const amplitude = 80;

    let d = `M ${center} 0`;

    for (let i = 0; i < count; i++) {
      const boxTop = i * viewportHeight;
      const boxCenter = boxTop + viewportHeight / 2;

      if (i === 0) {
        d = `M ${center} ${boxCenter}`;
      } else {
        const prevBoxCenter = (i - 1) * viewportHeight + viewportHeight / 2;
        const direction = i % 2 === 0 ? 1 : -1;
        const controlX = center + amplitude * direction;

        d += ` C ${controlX} ${prevBoxCenter + viewportHeight / 2}, 
                  ${controlX} ${boxCenter - viewportHeight / 2}, 
                  ${center} ${boxCenter}`;
      }
    }
    d += ` L ${center} ${totalHeight}`;
    return d;
  };

  const pathString = generateReelPath();

  return (
    <div ref={containerRef} className="absolute left-1/2 top-0 -translate-x-1/2 w-[200px] h-full hidden md:block z-0 pointer-events-none">
      <svg className="w-full h-full overflow-visible" viewBox={`0 0 200 ${totalHeight}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="neonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.2" />
            <stop offset="20%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#d946ef" />
            <stop offset="80%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path d={pathString} fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="4" strokeLinecap="round" />

        <motion.path
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
          d={pathString}
          fill="none"
          stroke="url(#neonGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeOpacity="0.5"
          filter="url(#glow)"
        />

        <motion.path
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
          d={pathString}
          fill="none"
          stroke="url(#neonGradient)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

const ReelStory = ({ item, index }: { item: IStory; index: number }) => {
  const isEven = index % 2 === 0;
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5, once: false });

  return (
    <section ref={ref} className="h-screen w-full snap-center snap-always flex items-center justify-center relative overflow-hidden">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-30 pointer-events-none">
        <motion.div
          animate={isInView ? { scale: [1, 1.5, 1], opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative"
        >
          <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)] z-20 relative" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-indigo-400 animate-ping opacity-50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-indigo-500/20 blur-xl" />
        </motion.div>
      </div>

      <div
        className={`w-full max-w-7xl mx-auto px-4 md:px-12 flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center justify-between h-full py-20 md:py-0`}
      >
        <div
          className={`w-full md:w-[45%] h-[40vh] md:h-full flex items-center justify-center ${isEven ? 'md:justify-end md:pr-16' : 'md:justify-start md:pl-16'}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: isEven ? -50 : 50, rotateY: isEven ? 20 : -20 }}
            animate={isInView ? { opacity: 1, scale: 1, x: 0, rotateY: 0 } : {}}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.3 }}
            className="relative w-64 md:w-72 aspect-[3/4] group"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600">No Image</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-0 left-0 w-full p-4 md:hidden">
                <p className="text-white font-bold text-lg">{item.name}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div
          className={`w-full md:w-[45%] flex flex-col justify-center items-center md:items-start text-center md:text-left ${isEven ? 'md:pl-16' : 'md:pr-16 md:items-end md:text-right'}`}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-md"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold tracking-widest uppercase mb-4">
              {item.university}
            </span>
            <h2 className="hidden md:block text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">{item.name}</h2>
            <h3 className="text-xl text-fuchsia-300 font-serif italic mb-6">{item.subject}</h3>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">{item.description}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ClientSection11: React.FC<Section11Props> = ({ data }) => {
  const [vpHeight, setVpHeight] = useState(0);

  const sectionData: ISection11Data = useMemo(() => {
    if (!data) return defaultDataSection11;
    try {
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch (e) {
      console.error('Failed to parse section data', e);
      return defaultDataSection11;
    }
  }, [data]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setVpHeight(window.innerHeight);
      const handleResize = () => setVpHeight(window.innerHeight);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <section className="bg-slate-950 text-slate-100 overflow-hidden relative selection:bg-fuchsia-500/30">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-[-10%] w-[50vw] h-[50vw] bg-indigo-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-[-10%] w-[50vw] h-[50vw] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full">
        <div className="relative w-full">
          {vpHeight > 0 && <SnakeLine count={sectionData.stories.length} viewportHeight={vpHeight} />}

          {sectionData.stories.map((story, index) => (
            <ReelStory key={story.id} item={story} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientSection11;
