/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import {
  Film,
  Plus,
  Move,
  Save,
  Images,
  Trash2,
  Trello,
  Columns,
  Sparkles,
  RotateCcw,
  Settings2,
  Maximize2,
  LayoutGrid,
  LayoutTemplate,
  Image as ImageIcon,
} from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import ImageUploadManagerSingle from '@/components/dashboard-ui/ImageUploadManagerSingle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { defaultDataSection28, GalleryFormProps, IGalleryData, IGalleryItem } from './data';

const ScrollArea = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn('relative w-full h-full overflow-hidden', className)}>
      <div className="h-full w-full overflow-y-auto scrollbar-hide scroll-smooth pb-20">{children}</div>
      <div className="pointer-events-none absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-zinc-950 to-transparent z-10" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-zinc-950 to-transparent z-10" />
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LayoutCard = ({ active, onClick, icon: Icon, label }: any) => (
  <button
    onClick={onClick}
    className={cn(
      'flex flex-col items-center justify-center gap-3 p-4 rounded-xl border transition-all duration-200 group',
      active
        ? 'bg-blue-600/10 border-blue-500 text-blue-400 ring-1 ring-blue-500/50'
        : 'bg-zinc-900/30 border-zinc-800 text-zinc-500 hover:bg-zinc-900 hover:border-zinc-700 hover:text-zinc-200',
    )}
  >
    <Icon size={24} className="transition-transform group-hover:scale-110" />
    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
  </button>
);

