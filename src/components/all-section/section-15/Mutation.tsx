/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import {
  Tag,
  Save,
  Plus,
  User,
  Type,
  Quote,
  Clock,
  Trash2,
  FileText,
  Calendar,
  Sparkles,
  AlignLeft,
  ImageIcon,
  Settings2,
  LayoutList,
  GripVertical,
  ChevronRight,
  LayoutTemplate,
  Badge as BadgeIcon,
} from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import ImageUploadManagerSingle from '@/components/dashboard-ui/ImageUploadManagerSingle';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { ISection15Data, defaultDataSection15, ArticleBlock } from './data';

export interface Section15FormProps {
  data?: ISection15Data;
  onSubmit: (values: ISection15Data) => void;
}

const MutationSection15 = ({ data, onSubmit }: Section15FormProps) => {
  const [formData, setFormData] = useState<ISection15Data>(defaultDataSection15[0]);
  const [activeArticleId, setActiveArticleId] = useState<string>('');

  useEffect(() => {
    if (data) {
      const normalizedData = (Array.isArray(data) ? data[0] : data) as ISection15Data;
      setFormData(normalizedData);

      if (normalizedData.allData && normalizedData.allData.length > 0) {
        setActiveArticleId(prev => {
          const exists = normalizedData.allData.find(a => a.id === prev);
          return exists ? prev : normalizedData.allData[0].id;
        });
      }
    } else {
      setFormData(defaultDataSection15[0]);
      setActiveArticleId(defaultDataSection15[0].allData[0].id);
    }
  }, [data]);

  const activeArticle = formData.allData.find(a => a.id === activeArticleId) || formData.allData[0];
  const activeIndex = formData.allData.findIndex(a => a.id === activeArticleId);

  const handleSectionChange = (field: keyof ISection15Data, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddArticle = () => {
    const newArticle = {
      id: `art-${Date.now()}`,
      title: 'New Untitled Article',
      subtitle: 'Add a short subtitle here...',
      category: 'Uncategorized',
      readTime: '5 min read',
      publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      author: {
        name: 'Author Name',
        role: 'Writer',
        avatar: '',
      },
      heroImage: '',
      tags: ['New'],
      content: [
        { type: 'heading', content: 'Introduction' } as ArticleBlock,
        { type: 'text', content: 'Start writing your article content here...' } as ArticleBlock,
      ],
    };

    setFormData(prev => ({
      ...prev,
      allData: [...prev.allData, newArticle],
    }));
    setActiveArticleId(newArticle.id);
  };

  const handleDeleteArticle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (formData.allData.length === 1) return; // Prevent deleting last article

    const newArticles = formData.allData.filter(a => a.id !== id);
    setFormData(prev => ({ ...prev, allData: newArticles }));

    if (activeArticleId === id) {
      setActiveArticleId(newArticles[0].id);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateArticle = (field: string, value: any) => {
    const updatedArticles = [...formData.allData];
    updatedArticles[activeIndex] = { ...updatedArticles[activeIndex], [field]: value };
    setFormData(prev => ({ ...prev, allData: updatedArticles }));
  };

  const updateAuthor = (field: string, value: string) => {
    const updatedArticles = [...formData.allData];
    updatedArticles[activeIndex] = {
      ...updatedArticles[activeIndex],
      author: { ...updatedArticles[activeIndex].author, [field]: value },
    };
    setFormData(prev => ({ ...prev, allData: updatedArticles }));
  };

  const handleTagsChange = (value: string) => {
    const tags = value
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
    updateArticle('tags', tags);
  };

  const addBlock = (type: ArticleBlock['type']) => {
    const newBlock: ArticleBlock =
      type === 'heading'
        ? { type: 'heading', content: 'New Heading' }
        : type === 'quote'
          ? { type: 'quote', content: 'Quote text...', author: 'Source' }
          : type === 'image'
            ? { type: 'image', src: '', alt: 'Image description', caption: '' }
            : { type: 'text', content: 'New paragraph block...' };

    const updatedContent = [...activeArticle.content, newBlock];
    updateArticle('content', updatedContent);
  };

  const removeBlock = (blockIndex: number) => {
    const updatedContent = activeArticle.content.filter((_, i) => i !== blockIndex);
    updateArticle('content', updatedContent);
  };

  const updateBlock = (blockIndex: number, field: string, value: string) => {
    const updatedContent = [...activeArticle.content];

    const currentBlock = updatedContent[blockIndex] as unknown as Record<string, string>;
    updatedContent[blockIndex] = { ...currentBlock, [field]: value } as ArticleBlock;

    updateArticle('content', updatedContent);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === activeArticle.content.length - 1)) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const content = [...activeArticle.content];
    [content[index], content[newIndex]] = [content[newIndex], content[index]];
    updateArticle('content', content);
  };

  if (!activeArticle) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 pb-32 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-6 relative z-10">
        <div className="flex flex-col items-center md:items-start mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-4"
          >
            <FileText size={12} />
            <span>Content Manager</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
            Editorial Dashboard
          </h1>
          <p className="text-zinc-500 mt-2 text-lg">Manage section headers, articles, and rich media content.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <div className="xl:col-span-3 space-y-4 xl:sticky xl:top-8 h-fit">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-zinc-900/40 border border-white/5 rounded-3xl p-5 backdrop-blur-md shadow-xl space-y-4"
            >
              <div className="flex items-center gap-2 text-indigo-400 uppercase text-xs font-bold tracking-widest pb-2 border-b border-white/5">
                <LayoutTemplate size={14} /> Section Header
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-zinc-500 flex items-center gap-1">
                    <BadgeIcon size={10} /> Badge
                  </Label>
                  <Input
                    value={formData.badge}
                    onChange={e => handleSectionChange('badge', e.target.value)}
                    className="h-8 bg-zinc-950/50 border-white/10 focus:border-indigo-500/50 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-zinc-500">Main Title</Label>
                  <Input
                    value={formData.title}
                    onChange={e => handleSectionChange('title', e.target.value)}
                    className="h-8 bg-zinc-950/50 border-white/10 focus:border-indigo-500/50 text-sm font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-zinc-500">Subtitle</Label>
                  <Textarea
                    value={formData.subTitle}
                    onChange={e => handleSectionChange('subTitle', e.target.value)}
                    className="min-h-[60px] bg-zinc-950/50 border-white/10 focus:border-indigo-500/50 text-sm resize-none"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-900/40 border border-white/5 rounded-3xl p-4 backdrop-blur-md shadow-xl flex flex-col gap-3 min-h-[400px]"
            >
              <div className="flex items-center justify-between px-2 pb-2 border-b border-white/5">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                  <LayoutList size={14} /> Stories
                </span>
                <Button
                  onClick={handleAddArticle}
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full"
                >
                  <Plus size={14} />
                </Button>
              </div>

              <ScrollArea className="flex-1 pr-3 -mr-3 max-h-[calc(100vh-500px)]">
                <div className="flex flex-col gap-2">
                  {formData.allData.map(article => (
                    <div
                      key={article.id}
                      onClick={() => setActiveArticleId(article.id)}
                      className={`
                         group relative p-3 rounded-xl cursor-pointer border transition-all duration-200
                         ${
                           activeArticleId === article.id
                             ? 'bg-indigo-500/10 border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                             : 'bg-transparent border-transparent hover:bg-zinc-800/50 hover:border-white/5'
                         }
                       `}
                    >
                      <div className="flex gap-3">
                        <div className="h-12 w-12 rounded-lg bg-zinc-950 border border-white/5 shrink-0 overflow-hidden relative">
                          {article.heroImage ? (
                            <Image src={article.heroImage} alt="" fill className="object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-zinc-700">
                              <ImageIcon size={16} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`text-sm font-medium truncate ${activeArticleId === article.id ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}
                          >
                            {article.title || 'Untitled'}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-[10px] h-4 px-1 py-0 border-white/10 text-zinc-500 truncate max-w-[80px]">
                              {article.category}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={e => handleDeleteArticle(article.id, e)}
                        className={`
                            absolute top-2 right-2 h-6 w-6 p-0 rounded-full bg-zinc-900/80 text-zinc-500 hover:text-red-400 hover:bg-zinc-950 border border-zinc-700
                            opacity-0 group-hover:opacity-100 transition-opacity
                            ${formData.allData.length === 1 ? 'hidden' : ''}
                          `}
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          </div>

          <div className="xl:col-span-9 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-md shadow-xl space-y-6"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase font-bold tracking-wider">Article Title</Label>
                    <Input
                      value={activeArticle.title}
                      onChange={e => updateArticle('title', e.target.value)}
                      className="bg-zinc-950/50 border-white/10 focus:border-indigo-500/50 font-bold text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase font-bold tracking-wider">Article Subtitle</Label>
                    <Textarea
                      value={activeArticle.subtitle}
                      onChange={e => updateArticle('subtitle', e.target.value)}
                      className="bg-zinc-950/50 border-white/10 focus:border-indigo-500/50 min-h-[80px] resize-none text-sm text-zinc-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase font-bold tracking-wider flex gap-1">
                      <Tag size={12} /> Category
                    </Label>
                    <Input
                      value={activeArticle.category}
                      onChange={e => updateArticle('category', e.target.value)}
                      className="bg-zinc-950/50 border-white/10 focus:border-indigo-500/50 h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase font-bold tracking-wider flex gap-1">
                      <Clock size={12} /> Read Time
                    </Label>
                    <Input
                      value={activeArticle.readTime}
                      onChange={e => updateArticle('readTime', e.target.value)}
                      className="bg-zinc-950/50 border-white/10 focus:border-indigo-500/50 h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-400 text-xs uppercase font-bold tracking-wider flex gap-1">
                    <Calendar size={12} /> Publish Date
                  </Label>
                  <Input
                    value={activeArticle.publishedAt}
                    onChange={e => updateArticle('publishedAt', e.target.value)}
                    className="bg-zinc-950/50 border-white/10 focus:border-indigo-500/50 h-9"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-400 text-xs uppercase font-bold tracking-wider">Tags (comma separated)</Label>
                  <Input
                    value={activeArticle.tags.join(', ')}
                    onChange={e => handleTagsChange(e.target.value)}
                    className="bg-zinc-950/50 border-white/10 focus:border-indigo-500/50"
                    placeholder="Tech, Design, Future"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-md shadow-xl space-y-6"
              >
                <div className="space-y-3">
                  <Label className="text-zinc-400 text-xs uppercase font-bold tracking-wider flex gap-1">
                    <ImageIcon size={12} /> Hero Image
                  </Label>
                  <div className="aspect-video rounded-xl border border-white/10 bg-zinc-950/30 overflow-hidden relative group">
                    <ImageUploadManagerSingle value={activeArticle.heroImage} onChange={url => updateArticle('heroImage', url)} />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-zinc-400 text-xs uppercase font-bold tracking-wider flex gap-1">
                      <User size={12} /> Author
                    </Label>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-full border border-white/10 bg-zinc-950 overflow-hidden relative shrink-0">
                      {activeArticle.author.avatar ? (
                        <Image src={activeArticle.author.avatar} fill alt="Author" className="object-cover" />
                      ) : (
                        <User className="w-6 h-6 m-3 text-zinc-600" />
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ImageUploadManagerSingle value={activeArticle.author.avatar} onChange={url => updateAuthor('avatar', url)} />
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Name"
                        value={activeArticle.author.name}
                        onChange={e => updateAuthor('name', e.target.value)}
                        className="bg-zinc-950/50 border-white/10 h-8 text-xs"
                      />
                      <Input
                        placeholder="Role"
                        value={activeArticle.author.role}
                        onChange={e => updateAuthor('role', e.target.value)}
                        className="bg-zinc-950/50 border-white/10 h-8 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md shadow-xl flex flex-col min-h-[600px]"
              >
                <div className="p-4 border-b border-white/5 bg-zinc-900/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings2 size={16} className="text-indigo-400" />
                    <span className="font-bold text-zinc-200 text-sm">Content Builder</span>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white h-8 text-xs gap-2">
                        <Plus size={14} /> Add Block
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-zinc-200">
                      <DropdownMenuItem onClick={() => addBlock('heading')} className="hover:bg-zinc-800 cursor-pointer gap-2">
                        <Type size={14} /> Heading
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addBlock('text')} className="hover:bg-zinc-800 cursor-pointer gap-2">
                        <AlignLeft size={14} /> Paragraph
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addBlock('quote')} className="hover:bg-zinc-800 cursor-pointer gap-2">
                        <Quote size={14} /> Quote
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addBlock('image')} className="hover:bg-zinc-800 cursor-pointer gap-2">
                        <ImageIcon size={14} /> Image
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex-1 p-6 space-y-4 bg-zinc-950/30">
                  {activeArticle.content.map((block, index) => (
                    <motion.div
                      layout
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group relative pl-8 pr-2 py-2 rounded-lg hover:bg-zinc-900/50 transition-colors border border-transparent hover:border-white/5"
                    >
                      <div className="absolute left-1 top-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => moveBlock(index, 'up')} className="text-zinc-600 hover:text-indigo-400">
                          <ChevronRight size={14} className="-rotate-90" />
                        </button>
                        <GripVertical size={14} className="text-zinc-600 cursor-grab active:cursor-grabbing" />
                        <button onClick={() => moveBlock(index, 'down')} className="text-zinc-600 hover:text-indigo-400">
                          <ChevronRight size={14} className="rotate-90" />
                        </button>
                      </div>

                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-zinc-600 hover:text-red-400 hover:bg-red-500/10"
                          onClick={() => removeBlock(index)}
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>

                      {block.type === 'heading' && (
                        <div className="flex gap-3 items-center">
                          <Type className="text-indigo-500 shrink-0 mt-2" size={20} />
                          <Input
                            value={block.content}
                            onChange={e => updateBlock(index, 'content', e.target.value)}
                            className="bg-transparent border-transparent text-xl font-bold text-white focus:border-indigo-500/50 focus:bg-zinc-950/50 px-2 h-auto py-1"
                            placeholder="Heading Text"
                          />
                        </div>
                      )}

                      {block.type === 'text' && (
                        <div className="flex gap-3 items-start">
                          <AlignLeft className="text-zinc-600 shrink-0 mt-2" size={16} />
                          <Textarea
                            value={block.content}
                            onChange={e => updateBlock(index, 'content', e.target.value)}
                            className="bg-transparent border-transparent text-zinc-300 min-h-[80px] focus:border-indigo-500/50 focus:bg-zinc-950/50 px-2 leading-relaxed resize-none"
                            placeholder="Write your paragraph here..."
                          />
                        </div>
                      )}

                      {block.type === 'quote' && (
                        <div className="flex gap-3 items-start pl-2">
                          <div className="w-1 self-stretch bg-indigo-500/30 rounded-full mr-1" />
                          <div className="flex-1 space-y-2">
                            <Textarea
                              value={block.content}
                              onChange={e => updateBlock(index, 'content', e.target.value)}
                              className="bg-zinc-950/30 border-white/5 text-indigo-200 text-lg italic focus:border-indigo-500/50 p-4 rounded-xl resize-none"
                              placeholder="Quote text..."
                            />
                            <div className="flex items-center gap-2 max-w-[50%] ml-auto">
                              <div className="h-px bg-zinc-800 flex-1" />
                              <Input
                                value={'author' in block ? block.author : ''}
                                onChange={e => updateBlock(index, 'author', e.target.value)}
                                className="bg-transparent border-transparent text-right text-xs text-zinc-500 focus:text-zinc-300 w-32 h-6 p-0 focus:border-b focus:border-indigo-500 rounded-none"
                                placeholder="- Author"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {block.type === 'image' && (
                        <div className="space-y-3 pl-8">
                          <div className="bg-zinc-950/50 border border-white/5 rounded-xl overflow-hidden relative min-h-[200px] flex items-center justify-center">
                            <ImageUploadManagerSingle value={'src' in block ? block.src : ''} onChange={url => updateBlock(index, 'src', url)} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              value={'alt' in block ? block.alt : ''}
                              onChange={e => updateBlock(index, 'alt', e.target.value)}
                              className="bg-transparent border-b border-white/10 rounded-none text-xs text-zinc-500 h-6 p-0 focus:border-indigo-500"
                              placeholder="Alt Text (SEO)"
                            />
                            <Input
                              value={'caption' in block ? block.caption || '' : ''}
                              onChange={e => updateBlock(index, 'caption', e.target.value)}
                              className="bg-transparent border-b border-white/10 rounded-none text-xs text-zinc-500 h-6 p-0 focus:border-indigo-500 text-right"
                              placeholder="Image Caption (Optional)"
                            />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {activeArticle.content.length === 0 && (
                    <div className="h-40 flex flex-col items-center justify-center text-zinc-600 border-2 border-dashed border-zinc-800 rounded-xl m-4">
                      <FileText size={32} className="mb-2 opacity-50" />
                      <p className="text-sm">Start building your story</p>
                      <Button variant="link" onClick={() => addBlock('text')} className="text-indigo-400">
                        Add Paragraph
                      </Button>
                    </div>
                  )}
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
            <span className="text-xs text-zinc-400">Section 15: Editorial</span>
          </div>
          <Button
            onClick={() => onSubmit(formData)}
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

export default MutationSection15;
