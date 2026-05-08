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
import { LayoutGrid, AlignLeft, AlignCenter, AlignRight, Trash2, Plus, Image as ImageIcon, Maximize, Crop, Save, Scan, RotateCcw } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ImageUploadManagerSingle from '@/components/dashboard-ui/ImageUploadManagerSingle';

import { defaultDataSection24, IImagesData, ImagesFormProps } from './data';

const ScrollArea = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn('relative w-full h-full overflow-hidden', className)}>
      <div className="h-full w-full overflow-y-auto scrollbar-hide scroll-smooth pb-20">{children}</div>
      <div className="pointer-events-none absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-zinc-950 to-transparent z-10" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-zinc-950 to-transparent z-10" />
    </div>
  );
};

const MutationSection24 = ({ data, onSubmit }: ImagesFormProps) => {
  const [formData, setFormData] = useState<IImagesData>({ ...defaultDataSection24 });

  useEffect(() => {
    if (data) setFormData({ ...defaultDataSection24, ...data });
  }, [data]);

  const updateField = (field: keyof IImagesData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addImageSlot = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageSlot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const updateImageUrl = (index: number, url: string) => {
    const newImages = [...formData.images];
    newImages[index] = url;
    setFormData(prev => ({ ...prev, images: newImages }));
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (formData: any) => {
    onSubmit(formData);
  };
  const handleReset = () => {
    setFormData(defaultDataSection24);
  };

  return (
    <div className="min-h-[650px] w-full max-w-6xl mx-auto bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-500/30 flex flex-col lg:flex-row rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
      <div className="lg:w-1/2 bg-zinc-950 relative flex flex-col h-[600px] lg:h-auto">
        <ScrollArea className="h-full">
          <div className="p-6 lg:p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-1">Edit Images</h2>
                <p className="text-zinc-400 text-sm">Manage gallery assets and layout.</p>
              </div>
              <button onClick={handleReset} className="text-xs text-zinc-600 hover:text-zinc-300 flex items-center gap-1 transition-colors">
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-zinc-400">
                  <ImageIcon size={14} /> Asset Manager
                </Label>
                <Button onClick={addImageSlot} size="sm" variant="outlineGlassy">
                  <Plus size={12} className="mr-1" /> Add Image
                </Button>
              </div>

              <div className="space-y-3">
                <AnimatePresence initial={false}>
                  {formData.images.map((url, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-3 hover:border-zinc-700 transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 flex items-center justify-center bg-zinc-800 rounded text-[10px] text-zinc-500 font-mono shrink-0 mt-1">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <ImageUploadManagerSingle value={url} onChange={(newUrl: string) => updateImageUrl(index, newUrl)} />
                        </div>
                        <button
                          onClick={() => removeImageSlot(index)}
                          className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                          title="Remove Image"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {formData.images.length === 0 && (
                  <div
                    onClick={addImageSlot}
                    className="h-20 border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-600 cursor-pointer hover:border-zinc-700 hover:bg-zinc-900/30 transition-all"
                  >
                    <Plus size={18} className="mb-1" />
                    <span className="text-xs">Click to add first image</span>
                  </div>
                )}
              </div>
            </section>

            <div className="w-full h-px bg-zinc-800/50" />

            <section className="space-y-6">
              <Label className="flex items-center gap-2 text-zinc-400">
                <LayoutGrid size={14} /> Composition
              </Label>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <span className="text-xs text-zinc-500">Grid Columns</span>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map(col => (
                      <button
                        key={col}
                        onClick={() => updateField('gridColumns', col)}
                        className={cn(
                          'flex items-center justify-center p-2 rounded-lg transition-all border text-xs font-medium',
                          formData.gridColumns === col
                            ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300',
                        )}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-zinc-500">Alignment</span>
                  <div className="flex bg-zinc-900/50 p-1 rounded-lg border border-zinc-800 h-[38px]">
                    {[
                      { val: 'left', icon: AlignLeft },
                      { val: 'center', icon: AlignCenter },
                      { val: 'right', icon: AlignRight },
                    ].map(item => (
                      <button
                        key={item.val}
                        onClick={() => updateField('alignment', item.val)}
                        className={cn(
                          'flex-1 flex items-center justify-center rounded-md transition-all',
                          formData.alignment === item.val ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300',
                        )}
                      >
                        <item.icon size={16} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <Label className="flex items-center gap-2 text-zinc-400">
                <Scan size={14} /> Appearance
              </Label>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-xs text-zinc-500 flex items-center gap-1">
                    <Maximize size={10} /> Container Width
                  </span>
                  <Select value={formData.width} onValueChange={val => updateField('width', val)}>
                    <SelectTrigger className="bg-zinc-900 border-zinc-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto Size</SelectItem>
                      <SelectItem value="100%">Full Width (100%)</SelectItem>
                      <SelectItem value="75%">Wide (75%)</SelectItem>
                      <SelectItem value="50%">Half (50%)</SelectItem>
                      <SelectItem value="fixed-sm">Small (200px)</SelectItem>
                      <SelectItem value="fixed-md">Medium (400px)</SelectItem>
                      <SelectItem value="fixed-lg">Large (600px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-zinc-500 flex items-center gap-1">
                    <Crop size={10} /> Aspect Ratio
                  </span>
                  <Select value={formData.aspectRatio} onValueChange={val => updateField('aspectRatio', val)}>
                    <SelectTrigger className="bg-zinc-900 border-zinc-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Original</SelectItem>
                      <SelectItem value="1/1">Square (1:1)</SelectItem>
                      <SelectItem value="16/9">Video (16:9)</SelectItem>
                      <SelectItem value="4/3">Photo (4:3)</SelectItem>
                      <SelectItem value="3/4">Portrait (3:4)</SelectItem>
                      <SelectItem value="3/2">Classic (3:2)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs text-zinc-500">Image Fill Mode</span>
                <div className="grid grid-cols-3 gap-2">
                  {['cover', 'contain', 'fill'].map(fit => (
                    <button
                      key={fit}
                      onClick={() => updateField('objectFit', fit)}
                      className={cn(
                        'flex items-center justify-center p-2 rounded-lg transition-all border text-xs font-medium capitalize',
                        formData.objectFit === fit
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300',
                      )}
                    >
                      {fit}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-zinc-900/30 rounded-xl border border-zinc-800 grid grid-cols-2 gap-4 items-end">
                <div className="space-y-2">
                  <span className="text-xs text-zinc-500">Corner Radius</span>
                  <Select value={formData.borderRadius} onValueChange={val => updateField('borderRadius', val)}>
                    <SelectTrigger className="bg-zinc-900 border-zinc-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Square (0px)</SelectItem>
                      <SelectItem value="sm">Small (4px)</SelectItem>
                      <SelectItem value="md">Medium (8px)</SelectItem>
                      <SelectItem value="lg">Large (16px)</SelectItem>
                      <SelectItem value="full">Full / Pill</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg border border-zinc-800 bg-zinc-900 h-[40px]">
                  <span className="text-xs font-medium pl-1 text-zinc-400">Drop Shadow</span>
                  <Switch checked={formData.shadow} onCheckedChange={c => updateField('shadow', c)} />
                </div>
              </div>
            </section>

            <div className="pt-6 border-t border-zinc-800 flex justify-end">
              <Button onClick={() => handleSubmit(formData)} variant="outlineGlassy" className="w-full">
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

export default MutationSection24;