const MutationSection28 = ({ data, onSubmit }: GalleryFormProps) => {
  const [formData, setFormData] = useState<IGalleryData>({ ...defaultDataSection28 });
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'content' | 'settings'>('content');

  useEffect(() => {
    if (data) setFormData({ ...defaultDataSection28, ...data });
  }, [data]);

  const updateField = (field: keyof IGalleryData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addImage = () => {
    const newImg: IGalleryItem = {
      id: Math.random().toString(36).substr(2, 9),
      url: '',
      caption: 'New Capture',
    };
    setFormData(prev => ({ ...prev, images: [...prev.images, newImg] }));
    setActiveImageIndex(formData.images.length);
  };

  const removeImage = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
    if (activeImageIndex >= newImages.length) setActiveImageIndex(Math.max(0, newImages.length - 1));
  };

  const updateImage = (index: number, field: keyof IGalleryItem, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = { ...newImages[index], [field]: value };
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const activeImage = formData.images[activeImageIndex];

  const handleReset = () => {
    setFormData(defaultDataSection28);
  };

  return (
    <div className="min-h-[700px] w-full max-w-6xl mx-auto bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-500/30 flex flex-col lg:flex-row rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
      <div className="lg:w-[45%] bg-zinc-950 relative flex flex-col h-[600px] lg:h-auto">
        <div className="flex border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('content')}
            className={cn(
              'flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors',
              activeTab === 'content' ? 'text-blue-400 border-b-2 border-blue-500 bg-zinc-900/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900',
            )}
          >
            <Images size={14} /> Content
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={cn(
              'flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors',
              activeTab === 'settings' ? 'text-blue-400 border-b-2 border-blue-500 bg-zinc-900/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900',
            )}
          >
            <Settings2 size={14} /> Settings
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
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] uppercase font-bold text-zinc-500">Select Image</Label>
                    <button onClick={addImage} className="text-[10px] flex items-center gap-1 text-blue-400 hover:text-blue-300">
                      <Plus size={12} /> Add New
                    </button>
                  </div>
                  <div className="flex gap-2 flex-wrap pb-2 scrollbar-hide">
                    {formData.images.map((img, idx) => (
                      <div
                        key={img.id}
                        onClick={() => setActiveImageIndex(idx)}
                        className={cn(
                          'relative flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden cursor-pointer transition-all',
                          activeImageIndex === idx ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-zinc-800 hover:border-zinc-600',
                        )}
                      >
                        {img.url ? (
                          <Image alt={img.caption || 'Hero Image'} width={200} height={200} src={img.url} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-600">
                            <ImageIcon size={16} />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[9px] px-1 truncate text-center py-0.5">{idx + 1}</div>
                        {formData.images.length > 1 && (
                          <button
                            onClick={e => removeImage(idx, e)}
                            className="absolute top-0 right-0 bg-red-500 text-white p-1 opacity-0 hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={10} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addImage}
                      className="flex-shrink-0 w-20 h-20 rounded-lg border border-dashed border-zinc-700 flex items-center justify-center text-zinc-600 hover:text-zinc-400 hover:bg-zinc-900 transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                <div className="w-full h-px bg-zinc-800/50" />

                {activeImage ? (
                  <motion.div key={activeImage.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">Source File</Label>
                      <ImageUploadManagerSingle value={activeImage.url} onChange={(url: string) => updateImage(activeImageIndex, 'url', url)} />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">Caption</Label>
                      <Input
                        value={activeImage.caption}
                        onChange={e => updateImage(activeImageIndex, 'caption', e.target.value)}
                        className="w-full bg-zinc-900/50 border-zinc-800 focus:border-blue-500"
                        placeholder="Describe this image..."
                      />
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-10 text-zinc-500">No images selected.</div>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                <section className="space-y-4">
                  <Label className="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-wider">
                    <LayoutTemplate size={14} /> Layout Structure
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <LayoutCard active={formData.layout === 'grid'} onClick={() => updateField('layout', 'grid')} icon={LayoutGrid} label="Grid" />
                    <LayoutCard active={formData.layout === 'masonry'} onClick={() => updateField('layout', 'masonry')} icon={Trello} label="Masonry" />
                    <LayoutCard active={formData.layout === 'bento'} onClick={() => updateField('layout', 'bento')} icon={LayoutTemplate} label="Bento" />
                    <LayoutCard active={formData.layout === 'filmstrip'} onClick={() => updateField('layout', 'filmstrip')} icon={Film} label="Strip" />
                  </div>
                </section>

                <div className="w-full h-px bg-zinc-800/50" />

                <section className="space-y-4">
                  <Label className="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-wider">
                    <Move size={14} /> Sizing & Spacing
                  </Label>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-xs text-zinc-500 flex items-center gap-1">
                        <Columns size={10} /> Grid Columns
                      </span>
                      <Select
                        value={String(formData.columns)}
                        onValueChange={val => updateField('columns', parseInt(val))}
                        disabled={formData.layout === 'filmstrip'}
                      >
                        <SelectTrigger className="bg-zinc-900 border-zinc-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[2, 3, 4, 5].map(n => (
                            <SelectItem key={n} value={String(n)}>
                              {n} Cols
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs text-zinc-500 flex items-center gap-1">
                        <Maximize2 size={10} /> Aspect Ratio
                      </span>
                      <Select value={formData.aspectRatio} onValueChange={val => updateField('aspectRatio', val)} disabled={formData.layout === 'masonry'}>
                        <SelectTrigger className="bg-zinc-900 border-zinc-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Original</SelectItem>
                          <SelectItem value="square">Square (1:1)</SelectItem>
                          <SelectItem value="video">Video (16:9)</SelectItem>
                          <SelectItem value="portrait">Portrait (3:4)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-xs text-zinc-500">Gap Size</span>
                      <div className="grid grid-cols-4 gap-1 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
                        {['none', 'sm', 'md', 'lg'].map(g => (
                          <button
                            key={g}
                            onClick={() => updateField('gap', g)}
                            className={cn(
                              'text-[10px] uppercase rounded py-1 transition-all',
                              formData.gap === g ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300',
                            )}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs text-zinc-500">Rounded Corners</span>
                      <div className="grid grid-cols-5 gap-1 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
                        {['none', 'sm', 'md', 'lg', 'xl'].map(r => (
                          <button
                            key={r}
                            onClick={() => updateField('rounded', r)}
                            className={cn(
                              'text-[10px] uppercase rounded py-1 transition-all',
                              formData.rounded === r ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300',
                            )}
                          >
                            {r === 'none' ? '0' : r}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <Label className="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-wider">
                    <Sparkles size={14} /> Effects
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-xs text-zinc-500">Hover Effect</span>
                      <Select value={formData.hoverEffect} onValueChange={val => updateField('hoverEffect', val)}>
                        <SelectTrigger className="bg-zinc-900 border-zinc-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="zoom">Zoom In</SelectItem>
                          <SelectItem value="overlay">Dark Overlay</SelectItem>
                          <SelectItem value="grayscale">Grayscale Color</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between p-2 border border-zinc-800 bg-zinc-900/30 rounded-lg mt-6">
                      <span className="text-xs text-zinc-300 pl-2">Show Captions</span>
                      <Switch checked={formData.showCaption} onCheckedChange={c => updateField('showCaption', c)} />
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

export default MutationSection28;
