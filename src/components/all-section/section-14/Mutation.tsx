/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import {
  X,
  Tag,
  Save,
  Plus,
  Users,
  Trash2,
  MapPin,
  Ticket,
  Layers,
  Sparkles,
  ImageIcon,
  ChevronDown,
  CalendarDays,
  LayoutTemplate,
  Badge as BadgeIcon,
} from 'lucide-react';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ImageUploadManagerSingle from '@/components/dashboard-ui/ImageUploadManagerSingle';

import { ISection14Data, defaultDataSection14, IEvent } from './data';

export interface Section14FormProps {
  data?: ISection14Data;
  onSubmit: (values: ISection14Data) => void;
}

const MutationSection14 = ({ data, onSubmit }: Section14FormProps) => {
  const [formData, setFormData] = useState<ISection14Data>({
    ...defaultDataSection14,
    categories: defaultDataSection14.categories || [],
    events: defaultDataSection14.events || [],
  });
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    if (data && typeof data !== 'string') {
      setFormData(prev => ({
        ...prev,
        ...data,
        categories: data.categories || prev.categories || [],
        events: data.events || prev.events || [],
      }));

      if (data.events && data.events.length > 0) {
        setExpandedEvent(data.events[0].id);
      }
    }
  }, [data]);

  const handleChange = (field: keyof ISection14Data, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateEvent = (index: number, field: keyof IEvent, value: string) => {
    const updated = [...(formData.events || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, events: updated }));
  };

  const addEvent = () => {
    const categories = formData.categories || [];
    const newEvent: IEvent = {
      id: `evt-${Date.now()}`,
      title: 'New Event',
      date: 'TBD',
      location: 'TBD',
      image: '',
      category: categories.length > 0 ? categories[0] : 'General',
      description: 'Event details goes here...',
      actionText: 'Register',
    };
    setFormData(prev => ({
      ...prev,
      events: [newEvent, ...(prev.events || [])],
    }));
    setExpandedEvent(newEvent.id);
  };

  const removeEvent = (index: number) => {
    const updated = (formData.events || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, events: updated }));
  };

  const toggleExpand = (id: string) => {
    setExpandedEvent(expandedEvent === id ? null : id);
  };

  const handleAddCategory = () => {
    const currentCategories = formData.categories || [];
    if (newCategory.trim() && !currentCategories.includes(newCategory.trim())) {
      setFormData(prev => ({
        ...prev,
        categories: [...(prev.categories || []), newCategory.trim()],
      }));
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (catToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      categories: (prev.categories || []).filter(c => c !== catToRemove),
    }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-rose-500/30 pb-32 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-rose-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-orange-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 relative z-10">
        <div className="flex flex-col items-center md:items-start text-center md:text-left mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-widest mb-4"
          >
            <Users size={12} />
            <span>Community Manager</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
            Events & Gatherings
          </h1>
          <p className="text-zinc-500 mt-2 text-lg max-w-2xl">Curate your community meetup schedule. Manage event details, categories, and locations.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6 h-fit lg:sticky lg:top-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-md shadow-xl"
            >
              <div className="flex items-center gap-2 text-zinc-400 uppercase text-xs font-bold tracking-widest mb-6">
                <LayoutTemplate size={14} />
                <span>Section Header</span>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-zinc-300 flex items-center gap-2">
                    <BadgeIcon size={14} className="text-rose-400" /> Badge Text
                  </Label>
                  <Input
                    value={formData.badge}
                    onChange={e => handleChange('badge', e.target.value)}
                    className="bg-zinc-950/50 border-white/10 focus:border-rose-500/50 h-11"
                    placeholder="e.g. Get Together"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Title</Label>
                  <Input
                    value={formData.title}
                    onChange={e => handleChange('title', e.target.value)}
                    className="bg-zinc-950/50 border-white/10 focus:border-rose-500/50 h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Subtitle</Label>
                  <Input
                    value={formData.subTitle}
                    onChange={e => handleChange('subTitle', e.target.value)}
                    className="bg-zinc-950/50 border-white/10 focus:border-rose-500/50 h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={e => handleChange('description', e.target.value)}
                    className="bg-zinc-950/50 border-white/10 min-h-[100px] resize-none focus:border-rose-500/50"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-md shadow-xl"
            >
              <div className="flex items-center gap-2 text-rose-400 uppercase text-xs font-bold tracking-widest mb-6">
                <Layers size={14} />
                <span>Event Categories</span>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                    placeholder="Add category..."
                    className="bg-zinc-950/50 border-white/10 focus:border-rose-500/50 h-10"
                  />
                  <Button onClick={handleAddCategory} size="sm" className="bg-zinc-800 hover:bg-zinc-700 h-10 w-10 p-0">
                    <Plus size={16} />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(formData.categories || []).map(cat => (
                    <motion.span
                      key={cat}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-medium text-zinc-300 group hover:border-rose-500/30 hover:text-rose-200 transition-colors"
                    >
                      {cat}
                      <button onClick={() => handleRemoveCategory(cat)} className="text-zinc-500 hover:text-red-400 transition-colors">
                        <X size={12} />
                      </button>
                    </motion.span>
                  ))}
                  {(!formData.categories || formData.categories.length === 0) && <span className="text-zinc-600 text-xs italic">No categories defined.</span>}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
              <Button
                onClick={addEvent}
                className="w-full bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white border-none py-8 rounded-2xl font-bold shadow-lg shadow-rose-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex flex-col items-center gap-1">
                  <Plus className="h-5 w-5 mb-1" />
                  <span>Create New Event</span>
                </div>
              </Button>
            </motion.div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence>
              {(formData.events || []).map((evt, index) => (
                <motion.div
                  key={evt.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`relative group bg-zinc-900/60 border ${
                    expandedEvent === evt.id ? 'border-rose-500/40 ring-1 ring-rose-500/20' : 'border-white/5 hover:border-white/10'
                  } rounded-3xl overflow-hidden backdrop-blur-md transition-all duration-300`}
                >
                  <div className="p-6 flex items-center justify-between cursor-pointer" onClick={() => toggleExpand(evt.id)}>
                    <div className="flex items-center gap-5">
                      <div className="h-16 w-16 rounded-xl bg-zinc-950 flex items-center justify-center border border-white/5 overflow-hidden shrink-0 shadow-inner">
                        {evt.image ? (
                          <Image width={100} height={100} src={evt.image} alt={evt.title} className="w-full h-full object-cover" unoptimized />
                        ) : (
                          <CalendarDays size={24} className="text-zinc-700" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-zinc-100 group-hover:text-rose-400 transition-colors">{evt.title || 'Untitled Event'}</h3>
                        <div className="flex flex-wrap gap-3 mt-1.5">
                          <span className="text-zinc-500 text-xs flex items-center gap-1 bg-zinc-950/50 px-2 py-0.5 rounded-md border border-white/5">
                            <CalendarDays size={10} /> {evt.date}
                          </span>
                          <span className="text-zinc-500 text-xs flex items-center gap-1 bg-zinc-950/50 px-2 py-0.5 rounded-md border border-white/5">
                            <Tag size={10} /> {evt.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 p-0 rounded-full"
                        onClick={e => {
                          e.stopPropagation();
                          removeEvent(index);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                      <div className={`transition-transform duration-300 ${expandedEvent === evt.id ? 'rotate-180 text-rose-400' : 'text-zinc-500'}`}>
                        <ChevronDown size={20} />
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedEvent === evt.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5"
                      >
                        <div className="p-6 md:p-8 space-y-8 bg-zinc-950/30">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-5">
                              <div className="space-y-2">
                                <Label className="text-zinc-400 text-xs uppercase font-bold tracking-wider">Event Name</Label>
                                <Input
                                  value={evt.title}
                                  onChange={e => updateEvent(index, 'title', e.target.value)}
                                  className="bg-zinc-900/50 border-white/10 focus:border-rose-500/50 h-10"
                                  placeholder="e.g. Annual Summit"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-zinc-400 text-xs uppercase font-bold tracking-wider flex items-center gap-1">
                                    <CalendarDays size={12} /> Date
                                  </Label>
                                  <Input
                                    value={evt.date}
                                    onChange={e => updateEvent(index, 'date', e.target.value)}
                                    className="bg-zinc-900/50 border-white/10 focus:border-rose-500/50 h-10"
                                    placeholder="Oct 20, 2024"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-zinc-400 text-xs uppercase font-bold tracking-wider flex items-center gap-1">
                                    <MapPin size={12} /> Location
                                  </Label>
                                  <Input
                                    value={evt.location}
                                    onChange={e => updateEvent(index, 'location', e.target.value)}
                                    className="bg-zinc-900/50 border-white/10 focus:border-rose-500/50 h-10"
                                    placeholder="City / Online"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-zinc-400 text-xs uppercase font-bold tracking-wider flex items-center gap-1">
                                    <Tag size={12} /> Category
                                  </Label>
                                  <div className="relative">
                                    <select
                                      value={evt.category}
                                      onChange={e => updateEvent(index, 'category', e.target.value)}
                                      className="w-full bg-zinc-900/50 border border-white/10 rounded-md h-10 px-3 text-sm text-zinc-100 appearance-none focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 cursor-pointer"
                                    >
                                      <option value="" disabled>
                                        Select Category
                                      </option>
                                      {(formData.categories || []).map(cat => (
                                        <option key={cat} value={cat} className="bg-zinc-900 text-zinc-100">
                                          {cat}
                                        </option>
                                      ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={14} />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-zinc-400 text-xs uppercase font-bold tracking-wider flex items-center gap-1">
                                    <Ticket size={12} /> Button Label
                                  </Label>
                                  <Input
                                    value={evt.actionText}
                                    onChange={e => updateEvent(index, 'actionText', e.target.value)}
                                    className="bg-zinc-900/50 border-white/10 focus:border-rose-500/50 h-10"
                                    placeholder="Register"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-5">
                              <div className="space-y-2">
                                <Label className="text-zinc-400 text-xs uppercase font-bold tracking-wider flex items-center gap-1">
                                  <ImageIcon size={12} /> Cover Image
                                </Label>
                                <div className="bg-zinc-950/50 rounded-xl border border-white/10 p-4 min-h-[140px] flex flex-col justify-center">
                                  <ImageUploadManagerSingle value={evt.image} onChange={url => updateEvent(index, 'image', url)} />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-zinc-400 text-xs uppercase font-bold tracking-wider">Description</Label>
                                <Textarea
                                  value={evt.description}
                                  onChange={e => updateEvent(index, 'description', e.target.value)}
                                  className="bg-zinc-900/50 border-white/10 min-h-[80px] resize-none focus:border-rose-500/50 text-zinc-300 leading-relaxed"
                                  placeholder="Describe the event..."
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>

            {(!formData.events || formData.events.length === 0) && (
              <div className="text-center py-12 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
                <p className="text-zinc-500 italic">No events listed. Start by adding one.</p>
              </div>
            )}
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
              <Sparkles size={14} className="text-rose-400" />
              Editing Mode
            </span>
            <span className="text-xs text-zinc-400">Section 14: Community</span>
          </div>
          <Button
            onClick={() => onSubmit(formData)}
            className="bg-white text-zinc-950 hover:bg-rose-50 hover:text-rose-900 px-8 py-6 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default MutationSection14;
