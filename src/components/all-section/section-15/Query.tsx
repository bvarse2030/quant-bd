/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useMemo, useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight, X, User, Quote as QuoteIcon, Sparkles, Hash } from 'lucide-react';

import { ISection15Data, defaultDataSection15 } from './data';

interface Section15Props {
  data?: ISection15Data | string;
}

const QuerySection15: React.FC<Section15Props> = ({ data }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  const sectionData: ISection15Data = useMemo(() => {
    if (!data) return defaultDataSection15[0];
    try {
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      return Array.isArray(parsed) ? parsed[0] : parsed;
    } catch (e) {
      console.error('Failed to parse section data', e);
      return defaultDataSection15[0];
    }
  }, [data]);

  useEffect(() => {
    if (selectedArticle) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedArticle]);

  return (
    <section className="relative w-full py-24 bg-zinc-950 overflow-hidden min-h-screen font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-soft-light" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest"
          >
            <Sparkles size={12} />
            <span>{sectionData.badge}</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tight"
          >
            {sectionData.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{sectionData.subTitle}</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sectionData.allData &&
            sectionData.allData.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} onClick={() => setSelectedArticle(article)} />
            ))}
        </div>
      </div>

      <AnimatePresence>{selectedArticle && <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />}</AnimatePresence>
    </section>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ArticleCard = ({ article, index, onClick }: { article: any; index: number; onClick: () => void }) => {
  return (
    <motion.div
      layoutId={`card-container-${article.id}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
      onClick={onClick}
      className="group cursor-pointer relative flex flex-col h-full bg-zinc-900/40 border border-zinc-800/60 rounded-[2rem] overflow-hidden hover:border-indigo-500/30 hover:bg-zinc-900/60 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-900/10"
    >
      <div className="relative h-64 w-full overflow-hidden">
        <motion.div layoutId={`hero-image-${article.id}`} className="w-full h-full relative">
          {article.heroImage ? (
            <Image src={article.heroImage} alt={article.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
              <Sparkles className="text-zinc-700" size={48} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60" />
        </motion.div>

        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 rounded-full bg-zinc-950/50 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">
            {article.category}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-grow p-6 relative">
        <div className="space-y-3 mb-6">
          <motion.h3 layoutId={`title-${article.id}`} className="text-xl font-bold text-zinc-100 leading-snug group-hover:text-indigo-300 transition-colors">
            {article.title}
          </motion.h3>
          <p className="text-zinc-400 text-sm line-clamp-2 leading-relaxed">{article.subtitle}</p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-6 border-t border-zinc-800 group-hover:border-zinc-700/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-zinc-700 bg-zinc-800">
              {article.author.avatar ? (
                <Image src={article.author.avatar} alt={article.author.name} fill className="object-cover" />
              ) : (
                <User size={16} className="m-2 text-zinc-500" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-zinc-200">{article.author.name}</span>
              <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                {article.publishedAt} • {article.readTime}
              </span>
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 transform group-hover:-rotate-45">
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ArticleModal = ({ article, onClose }: { article: any; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 overflow-hidden"
    >
      <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-xl" onClick={onClose} />

      <motion.div
        layoutId={`card-container-${article.id}`}
        className="relative w-full h-full md:h-[90vh] md:max-w-5xl bg-zinc-950 md:rounded-3xl border border-white/5 shadow-2xl overflow-hidden flex flex-col"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all hover:rotate-90 duration-300"
        >
          <X size={20} />
        </button>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="relative w-full h-[50vh] min-h-[400px]">
            <motion.div layoutId={`hero-image-${article.id}`} className="w-full h-full relative">
              {article.heroImage && <Image src={article.heroImage} alt={article.title} fill className="object-cover" priority />}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/60 to-transparent" />
            </motion.div>

            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 max-w-4xl">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-md">{article.category}</span>
                <span className="flex items-center gap-1 text-zinc-300 text-xs font-mono bg-black/30 backdrop-blur px-2 py-1 rounded">
                  <Clock size={12} /> {article.readTime}
                </span>
              </motion.div>

              <motion.h1
                layoutId={`title-${article.id}`}
                className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 shadow-black drop-shadow-lg"
              >
                {article.title}
              </motion.h1>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center gap-4 text-zinc-300">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-500">
                    {article.author.avatar ? (
                      <Image src={article.author.avatar} alt={article.author.name} fill className="object-cover" />
                    ) : (
                      <User className="m-2" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{article.author.name}</p>
                    <p className="text-xs opacity-70">{article.author.role}</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={14} /> {article.publishedAt}
                </div>
              </motion.div>
            </div>
          </div>

          <div className="px-6 md:px-12 py-12 max-w-4xl mx-auto space-y-12 pb-24">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl md:text-2xl font-medium text-zinc-200 leading-relaxed border-l-4 border-indigo-500 pl-6"
            >
              {article.subtitle}
            </motion.p>

            <div className="space-y-8">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {article.content && article.content.map((block: any, i: number) => <ContentBlock key={i} block={block} index={i} />)}
            </div>

            <div className="pt-12 border-t border-white/10 mt-12">
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-wider mb-4">Related Topics</p>
              <div className="flex flex-wrap gap-2">
                {article.tags &&
                  article.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 text-sm hover:text-white hover:border-indigo-500/50 transition-colors cursor-default"
                    >
                      <Hash size={12} className="text-indigo-500" /> {tag}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ContentBlock = ({ block }: { block: any; index: number }) => {
  const commonAnim = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { delay: 0.1, duration: 0.5 },
  };

  switch (block.type) {
    case 'heading':
      return (
        <motion.h3 {...commonAnim} className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6">
          {block.content}
        </motion.h3>
      );

    case 'text':
      return (
        <motion.p {...commonAnim} className="text-lg text-zinc-400 leading-8">
          {block.content}
        </motion.p>
      );

    case 'quote':
      return (
        <motion.div {...commonAnim} className="my-10 relative">
          <QuoteIcon className="absolute top-[-20px] left-[-10px] text-indigo-500/20 w-16 h-16 transform -scale-x-100" />
          <blockquote className="relative z-10 text-2xl md:text-3xl font-serif italic text-indigo-100 text-center px-4 md:px-12 leading-tight">
            &ldquo;{block.content}&rdquo;
          </blockquote>
          <div className="text-center mt-6 text-sm font-bold text-indigo-400 uppercase tracking-widest">— {block.author}</div>
        </motion.div>
      );

    case 'image':
      return (
        <motion.figure {...commonAnim} className="my-8">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-zinc-900">
            <Image src={block.src} alt={block.alt} fill className="object-cover" />
          </div>
          {block.caption && <figcaption className="text-center text-sm text-zinc-500 mt-3 italic">{block.caption}</figcaption>}
        </motion.figure>
      );

    default:
      return null;
  }
};

export default QuerySection15;
