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
import { ArrowUpRight, Calendar, Clock, User, Hash, Sparkles } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import { BlogPost, defaultDataSection17, ISection17Data } from './data';

interface Section17Props {
  data?: ISection17Data | string;
}

const QuerySection17: React.FC<Section17Props> = ({ data }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const sectionData: ISection17Data = useMemo(() => {
    if (!data) return defaultDataSection17;
    try {
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch (e) {
      console.error('Failed to parse section data', e);
      return defaultDataSection17;
    }
  }, [data]);

  const posts = useMemo(() => sectionData.allData || [], [sectionData]);
  const categories = useMemo(() => sectionData.categories || ['All'], [sectionData]);

  const featuredPost = useMemo(() => {
    return posts.find(p => p.featured) || posts[0];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let base = posts;
    if (selectedCategory !== 'All') {
      base = base.filter(p => p.category === selectedCategory);
    } else {
      if (featuredPost) {
        base = base.filter(p => p.id !== featuredPost.id);
      }
    }
    return base;
  }, [posts, selectedCategory, featuredPost]);

  return (
    <section className="relative w-full py-24 bg-zinc-950 min-h-screen text-zinc-100 selection:bg-indigo-500/30 font-sans overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-indigo-900/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-fuchsia-900/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-soft-light" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 space-y-20">
        {featuredPost && selectedCategory === 'All' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group rounded-[2.5rem] overflow-hidden border border-zinc-800 bg-zinc-900/40 hover:border-indigo-500/30 transition-all duration-700"
          >
            <div className="grid lg:grid-cols-2 gap-0 min-h-[500px]">
              <div className="relative h-[300px] lg:h-full overflow-hidden">
                {featuredPost.coverImage && (
                  <Image
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-zinc-950 via-zinc-950/50 to-transparent lg:via-transparent opacity-90 lg:opacity-100" />

                <div className="absolute top-6 left-6">
                  <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                    <Sparkles size={12} /> Featured Story
                  </span>
                </div>
              </div>

              <div className="p-8 lg:p-16 flex flex-col justify-center relative">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-sm text-zinc-400 font-mono">
                    <span className="text-indigo-400 font-bold">{featuredPost.category}</span>
                    <span>•</span>
                    <span>{featuredPost.publishedAt}</span>
                  </div>

                  <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.1] tracking-tight group-hover:text-indigo-200 transition-colors">
                    {featuredPost.title}
                  </h2>

                  <p className="text-lg text-zinc-400 leading-relaxed max-w-md">{featuredPost.excerpt}</p>

                  <div className="pt-8 flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-zinc-700 bg-zinc-800">
                        {featuredPost.author.avatar ? (
                          <Image src={featuredPost.author.avatar} alt="Author" fill className="object-cover" />
                        ) : (
                          <User className="p-2 text-zinc-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{featuredPost.author.name}</p>
                        <p className="text-xs text-zinc-500">{featuredPost.author.role}</p>
                      </div>
                    </div>
                    <div className="h-8 w-px bg-zinc-800 mx-2" />
                    <Button className="rounded-full bg-white text-black hover:bg-zinc-200 font-bold px-6">
                      Read Article <ArrowUpRight size={16} className="ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-800 pb-6">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              Latest Posts <span className="text-sm font-normal text-zinc-500 font-mono bg-zinc-900 px-2 py-1 rounded-md">{filteredPosts.length}</span>
            </h3>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border',
                    selectedCategory === cat
                      ? 'bg-zinc-100 text-zinc-950 border-white shadow-lg shadow-white/5'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200',
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
            <AnimatePresence mode="popLayout">
              {filteredPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30"
            >
              No posts found in this category.
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

const PostCard = ({ post }: { post: BlogPost }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="group flex flex-col h-full"
    >
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-zinc-900 border border-zinc-800/50 group-hover:border-indigo-500/50 transition-colors">
        {post.coverImage ? (
          <Image src={post.coverImage} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-700 bg-zinc-900">
            <Hash size={48} className="opacity-20" />
          </div>
        )}

        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-md bg-zinc-950/80 backdrop-blur border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white">
            {post.category}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col space-y-4">
        <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
          <span className="flex items-center gap-1">
            <Calendar size={12} /> {post.publishedAt}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {post.readTime}
          </span>
        </div>

        <h3 className="text-xl font-bold text-zinc-100 group-hover:text-indigo-400 transition-colors leading-tight cursor-pointer">{post.title}</h3>

        <p className="text-sm text-zinc-400 line-clamp-3 leading-relaxed flex-1">{post.excerpt}</p>

        <div className="flex flex-wrap gap-2 pt-2">
          {post.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-[10px] text-zinc-500 px-2 py-1 bg-zinc-900 rounded border border-zinc-800 group-hover:border-zinc-700 transition-colors cursor-default"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="pt-4 border-t border-zinc-800/50 flex items-center gap-3 mt-2">
          <div className="relative w-6 h-6 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700">
            {post.author.avatar ? (
              <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
            ) : (
              <User size={12} className="m-1 text-zinc-500" />
            )}
          </div>
          <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">{post.author.name}</span>
          <ArrowUpRight
            size={14}
            className="ml-auto text-zinc-600 group-hover:text-indigo-400 transition-colors transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default QuerySection17;
