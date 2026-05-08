/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Clock, Layout, Tag, Link as LinkIcon, Palette, Save, Settings2, RotateCcw } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { defaultDataSection26, ITagItem, ITagSliderData, STYLE_PRESETS, TagSliderFormProps, TagStyle } from './data';

const ScrollArea = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn('relative w-full h-full overflow-hidden', className)}>
      <div className="h-full w-full overflow-y-auto scrollbar-hide scroll-smooth pb-10">{children}</div>
      <div className="pointer-events-none absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-zinc-950 to-transparent z-10" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-zinc-950 to-transparent z-10" />
    </div>
  );
};

const ModernInput = ({ icon: Icon, ...props }: { icon?: React.ElementType } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="relative group flex-1">
    {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />}
    <Input {...props} className={cn('w-full bg-zinc-950/50 border-zinc-800 focus:border-blue-500', Icon ? 'pl-9 pr-3' : 'px-3')} />
  </div>
);

const MutationTagSlider26 = ({ data, onSubmit }: TagSliderFormProps) => {
  const [formData, setFormData] = useState<ITagSliderData>({ ...defaultDataSection26 });
  const [activeTab, setActiveTab] = useState<'content' | 'settings'>('content');

  useEffect(() => {
    if (data) setFormData({ ...defaultDataSection26, ...data });
  }, [data]);

  const updateField = (field: keyof ITagSliderData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    const newTag: ITagItem = {
      id: Math.random().toString(36).substr(2, 9),
      text: 'New Topic',
      link: '',
    };
    setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const updateTag = (index: number, field: keyof ITagItem, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = { ...newTags[index], [field]: value };
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  const handleReset = () => {
    setFormData(defaultDataSection26);
  };

  return (
    <div className="min-h-[600px] w-full max-w-5xl mx-auto bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-500/30 flex flex-col lg:flex-row rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
      <div className="lg:w-1/2 bg-zinc-950 relative flex flex-col h-[600px] lg:h-auto">
        <div className="flex border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('content')}
            className={cn(
              'flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors',
              activeTab === 'content' ? 'text-blue-400 border-b-2 border-blue-500 bg-zinc-900/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900',
            )}
          >
            <Tag size={14} /> Manage Tags
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={cn(
              'flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors',
              activeTab === 'settings' ? 'text-blue-400 border-b-2 border-blue-500 bg-zinc-900/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900',
            )}
          >
            <Settings2 size={14} /> Configuration
          </button>
        </div>

        <ScrollArea className="h-full">
          <div className="p-6 lg:p-8 space-y-8">
            <div className="flex justify-end">
              <button onClick={handleReset} className="text-xs text-zinc-600 hover:text-zinc-300 flex items-center gap-1 transition-colors">
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            {activeTab === 'content' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Total: {formData.tags.length} tags</span>
                  <Button onClick={addTag} size="sm" className="h-7 text-xs bg-blue-600 hover:bg-blue-500 text-white">
                    <Plus size={12} className="mr-1" /> Add Tag
                  </Button>
                </div>

                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {formData.tags.map((tag, index) => (
                      <motion.div
                        key={tag.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="group flex items-start gap-3 bg-zinc-900/30 border border-zinc-800 rounded-xl p-3 hover:border-zinc-700 transition-all"
                      >
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <ModernInput
                            icon={Tag}
                            value={tag.text}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateTag(index, 'text', e.target.value)}
                            placeholder="Label"
                          />
                          <ModernInput
                            icon={LinkIcon}
                            value={tag.link}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateTag(index, 'link', e.target.value)}
                            placeholder="#"
                          />
                        </div>
                        <button
                          onClick={() => removeTag(index)}
                          className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all self-center"
                        >
                          <Trash2 size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {formData.tags.length === 0 && (
                    <div className="py-8 text-center border-2 border-dashed border-zinc-800 rounded-xl text-zinc-500 text-xs">List is empty.</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <section className="space-y-3">
                  <Label className="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-wider">
                    <Palette size={14} /> Visual Style
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.keys(STYLE_PRESETS).map(style => (
                      <button
                        key={style}
                        onClick={() => updateField('tagStyle', style)}
                        className={cn(
                          'relative h-14 rounded-xl border transition-all overflow-hidden group',
                          formData.tagStyle === style ? 'border-blue-500 ring-1 ring-blue-500/50' : 'border-zinc-800 hover:border-zinc-600',
                        )}
                      >
                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950">
                          <div className={cn('px-3 py-1 rounded-full text-xs font-medium', STYLE_PRESETS[style as TagStyle])}>
                            {style.charAt(0).toUpperCase() + style.slice(1)}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                <div className="w-full h-px bg-zinc-800/50" />

                <section className="space-y-4">
                  <Label className="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-wider">
                    <Layout size={14} /> Layout
                  </Label>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-xs text-zinc-500">Tags per View</span>
                      <Select value={String(formData.itemsPerSlide)} onValueChange={val => updateField('itemsPerSlide', parseInt(val))}>
                        <SelectTrigger className="bg-zinc-900 border-zinc-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map(n => (
                            <SelectItem key={n} value={String(n)}>
                              {n} Item{n > 1 && 's'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs text-zinc-500">Navigation Position</span>
                      <Select value={formData.navPosition} onValueChange={val => updateField('navPosition', val)}>
                        <SelectTrigger className="bg-zinc-900 border-zinc-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hidden">Hidden (Auto only)</SelectItem>
                          <SelectItem value="middle-outside">Middle Arrows</SelectItem>
                          <SelectItem value="bottom-outside">Bottom Arrows</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <Label className="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-wider">
                    <Clock size={14} /> Behavior
                  </Label>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-zinc-900/30 border border-zinc-800 rounded-xl">
                      <div className="text-xs">
                        <p className="text-zinc-200 font-medium">Autoplay</p>
                        <p className="text-zinc-500">Automatically scroll tags</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-700 rounded px-2 py-1">
                          <Input
                            type="number"
                            value={formData.autoplaySpeed}
                            onChange={e => updateField('autoplaySpeed', parseInt(e.target.value))}
                            className="w-12 bg-transparent text-right text-xs focus:outline-none h-6 border-none p-0"
                          />
                          <span className="text-zinc-600 text-[10px]">ms</span>
                        </div>
                        <Switch checked={formData.isAutoplay} onCheckedChange={c => updateField('isAutoplay', c)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center justify-between p-3 bg-zinc-900/30 border border-zinc-800 rounded-xl">
                        <span className="text-xs text-zinc-300">Infinite Loop</span>
                        <Switch checked={formData.infiniteLoop} onCheckedChange={c => updateField('infiniteLoop', c)} />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-zinc-900/30 border border-zinc-800 rounded-xl">
                        <span className="text-xs text-zinc-300">Pause on Hover</span>
                        <Switch checked={formData.pauseOnHover} onCheckedChange={c => updateField('pauseOnHover', c)} />
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            <div className="pt-6 border-t border-zinc-800 flex justify-end">
              <Button onClick={() => onSubmit(formData)} variant="outlineGlassy" className="w-full">
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default MutationTagSlider26;
