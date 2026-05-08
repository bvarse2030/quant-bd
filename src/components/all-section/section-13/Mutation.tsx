/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Plus, Trash2, Users, Handshake, Briefcase, LayoutTemplate, ImageIcon, X, Sparkles, Tag } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ImageUploadManagerSingle from '@/components/dashboard-ui/ImageUploadManagerSingle';

import { ISection13Data, defaultDataSection13, IPartner, ICollabOption } from './data';

export interface Section13FormProps {
  data?: ISection13Data;
  onSubmit: (values: ISection13Data) => void;
}

const MutationSection13 = ({ data, onSubmit }: Section13FormProps) => {
  const [formData, setFormData] = useState<ISection13Data>({ ...defaultDataSection13 });

  useEffect(() => {
    if (data && typeof data !== 'string') {
      setFormData(data);
    }
  }, [data]);

  const handleChange = (field: keyof ISection13Data, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addPartner = () => {
    const newPartner: IPartner = {
      id: `partner-${Date.now()}`,
      name: 'New Partner',
      logo: '',
    };
    setFormData(prev => ({ ...prev, partners: [...prev.partners, newPartner] }));
  };

  const removePartner = (index: number) => {
    const updated = formData.partners.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, partners: updated }));
  };

  const updatePartner = (index: number, field: keyof IPartner, value: string) => {
    const updated = [...formData.partners];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, partners: updated }));
  };

  const addOption = () => {
    const newOption: ICollabOption = {
      id: `opt-${Date.now()}`,
      title: 'New Service',
      description: 'Description of the collaboration model.',
    };
    setFormData(prev => ({ ...prev, collabOptions: [...prev.collabOptions, newOption] }));
  };

  const removeOption = (index: number) => {
    const updated = formData.collabOptions.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, collabOptions: updated }));
  };

  const updateOption = (index: number, field: keyof ICollabOption, value: string) => {
    const updated = [...formData.collabOptions];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, collabOptions: updated }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-cyan-500/30 pb-32 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-cyan-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-blue-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-widest mb-4"
            >
              <Handshake size={12} />
              <span>Network & Growth</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">Collaboration</h1>
            <p className="text-zinc-500 mt-2 text-lg">Manage your strategic partners and engagement models.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-xl"
            >
              <div className="flex items-center gap-2 text-zinc-400 uppercase text-xs font-bold tracking-widest mb-6">
                <LayoutTemplate size={14} />
                <span>Section Header</span>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-zinc-300 flex items-center gap-2">
                    <Tag size={14} /> Badge Text
                  </Label>
                  <Input
                    value={formData.badge}
                    onChange={e => handleChange('badge', e.target.value)}
                    className="bg-zinc-950/50 border-white/10 focus:border-cyan-500/50 h-11"
                    placeholder="e.g. Partnership Network"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Main Title</Label>
                  <Input
                    value={formData.title}
                    onChange={e => handleChange('title', e.target.value)}
                    className="bg-zinc-950/50 border-white/10 focus:border-cyan-500/50 h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Subtitle</Label>
                  <Input
                    value={formData.subTitle}
                    onChange={e => handleChange('subTitle', e.target.value)}
                    className="bg-zinc-950/50 border-white/10 focus:border-cyan-500/50 h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={e => handleChange('description', e.target.value)}
                    className="bg-zinc-950/50 border-white/10 min-h-[100px] resize-none focus:border-cyan-500/50"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-xl flex flex-col h-fit"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-cyan-400 uppercase text-xs font-bold tracking-widest">
                  <Users size={14} />
                  <span>Trusted Partners</span>
                </div>
                <Button onClick={addPartner} size="sm" className="bg-zinc-800 hover:bg-zinc-700 text-white border border-white/5">
                  <Plus size={14} className="mr-2" /> Add Logo
                </Button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {formData.partners.map((partner, index) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={partner.id}
                      className="bg-zinc-950/60 border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-5 group relative overflow-hidden"
                    >
                      <div className="shrink-0 relative">
                        <div className="w-20 h-20 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden shadow-inner">
                          {partner.logo ? (
                            <div className="relative w-full h-full p-2">
                              <Image src={partner.logo} alt={partner.name} fill className="object-contain" unoptimized />
                            </div>
                          ) : (
                            <ImageIcon size={24} className="text-zinc-700" />
                          )}
                        </div>
                      </div>

                      <div className="flex-1 w-full space-y-3 min-w-0 z-10">
                        <div className="space-y-1">
                          <Label className="text-xs text-zinc-500 font-medium ml-1">Company Name</Label>
                          <Input
                            value={partner.name}
                            onChange={e => updatePartner(index, 'name', e.target.value)}
                            className="h-9 bg-zinc-900/50 border-white/10 focus:border-cyan-500/50"
                            placeholder="Enter partner name"
                          />
                        </div>

                        <div className="relative">
                          <Label className="text-xs text-zinc-500 font-medium ml-1 mb-1 block">Logo Source</Label>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 max-w-[200px]">
                              <ImageUploadManagerSingle value={partner.logo} onChange={url => updatePartner(index, 'logo', url)} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="absolute top-2 right-2 sm:relative sm:top-0 sm:right-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removePartner(index)}
                          className="text-zinc-600 hover:text-red-400 hover:bg-red-500/10 h-8 w-8"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {formData.partners.length === 0 && (
                  <div className="text-center py-12 text-zinc-600 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
                    <p className="text-sm">No partners added yet.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-xl min-h-full"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-cyan-400 uppercase text-xs font-bold tracking-widest">
                  <Briefcase size={14} />
                  <span>Service Models</span>
                </div>
                <Button
                  onClick={addOption}
                  size="sm"
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-none shadow-lg shadow-cyan-900/20"
                >
                  <Plus size={14} className="mr-2" /> Add Model
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                  {formData.collabOptions.map((opt, index) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={opt.id}
                      className="relative group bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all hover:shadow-lg hover:shadow-cyan-500/5"
                    >
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                          onClick={() => removeOption(index)}
                        >
                          <X size={16} />
                        </Button>
                      </div>

                      <div className="space-y-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                          <Handshake size={24} />
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Title</Label>
                            <Input
                              value={opt.title}
                              onChange={e => updateOption(index, 'title', e.target.value)}
                              className="bg-zinc-900/50 border-white/5 focus:border-cyan-500/50 font-bold text-lg h-10 px-0 pl-3"
                              placeholder="Service Name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Description</Label>
                            <Textarea
                              value={opt.description}
                              onChange={e => updateOption(index, 'description', e.target.value)}
                              className="bg-zinc-900/50 border-white/5 min-h-[100px] text-sm resize-none focus:border-cyan-500/50 leading-relaxed text-zinc-300"
                              placeholder="Describe this engagement model..."
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
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
              <Sparkles size={14} className="text-cyan-400" />
              Editing Mode
            </span>
            <span className="text-xs text-zinc-400">Section 13: Collaboration</span>
          </div>
          <Button
            onClick={() => onSubmit(formData)}
            className="bg-white text-zinc-950 hover:bg-cyan-50 hover:text-cyan-900 px-8 py-6 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default MutationSection13;
