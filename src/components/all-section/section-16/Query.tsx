/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, ShieldAlert, MoreHorizontal, X, Check, User, Activity } from 'lucide-react';

import { cn } from '@/lib/utils';

import { DashboardMetric, ModerationItem, defaultDataSection16 } from './data';

interface ISection16Data {
  id?: string;
  badge?: string;
  title?: string;
  subTitle?: string;
  metrics: DashboardMetric[];
  moderationQueue: ModerationItem[];
}

interface Section16Props {
  data?: ISection16Data | string;
}

const QuerySection16: React.FC<Section16Props> = ({ data }) => {
  const [queue, setQueue] = useState<ModerationItem[]>([]);

  const sectionData: ISection16Data = useMemo(() => {
    let parsed = defaultDataSection16;
    if (data) {
      try {
        parsed = typeof data === 'string' ? JSON.parse(data) : data;
      } catch (e) {
        console.error('Failed to parse section data', e);
      }
    }
    if (parsed.moderationQueue) {
      setQueue(parsed.moderationQueue);
    }
    return parsed;
  }, [data]);

  const handleModerationAction = (id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
  };

  return (
    <section className="relative w-full py-16 md:py-24 bg-zinc-950 overflow-hidden font-mono text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-zinc-950 via-transparent to-zinc-950" />

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] animate-pulse delay-700" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 border-b border-white/5 pb-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest"
            >
              <Activity size={12} />
              <span>{sectionData.badge || 'System Monitor'}</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-black text-white tracking-tight"
            >
              {sectionData.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-zinc-400 mt-2 font-sans"
            >
              {sectionData.subTitle}
            </motion.p>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            System Operational
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sectionData.metrics?.map((metric, i) => (
            <MetricCard key={metric.id} metric={metric} index={i} />
          ))}
        </div>

        <div className="space-y-6 pt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2 text-zinc-200">
              <ShieldAlert className="text-rose-500" size={20} />
              Moderation Queue
              <span className="bg-zinc-800 text-zinc-300 text-xs px-2 py-0.5 rounded-full ml-2 border border-white/5">{queue.length}</span>
            </h3>
            <div className="text-xs text-zinc-500 font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500/50" />
              Real-time Feed
            </div>
          </div>

          <div className="space-y-3 min-h-[300px]">
            <AnimatePresence mode="popLayout">
              {queue.length > 0 ? (
                queue.map(item => <ModerationRow key={item.id} item={item} onAction={handleModerationAction} />)
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-64 flex flex-col items-center justify-center p-12 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20 text-zinc-500"
                >
                  <CheckCircle className="w-12 h-12 mb-4 text-emerald-500/50" />
                  <p>All caught up. No pending items.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

const MetricCard = ({ metric, index }: { metric: DashboardMetric; index: number }) => {
  const isStable = metric.status === 'stable';
  const isCritical = metric.status === 'critical';
  const TrendIcon = metric.trend > 0 ? TrendingUp : metric.trend < 0 ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        'p-6 rounded-2xl border bg-zinc-900/40 backdrop-blur-sm relative overflow-hidden group hover:bg-zinc-900/60 transition-all duration-300',
        isStable ? 'border-zinc-800 hover:border-emerald-500/30' : isCritical ? 'border-rose-500/30 bg-rose-950/5' : 'border-amber-500/30 bg-amber-950/5',
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest group-hover:text-zinc-300 transition-colors">{metric.label}</span>
        {metric.status !== 'stable' && <AlertTriangle size={14} className={isCritical ? 'text-rose-500' : 'text-amber-500'} />}
      </div>

      <div className="text-3xl font-black text-white mb-3 tracking-tight font-sans">{metric.value}</div>

      <div className="flex items-center gap-3">
        <span
          className={cn(
            'flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md border',
            metric.trend > 0
              ? 'text-emerald-400 bg-emerald-950/30 border-emerald-500/20'
              : metric.trend < 0
                ? 'text-rose-400 bg-rose-950/30 border-rose-500/20'
                : 'text-zinc-400 bg-zinc-800 border-zinc-700',
          )}
        >
          <TrendIcon size={10} />
          {Math.abs(metric.trend)}%
        </span>
        <span className="text-[10px] text-zinc-600 font-sans">vs last hour</span>
      </div>

      <div
        className={cn(
          'absolute bottom-0 right-0 w-32 h-32 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none',
          isStable ? 'bg-emerald-500' : isCritical ? 'bg-rose-500' : 'bg-amber-500',
        )}
      />
    </motion.div>
  );
};

const ModerationRow = ({ item, onAction }: { item: ModerationItem; onAction: (id: string) => void }) => {
  const isHighSeverity = item.severity === 'high';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={cn(
        'flex flex-col md:flex-row gap-4 p-4 rounded-xl border bg-zinc-900/40 backdrop-blur-sm transition-all hover:bg-zinc-900/80',
        isHighSeverity ? 'border-rose-500/20 shadow-[0_0_15px_-5px_rgba(244,63,94,0.1)]' : 'border-zinc-800',
      )}
    >
      <div className="flex md:flex-col items-center md:items-start gap-3 md:w-40 md:shrink-0 md:border-r border-white/5 md:pr-4">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700">
            {item.author.avatar ? (
              <Image src={item.author.avatar} alt={item.author.name} fill className="object-cover" />
            ) : (
              <User className="m-2 text-zinc-500" />
            )}
          </div>
          <div
            className={cn(
              'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-zinc-900 flex items-center justify-center text-[8px] font-bold text-white shadow-sm',
              item.author.trustScore > 80 ? 'bg-emerald-500' : item.author.trustScore < 40 ? 'bg-rose-500' : 'bg-amber-500',
            )}
          >
            {item.author.trustScore}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-zinc-200 truncate font-sans">{item.author.name}</p>
          <p className="text-[10px] text-zinc-500">{item.timestamp}</p>
        </div>
      </div>

      <div className="flex-1 space-y-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              'text-[10px] uppercase font-bold px-2 py-0.5 rounded border tracking-wide',
              item.severity === 'high'
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                : item.severity === 'medium'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700',
            )}
          >
            {item.severity} Priority
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 uppercase tracking-wide">{item.type}</span>
          <span className="text-xs text-zinc-500 font-medium ml-1">• {item.flagReason}</span>
        </div>
        <p className="text-sm text-zinc-300 leading-relaxed font-sans bg-black/20 p-3 rounded-lg border border-white/5 shadow-inner">{item.content}</p>
      </div>

      <div className="flex md:flex-col justify-end gap-2 md:pl-2 md:border-l border-white/5">
        <button
          onClick={() => onAction(item.id)}
          className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-900/10"
          title="Approve"
        >
          <Check size={16} />
        </button>
        <button
          onClick={() => onAction(item.id)}
          className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-900/10"
          title="Reject / Ban"
        >
          <X size={16} />
        </button>
        <button className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors md:mt-auto border border-white/5">
          <MoreHorizontal size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default QuerySection16;
