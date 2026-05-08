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
import { Save, Plus, Trash2, Briefcase, Calendar, Trophy, Target, Layers, X, ChevronDown, ChevronUp, Sparkles, Wand2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import { ISection12Data, defaultDataSection12, IExperienceItem } from './data';

export interface Section12FormProps {
  data?: ISection12Data;
  onSubmit: (values: ISection12Data) => void;
}

const MutationSection12 = ({ data, onSubmit }: Section12FormProps) => {
  const [formData, setFormData] = useState<ISection12Data>({ ...defaultDataSection12 });
  const [expandedExp, setExpandedExp] = useState<string | null>(null);
  const [featureInputs, setFeatureInputs] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (data && typeof data !== 'string') {
      setFormData(data);
      if (data.experiences && data.experiences.length > 0) {
        setExpandedExp(data.experiences[0].id);
      }
    }
  }, [data]);

  const handleChange = (field: keyof ISection12Data, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateExperience = (index: number, field: keyof IExperienceItem, value: any) => {
    const updated = [...formData.experiences];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, experiences: updated }));
  };

  const updateMilestone = (index: number, field: 'label' | 'value', value: string) => {
    const updated = [...formData.experiences];
    updated[index] = {
      ...updated[index],
      highlightMilestone: { ...updated[index].highlightMilestone, [field]: value },
    };
    setFormData(prev => ({ ...prev, experiences: updated }));
  };

  const addExperience = () => {
    const newExp: IExperienceItem = {
      id: `exp-${Date.now()}`,
      year: '2024 - Present',
      companyName: 'New Company',
      role: 'Role Title',
      description: 'Describe your role and impact here...',
      lastAchievement: 'Significant achievement',
      highlightMilestone: { label: 'Metric', value: '100%' },
      features: ['Skill 1'],
    };
    setFormData(prev => ({ ...prev, experiences: [newExp, ...prev.experiences] }));
    setExpandedExp(newExp.id);
  };

  const removeExperience = (index: number) => {
    const updated = formData.experiences.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, experiences: updated }));
  };

  const handleFeatureInput = (id: string, value: string) => {
    setFeatureInputs(prev => ({ ...prev, [id]: value }));
  };

  const addFeature = (index: number, id: string) => {
    const value = featureInputs[id]?.trim();
    if (value) {
      const updated = [...formData.experiences];
      updated[index] = {
        ...updated[index],
        features: [...updated[index].features, value],
      };
      setFormData(prev => ({ ...prev, experiences: updated }));
      setFeatureInputs(prev => ({ ...prev, [id]: '' }));
    }
  };

  const removeFeature = (expIndex: number, featureIndex: number) => {
    const updated = [...formData.experiences];
    updated[expIndex] = {
      ...updated[expIndex],
      features: updated[expIndex].features.filter((_, i) => i !== featureIndex),
    };
    setFormData(prev => ({ ...prev, experiences: updated }));
  };

  const editFeature = (expIndex: number, featureIndex: number, id: string) => {
    const featureToEdit = formData.experiences[expIndex].features[featureIndex];
    const updated = [...formData.experiences];
    updated[expIndex] = {
      ...updated[expIndex],
      features: updated[expIndex].features.filter((_, i) => i !== featureIndex),
    };
    setFormData(prev => ({ ...prev, experiences: updated }));
    setFeatureInputs(prev => ({ ...prev, [id]: featureToEdit }));
  };

  const toggleExpand = (id: string) => {
    setExpandedExp(expandedExp === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 pb-32">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-fuchsia-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8 relative z-10">
        <div className="mb-12 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest"
          >
            <Sparkles size={12} />
            <span>Timeline Editor</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
            Professional Journey
          </h1>
          <p className="text-slate-400 max-w-2xl text-lg">
            Craft your career timeline. Add roles, highlight achievements, and showcase the skills that define your path.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6 h-fit lg:sticky lg:top-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-md shadow-xl overflow-hidden relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-2 text-indigo-400 uppercase text-xs font-bold tracking-widest">
                  <Briefcase size={14} />
                  <span>Section Details</span>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-slate-300 font-medium">Main Title</Label>
                    <Input
                      value={formData.title}
                      onChange={e => handleChange('title', e.target.value)}
                      className="bg-slate-950/50 border-white/10 focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300 font-medium">Subtitle</Label>
                    <Input
                      value={formData.subTitle}
                      onChange={e => handleChange('subTitle', e.target.value)}
                      className="bg-slate-950/50 border-white/10 focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300 font-medium">Description</Label>
                    <Textarea
                      value={formData.description}
                      onChange={e => handleChange('description', e.target.value)}
                      className="bg-slate-950/50 border-white/10 focus:border-indigo-500/50 focus:ring-indigo-500/20 min-h-[120px] resize-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
              <Button
                onClick={addExperience}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border-none py-8 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] group"
              >
                <div className="flex flex-col items-center gap-1">
                  <Plus className="h-6 w-6 mb-1 group-hover:rotate-90 transition-transform duration-300" />
                  <span>Add New Position</span>
                </div>
              </Button>
            </motion.div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence>
              {formData.experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`relative group bg-slate-900/60 border ${
                    expandedExp === exp.id ? 'border-indigo-500/40 ring-1 ring-indigo-500/20' : 'border-white/5 hover:border-white/10'
                  } rounded-3xl overflow-hidden backdrop-blur-md transition-all duration-300`}
                >
                  <div className="p-6 cursor-pointer" onClick={() => toggleExpand(exp.id)}>
                    <div className="flex items-start md:items-center justify-between gap-4">
                      <div className="flex items-center gap-5">
                        <div
                          className={`h-14 w-14 rounded-2xl flex items-center justify-center border transition-colors duration-300 ${
                            expandedExp === exp.id
                              ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                              : 'bg-slate-800/50 border-white/5 text-slate-400 group-hover:bg-slate-800'
                          }`}
                        >
                          <Briefcase size={22} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">{exp.role || 'Role Title'}</h3>
                          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 text-sm text-slate-400 mt-1">
                            <span className="font-medium text-slate-300">{exp.companyName || 'Company'}</span>
                            <span className="hidden md:block w-1 h-1 bg-slate-600 rounded-full" />
                            <span className="flex items-center gap-1">
                              <Calendar size={12} /> {exp.year}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex flex-col items-end gap-2">
                          {expandedExp === exp.id ? <ChevronUp className="text-indigo-400" /> : <ChevronDown className="text-slate-500" />}
                        </div>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedExp === exp.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5"
                      >
                        <div className="p-6 md:p-8 space-y-8 bg-slate-950/30">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-5">
                              <div className="space-y-2">
                                <Label className="text-slate-400 flex items-center gap-2 text-xs uppercase tracking-wider">
                                  <Briefcase size={12} /> Role Title
                                </Label>
                                <Input
                                  value={exp.role}
                                  onChange={e => updateExperience(index, 'role', e.target.value)}
                                  className="bg-slate-900/50 border-white/10 focus:border-indigo-500/50 h-11"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-slate-400 flex items-center gap-2 text-xs uppercase tracking-wider">
                                  <Layers size={12} /> Company Name
                                </Label>
                                <Input
                                  value={exp.companyName}
                                  onChange={e => updateExperience(index, 'companyName', e.target.value)}
                                  className="bg-slate-900/50 border-white/10 focus:border-indigo-500/50 h-11"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-slate-400 flex items-center gap-2 text-xs uppercase tracking-wider">
                                  <Calendar size={12} /> Duration
                                </Label>
                                <Input
                                  value={exp.year}
                                  onChange={e => updateExperience(index, 'year', e.target.value)}
                                  className="bg-slate-900/50 border-white/10 focus:border-indigo-500/50 h-11"
                                />
                              </div>
                            </div>

                            <div className="space-y-5">
                              <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-2xl p-5 space-y-4">
                                <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-widest">
                                  <Target size={14} /> Highlight Milestone
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label className="text-indigo-200/60 text-xs">Label</Label>
                                    <Input
                                      value={exp.highlightMilestone.label}
                                      onChange={e => updateMilestone(index, 'label', e.target.value)}
                                      className="bg-slate-900/60 border-indigo-500/20 h-9 text-sm focus:border-indigo-400"
                                      placeholder="Revenue"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-indigo-200/60 text-xs">Value</Label>
                                    <Input
                                      value={exp.highlightMilestone.value}
                                      onChange={e => updateMilestone(index, 'value', e.target.value)}
                                      className="bg-slate-900/60 border-indigo-500/20 h-9 text-sm font-bold text-white focus:border-indigo-400"
                                      placeholder="+200%"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label className="text-slate-400 flex items-center gap-2 text-xs uppercase tracking-wider">
                                  <Trophy size={12} /> Key Achievement
                                </Label>
                                <Input
                                  value={exp.lastAchievement}
                                  onChange={e => updateExperience(index, 'lastAchievement', e.target.value)}
                                  className="bg-slate-900/50 border-white/10 focus:border-indigo-500/50 h-11"
                                  placeholder="Led team to Series B"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-slate-400 text-xs uppercase tracking-wider">Description</Label>
                            <Textarea
                              value={exp.description}
                              onChange={e => updateExperience(index, 'description', e.target.value)}
                              className="bg-slate-900/50 border-white/10 focus:border-indigo-500/50 min-h-[120px] resize-none text-slate-300 leading-relaxed"
                            />
                          </div>

                          <div className="space-y-3 pt-4 border-t border-white/5">
                            <Label className="text-slate-400 flex items-center gap-2 text-xs uppercase tracking-wider">
                              <Wand2 size={12} /> Skills & Tech Stack
                            </Label>

                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <Input
                                  value={featureInputs[exp.id] || ''}
                                  onChange={e => handleFeatureInput(exp.id, e.target.value)}
                                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature(index, exp.id))}
                                  className="bg-slate-900/50 border-white/10 focus:border-indigo-500/50 pl-10 h-12"
                                  placeholder="Type a skill and press Enter..."
                                />
                                <Plus className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                              </div>
                              <Button
                                onClick={() => addFeature(index, exp.id)}
                                className="h-12 w-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg p-0 flex items-center justify-center shrink-0"
                              >
                                <Plus size={20} />
                              </Button>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-3">
                              {exp.features.map((feature, fIndex) => (
                                <motion.div
                                  layout
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  key={`${index}-${fIndex}`}
                                  className="group relative flex items-center"
                                >
                                  <div
                                    onClick={() => editFeature(index, fIndex, exp.id)}
                                    className="cursor-pointer pl-4 pr-10 py-2 bg-slate-800/50 hover:bg-indigo-500/20 text-indigo-300 rounded-lg text-sm border border-indigo-500/20 hover:border-indigo-500/40 transition-all select-none"
                                  >
                                    {feature}
                                  </div>
                                  <button
                                    onClick={e => {
                                      e.stopPropagation();
                                      removeFeature(index, fIndex);
                                    }}
                                    className="absolute right-1 p-1 hover:bg-red-500/20 rounded-md text-slate-500 hover:text-red-400 transition-colors"
                                  >
                                    <X size={14} />
                                  </button>
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-slate-500 pointer-events-none whitespace-nowrap">
                                    Click to Edit
                                  </div>
                                </motion.div>
                              ))}
                              {exp.features.length === 0 && <span className="text-slate-600 text-sm italic py-2">No skills added yet.</span>}
                            </div>
                          </div>

                          <div className="flex justify-end pt-4 border-t border-white/5">
                            <Button
                              variant="ghost"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-2"
                              onClick={e => {
                                e.stopPropagation();
                                removeExperience(index);
                              }}
                            >
                              <Trash2 size={16} />
                              Delete Position
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl shadow-black/50 pointer-events-auto flex items-center gap-4"
        >
          <div className="hidden md:flex flex-col px-4">
            <span className="text-sm font-bold text-white">Unsaved Changes</span>
            <span className="text-xs text-slate-400">Update your timeline</span>
          </div>
          <Button
            onClick={() => onSubmit(formData)}
            className="bg-white text-slate-950 hover:bg-indigo-50 hover:text-indigo-900 px-8 py-6 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default MutationSection12;
