/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Search, Image as ImageIcon, User, Calendar, Clock, Tag, Star, LayoutList, Sparkles, Layers, X } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import ImageUploadManagerSingle from '@/components/dashboard-ui/ImageUploadManagerSingle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { BlogPost, defaultDataSection17, ISection17Data } from './data';

export interface Section17FormProps {
  data?: ISection17Data;
  onSubmit: (values: ISection17Data) => void;
}

const MutationSection17 = ({ data, onSubmit }: Section17FormProps) => {
  const [sectionData, setSectionData] = useState<ISection17Data>(defaultDataSection17);
  const [activePostId, setActivePostId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    if (data) {
      setSectionData({
        ...defaultDataSection17,
        ...data,
        categories: data.categories || defaultDataSection17.categories,
        allData: data.allData || defaultDataSection17.allData,
      });

      if (data.allData && data.allData.length > 0) {
        setActivePostId(prev => {
          const exists = data.allData.find(p => p.id === prev);
          return exists ? prev : data.allData[0].id;
        });
      }
    } else {
      setActivePostId(defaultDataSection17.allData[0]?.id || '');
    }
  }, [data]);

  const activePost = sectionData.allData.find(p => p.id === activePostId) || sectionData.allData[0];
  const activeIndex = sectionData.allData.findIndex(p => p.id === activePostId);

  const handleAddPost = () => {
    const defaultCat = sectionData.categories.find(c => c !== 'All') || 'General';

    const newPost: BlogPost = {
      id: `post-${Date.now()}`,
      title: 'New Untitled Post',
      excerpt: 'Write a catchy summary...',
      coverImage: '',
      publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: '5 min read',
      category: defaultCat,
      tags: [],
      featured: false,
      author: {
        name: 'Author Name',
        role: 'Writer',
        avatar: '',
      },
    };

    setSectionData(prev => ({
      ...prev,
      allData: [newPost, ...prev.allData],
    }));
    setActivePostId(newPost.id);
  };

  const handleDeletePost = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sectionData.allData.length === 1) return;

    const newPosts = sectionData.allData.filter(p => p.id !== id);
    setSectionData(prev => ({ ...prev, allData: newPosts }));

    if (activePostId === id) {
      setActivePostId(newPosts[0].id);
    }
  };

  const updatePost = (field: keyof BlogPost, value: unknown) => {
    const updatedPosts = [...sectionData.allData];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatedPosts[activeIndex] = { ...updatedPosts[activeIndex], [field]: value } as any;
    setSectionData(prev => ({ ...prev, allData: updatedPosts }));
  };

  const updateAuthor = (field: keyof BlogPost['author'], value: string) => {
    const updatedPosts = [...sectionData.allData];
    updatedPosts[activeIndex] = {
      ...updatedPosts[activeIndex],
      author: { ...updatedPosts[activeIndex].author, [field]: value },
    };
    setSectionData(prev => ({ ...prev, allData: updatedPosts }));
  };

  const handleTagsChange = (value: string) => {
    const tags = value
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
    updatePost('tags', tags);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !sectionData.categories.includes(newCategory.trim())) {
      setSectionData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()],
      }));
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (catToRemove: string) => {
    if (catToRemove === 'All') return; // Protect 'All'
    setSectionData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== catToRemove),
    }));
  };

  const filteredPosts = sectionData.allData.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  if (!activePost) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-32 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-indigo-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-6 relative z-10">
        <div className="flex flex-col items-center md:items-start mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-4"
          >
            <LayoutList size={12} />
            <span>Blog Manager</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
            Content Curation
          </h1>
          <p className="text-zinc-500 mt-2 text-lg">Manage posts, categories, and authors for your blog section.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <div className="xl:col-span-3 space-y-6 xl:sticky xl:top-8 h-fit">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-zinc-900/40 border border-white/5 rounded-3xl p-5 backdrop-blur-md shadow-xl space-y-4"
            >
              <div className="flex items-center gap-2 text-indigo-400 uppercase text-xs font-bold tracking-widest pb-2 border-b border-white/5">
                <Layers size={14} /> Categories
              </div>

              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                  placeholder="Add category..."
                  className="bg-zinc-950/50 border-white/10 focus:border-indigo-500/50 h-9 text-xs"
                />
                <Button onClick={handleAddCategory} size="sm" className="bg-indigo-600 hover:bg-indigo-500 h-9 w-9 p-0">
                  <Plus size={14} />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {sectionData.categories.map(cat => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-800 border border-white/5 text-[10px] text-zinc-400 group hover:border-indigo-500/30 transition-colors cursor-default"
                  >
                    {cat}
                    {cat !== 'All' && (
                      <button onClick={() => handleRemoveCategory(cat)} className="hover:text-red-400 transition-colors ml-1">
                        <X size={10} />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-900/40 border border-white/5 rounded-3xl p-4 flex flex-col gap-4 min-h-[500px] backdrop-blur-md shadow-xl"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 bg-zinc-950/50 border-white/10 text-xs rounded-xl h-10 focus:border-indigo-500/50"
                />
              </div>

              <Button onClick={handleAddPost} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20 rounded-xl">
                <Plus size={16} className="mr-2" /> New Post
              </Button>

              <ScrollArea className="flex-1 pr-3 -mr-3 h-[calc(100vh-450px)]">
                <div className="flex flex-col gap-2">
                  {filteredPosts.map(post => (
                    <motion.div
                      layoutId={`post-list-${post.id}`}
                      key={post.id}
                      onClick={() => setActivePostId(post.id)}
                      className={`
                        group relative p-3 rounded-xl cursor-pointer border transition-all duration-200
                        ${
                          activePostId === post.id
                            ? 'bg-indigo-500/10 border-indigo-500/40 shadow-sm'
                            : 'bg-transparent border-transparent hover:bg-zinc-800/50 hover:border-white/5'
                        }
                      `}
                    >
                      <div className="flex gap-3">
                        <div className="h-12 w-12 rounded-lg bg-zinc-950 border border-white/10 shrink-0 overflow-hidden relative">
                          {post.coverImage ? (
                            <Image src={post.coverImage} alt="" fill className="object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-zinc-700">
                              <ImageIcon size={16} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-medium truncate ${activePostId === post.id ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                            {post.title || 'Untitled'}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            {post.featured && <Star size={10} className="text-amber-500 fill-amber-500" />}
                            <span className="text-[10px] text-zinc-500">{post.publishedAt}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={e => handleDeletePost(post.id, e)}
                        className={`
                           absolute top-2 right-2 h-6 w-6 p-0 rounded-full bg-zinc-900/80 text-zinc-500 hover:text-red-400 border border-zinc-700
                           opacity-0 group-hover:opacity-100 transition-opacity
                           ${sectionData.allData.length === 1 ? 'hidden' : ''}
                        `}
                      >
                        <Trash2 size={12} />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          </div>

          <div className="xl:col-span-9 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 md:p-8 space-y-8 backdrop-blur-md shadow-xl"
            >
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="space-y-4 flex-1 w-full">
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase font-bold tracking-wider">Headline</Label>
                    <Input
                      value={activePost.title}
                      onChange={e => updatePost('title', e.target.value)}
                      className="bg-zinc-950/50 border-white/10 text-lg md:text-xl font-bold h-12 focus:border-indigo-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase font-bold tracking-wider">Excerpt / Summary</Label>
                    <Textarea
                      value={activePost.excerpt}
                      onChange={e => updatePost('excerpt', e.target.value)}
                      className="bg-zinc-950/50 border-white/10 min-h-[100px] text-zinc-300 resize-none focus:border-indigo-500/50 transition-all text-sm leading-relaxed"
                    />
                  </div>
                </div>

                <div className="bg-zinc-950/30 border border-white/5 p-4 rounded-2xl flex flex-col items-center gap-3 shrink-0 min-w-[100px]">
                  <Label className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">Featured</Label>
                  <Switch
                    checked={activePost.featured}
                    onCheckedChange={checked => updatePost('featured', checked)}
                    className="data-[state=checked]:bg-amber-500"
                  />
                  <Star size={16} className={activePost.featured ? 'text-amber-500 fill-amber-500 transition-colors' : 'text-zinc-700'} />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs uppercase font-bold tracking-wider flex items-center gap-2">
                  <ImageIcon size={14} /> Cover Image
                </Label>
                <div className="aspect-video w-full rounded-2xl border border-white/10 bg-zinc-950/50 overflow-hidden relative group">
                  <ImageUploadManagerSingle value={activePost.coverImage} onChange={url => updatePost('coverImage', url)} />
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 space-y-5 backdrop-blur-md shadow-xl"
              >
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                  <Tag size={16} className="text-indigo-500" /> Post Details
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 text-white">
                    <Label className="text-zinc-500 text-xs uppercase tracking-wider font-bold">Category</Label>
                    <Select value={activePost.category} onValueChange={val => updatePost('category', val)}>
                      <SelectTrigger className="bg-zinc-950/50 border-white/10 h-9 text-xs focus:border-indigo-500/50">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-slate-400">
                        {sectionData.categories
                          .filter(c => c !== 'All')
                          .map(c => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-500 text-xs uppercase tracking-wider font-bold">Read Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                      <Input
                        value={activePost.readTime}
                        onChange={e => updatePost('readTime', e.target.value)}
                        className="bg-zinc-950/50 border-white/10 pl-9 h-9 text-xs focus:border-indigo-500/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-500 text-xs uppercase tracking-wider font-bold">Publish Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                    <Input
                      value={activePost.publishedAt}
                      onChange={e => updatePost('publishedAt', e.target.value)}
                      className="bg-zinc-950/50 border-white/10 pl-9 h-9 text-xs focus:border-indigo-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-500 text-xs uppercase tracking-wider font-bold">Tags</Label>
                  <Input
                    value={activePost.tags.join(', ')}
                    onChange={e => handleTagsChange(e.target.value)}
                    className="bg-zinc-950/50 border-white/10 h-9 text-xs focus:border-indigo-500/50"
                    placeholder="React, CSS, Design..."
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 space-y-5 backdrop-blur-md shadow-xl"
              >
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                  <User size={16} className="text-indigo-500" /> Author Info
                </h3>

                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full border border-white/10 bg-zinc-950 relative overflow-hidden shrink-0 group">
                    <ImageUploadManagerSingle value={activePost.author.avatar} onChange={url => updateAuthor('avatar', url)} />
                  </div>
                  <div className="flex-1 space-y-3">
                    <Input
                      value={activePost.author.name}
                      onChange={e => updateAuthor('name', e.target.value)}
                      className="bg-zinc-950/50 border-white/10 h-9 text-sm focus:border-indigo-500/50"
                      placeholder="Author Name"
                    />
                    <Input
                      value={activePost.author.role}
                      onChange={e => updateAuthor('role', e.target.value)}
                      className="bg-zinc-950/50 border-white/10 h-9 text-xs focus:border-indigo-500/50"
                      placeholder="Role / Title"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-xs text-indigo-300/80 leading-relaxed">
                  Tip: Use high-quality avatars. The author name will appear on the article card and detailed view.
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl shadow-black/50 pointer-events-auto flex items-center gap-4"
        >
          <div className="hidden md:flex flex-col px-4 border-r border-white/10 pr-6 mr-2">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-400" />
              Editing Mode
            </span>
            <span className="text-xs text-zinc-400">Section 17: Blog</span>
          </div>
          <Button
            onClick={() => onSubmit(sectionData)}
            className="bg-white text-zinc-950 hover:bg-indigo-50 hover:text-indigo-900 px-8 py-6 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default MutationSection17;
