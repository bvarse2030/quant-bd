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
import { Plus, Trash2, Clock, Layout, MoveHorizontal, Save, Image as ImageIcon, Play, Pause, Settings2, Layers, RotateCcw } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import ImageUploadManagerSingle from '@/components/dashboard-ui/ImageUploadManagerSingle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { defaultDataSection25, ISlideItem, ISliderData, SliderFormProps } from './data';

const ScrollArea = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn('relative w-full h-full overflow-hidden', className)}>
      <div className="h-full w-full overflow-y-auto scrollbar-hide scroll-smooth pb-20">{children}</div>
      <div className="pointer-events-none absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-zinc-950 to-transparent z-10" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-zinc-950 to-transparent z-10" />
    </div>
  );
};

const ModernInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}) => (
  <div className="space-y-1.5">
    <Label className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">{label}</Label>
    <Input type={type} value={value} onChange={onChange} placeholder={placeholder} className="bg-zinc-900/50 border-zinc-800 focus:border-blue-500" />
  </div>
);

const MutationSection25 = ({ data, onSubmit }: SliderFormProps) => {
  const [formData, setFormData] = useState<ISliderData>({ ...defaultDataSection25 });
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'content' | 'settings'>('content');

  useEffect(() => {
    if (data) {
      setFormData({ ...defaultDataSection25, ...data });
    }
  }, [data]);

  const updateField = (field: keyof ISliderData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSlide = () => {
    const newSlide: ISlideItem = {
      id: Math.random().toString(36).substr(2, 9),
      image: '',
      title: `Slide ${formData.slides.length + 1}`,
      description: 'Add a catchy description...',
    };
    setFormData(prev => ({ ...prev, slides: [...prev.slides, newSlide] }));
    setActiveSlideIndex(formData.slides.length);
  };

  const removeSlide = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newSlides = formData.slides.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, slides: newSlides }));
    if (activeSlideIndex >= newSlides.length) {
      setActiveSlideIndex(Math.max(0, newSlides.length - 1));
    }
  };

  const updateSlide = (index: number, field: keyof ISlideItem, value: string) => {
    const newSlides = [...formData.slides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setFormData(prev => ({ ...prev, slides: newSlides }));
  };

  const currentSlideData = formData.slides[activeSlideIndex];

  const handleReset = () => {
    setFormData(defaultDataSection25);
  };

  return (
    <div className="min-h-[700px] w-full max-w-2xl md:max-w-6xl mx-auto bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-500/30 flex flex-col lg:flex-row rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
      <div className="lg:w-[45%] bg-zinc-950 relative flex flex-col h-[600px] lg:h-auto">
        <div className="flex border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('content')}
            className={cn(
              'flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors',
              activeTab === 'content' ? 'text-blue-400 border-b-2 border-blue-500 bg-zinc-900/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900',
            )}
          >
            <Layers size={14} /> Slide Content
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={cn(
              'flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors',
              activeTab === 'settings' ? 'text-blue-400 border-b-2 border-blue-500 bg-zinc-900/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900',
            )}
          >
            <Settings2 size={14} /> Global Settings
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
                    <Label className="text-[10px] uppercase font-bold text-zinc-500">Select Slide to Edit</Label>
                    <button onClick={addSlide} className="text-[10px] flex items-center gap-1 text-blue-400 hover:text-blue-300">
                      <Plus size={12} /> Add New
                    </button>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {formData.slides.map((slide, idx) => (
                      <div
                        key={slide.id}
                        onClick={() => {
                          setActiveSlideIndex(idx);
                        }}
                        className={cn(
                          'relative flex-shrink-0 w-24 h-16 rounded-lg border-2 overflow-hidden cursor-pointer transition-all',
                          activeSlideIndex === idx ? 'border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'border-zinc-800 hover:border-zinc-600',
                        )}
                      >
                        {slide.image ? (
                          <Image src={slide.image} alt={`Slide ${idx + 1}`} width={96} height={64} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-600">
                            <ImageIcon size={16} />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] px-1 truncate">#{idx + 1}</div>
                        {formData.slides.length > 1 && (
                          <button onClick={e => removeSlide(idx, e)} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 opacity-0 hover:opacity-100">
                            <Trash2 size={10} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addSlide}
                      className="flex-shrink-0 w-16 h-16 rounded-lg border border-dashed border-zinc-700 flex items-center justify-center text-zinc-600 hover:text-zinc-400 hover:bg-zinc-900 transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                <div className="w-full h-px bg-zinc-800/50" />

                {currentSlideData ? (
                  <motion.div key={currentSlideData.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">Slide Image</Label>
                      <ImageUploadManagerSingle value={currentSlideData.image} onChange={(url: string) => updateSlide(activeSlideIndex, 'image', url)} />
                    </div>

                    <ModernInput
                      label="Heading"
                      value={currentSlideData.title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSlide(activeSlideIndex, 'title', e.target.value)}
                    />

                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">Description</Label>
                      <Textarea
                        value={currentSlideData.description}
                        onChange={e => updateSlide(activeSlideIndex, 'description', e.target.value)}
                        className="w-full min-h-[80px] bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500 transition-all resize-y"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <ModernInput
                        label="Button Text"
                        value={currentSlideData.buttonText || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSlide(activeSlideIndex, 'buttonText', e.target.value)}
                        placeholder="e.g. Learn More"
                      />
                      <ModernInput
                        label="Button Link"
                        value={currentSlideData.buttonLink || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSlide(activeSlideIndex, 'buttonLink', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-10 text-zinc-500">No slides. Click + to add one.</div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <section className="space-y-4">
                  <Label className="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-wider">
                    <Layout size={14} /> Layout
                  </Label>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-xs text-zinc-500">Items per View</span>
                      <Select value={String(formData.itemsPerSlide)} onValueChange={val => updateField('itemsPerSlide', parseInt(val))}>
                        <SelectTrigger className="bg-zinc-900 border-zinc-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4].map(n => (
                            <SelectItem key={n} value={String(n)}>
                              {n} Slide{n > 1 && 's'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs text-zinc-500">Height</span>
                      <Select value={formData.height} onValueChange={val => updateField('height', val)}>
                        <SelectTrigger className="bg-zinc-900 border-zinc-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Auto (Aspect Video)</SelectItem>
                          <SelectItem value="fixed-sm">Small (300px)</SelectItem>
                          <SelectItem value="fixed-md">Medium (450px)</SelectItem>
                          <SelectItem value="fixed-lg">Large (600px)</SelectItem>
                          <SelectItem value="screen">Full Screen</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-zinc-500">Overlay Opacity</span>
                      <span className="text-xs font-mono text-blue-400">{formData.overlayOpacity}%</span>
                    </div>
                    <Slider min={0} max={90} value={[formData.overlayOpacity]} onValueChange={([val]) => updateField('overlayOpacity', val)} className="py-2" />
                  </div>
                </section>

                <div className="w-full h-px bg-zinc-800/50" />

                <section className="space-y-4">
                  <Label className="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-wider">
                    <Clock size={14} /> Playback
                  </Label>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between p-3 bg-zinc-900/30 border border-zinc-800 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={cn('p-2 rounded bg-zinc-800', formData.isAutoplay ? 'text-green-400' : 'text-zinc-500')}>
                          <Play size={16} />
                        </div>
                        <div className="text-xs">
                          <p className="text-zinc-200 font-medium">Autoplay</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              type="number"
                              value={formData.autoplaySpeed}
                              onChange={e => updateField('autoplaySpeed', parseInt(e.target.value))}
                              className="w-16 bg-zinc-950 border border-zinc-700 rounded px-1 py-0.5 text-[10px] text-center h-6"
                            />
                            <span className="text-zinc-500 text-[10px]">ms delay</span>
                          </div>
                        </div>
                      </div>
                      <Switch checked={formData.isAutoplay} onCheckedChange={c => updateField('isAutoplay', c)} />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-zinc-900/30 border border-zinc-800 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-zinc-800 text-zinc-500">
                          <Pause size={16} />
                        </div>
                        <span className="text-xs text-zinc-200 font-medium">Pause on Hover</span>
                      </div>
                      <Switch checked={formData.pauseOnHover} onCheckedChange={c => updateField('pauseOnHover', c)} />
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <Label className="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-wider">
                    <MoveHorizontal size={14} /> Navigation
                  </Label>
                  <div className="space-y-3">
                    <Select value={formData.navPosition} onValueChange={val => updateField('navPosition', val)}>
                      <SelectTrigger className="bg-zinc-900 border-zinc-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="middle-inside">Arrows: Inside Middle</SelectItem>
                        <SelectItem value="middle-outside">Arrows: Outside Middle</SelectItem>
                        <SelectItem value="bottom-overlay">Arrows: Bottom Overlay</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                      <Switch checked={formData.showArrowsOnHover} onCheckedChange={c => updateField('showArrowsOnHover', c)} />
                      <span>Only show arrows on hover</span>
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

export default MutationSection25;
