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
import { Save, Plus, Trash2, Activity, ShieldAlert, TrendingUp, Sparkles, LayoutTemplate, Badge as BadgeIcon } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageUploadManagerSingle from '@/components/dashboard-ui/ImageUploadManagerSingle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { DashboardMetric, ModerationItem, defaultDataSection16 } from './data';

interface ISection16Data {
  id?: string;
  badge?: string;
  title?: string;
  subTitle?: string;
  metrics: DashboardMetric[];
  moderationQueue: ModerationItem[];
}

export interface Section16FormProps {
  data?: ISection16Data;
  onSubmit: (values: ISection16Data) => void;
}

const MutationSection16 = ({ data, onSubmit }: Section16FormProps) => {
  const [formData, setFormData] = useState<ISection16Data>(defaultDataSection16);

  useEffect(() => {
    if (data) {
      setFormData({
        ...defaultDataSection16,
        ...data,
        metrics: data.metrics || defaultDataSection16.metrics,
        moderationQueue: data.moderationQueue || defaultDataSection16.moderationQueue,
      });
    }
  }, [data]);

  const handleHeaderChange = (field: keyof ISection16Data, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateMetric = (index: number, field: keyof DashboardMetric, value: string | number | DashboardMetric['status']) => {
    const newMetrics = [...formData.metrics];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    newMetrics[index] = { ...newMetrics[index], [field]: value } as any;
    setFormData(prev => ({ ...prev, metrics: newMetrics }));
  };

  const addMetric = () => {
    const newMetric: DashboardMetric = {
      id: `m-${Date.now()}`,
      label: 'New Metric',
      value: '0',
      trend: 0,
      status: 'stable',
    };
    setFormData(prev => ({ ...prev, metrics: [...prev.metrics, newMetric] }));
  };

  const removeMetric = (index: number) => {
    const newMetrics = formData.metrics.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, metrics: newMetrics }));
  };

  const updateModItem = (index: number, field: string, value: string | number) => {
    const newQueue = [...formData.moderationQueue];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const parentObj = newQueue[index][parent as keyof ModerationItem];
      if (typeof parentObj === 'object' && parentObj !== null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (newQueue[index] as any)[parent] = { ...parentObj, [child]: value };
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (newQueue[index] as any)[field] = value;
    }
    setFormData(prev => ({ ...prev, moderationQueue: newQueue }));
  };

  const addModItem = () => {
    const newItem: ModerationItem = {
      id: `mod-${Date.now()}`,
      type: 'comment',
      content: 'New content to review...',
      author: {
        name: 'Anonymous',
        avatar: '',
        trustScore: 50,
      },
      flagReason: 'Manual Review',
      timestamp: 'Just now',
      severity: 'low',
    };
    setFormData(prev => ({ ...prev, moderationQueue: [newItem, ...prev.moderationQueue] }));
  };

  const removeModItem = (index: number) => {
    const newQueue = formData.moderationQueue.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, moderationQueue: newQueue }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-32 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-emerald-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-cyan-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 relative z-10">
        <div className="flex flex-col items-center md:items-start text-center md:text-left mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-4"
          >
            <Activity size={12} />
            <span>System Monitor</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-200 to-emerald-400">
            Command Center
          </h1>
          <p className="text-zinc-500 mt-2 text-lg max-w-2xl">Monitor system performance metrics and manage content moderation queues.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm space-y-5">
              <div className="flex items-center gap-2 text-emerald-400 uppercase text-xs font-bold tracking-widest pb-2 border-b border-white/5">
                <LayoutTemplate size={14} /> Section Header
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-zinc-400 text-xs uppercase font-bold tracking-wider flex items-center gap-1">
                    <BadgeIcon size={12} /> Badge
                  </Label>
                  <Input
                    value={formData.badge}
                    onChange={e => handleHeaderChange('badge', e.target.value)}
                    className="bg-zinc-950/50 border-white/10 focus:border-emerald-500/50 h-9 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400 text-xs uppercase font-bold tracking-wider">Main Title</Label>
                  <Input
                    value={formData.title}
                    onChange={e => handleHeaderChange('title', e.target.value)}
                    className="bg-zinc-950/50 border-white/10 focus:border-emerald-500/50 h-9 text-sm font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400 text-xs uppercase font-bold tracking-wider">Subtitle</Label>
                  <Textarea
                    value={formData.subTitle}
                    onChange={e => handleHeaderChange('subTitle', e.target.value)}
                    className="bg-zinc-950/50 border-white/10 focus:border-emerald-500/50 min-h-[60px] text-sm resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <Tabs defaultValue="metrics" className="w-full space-y-8">
              <div className="flex justify-center md:justify-start">
                <TabsList className="bg-zinc-900/50 border border-white/5 p-1 rounded-2xl backdrop-blur-md h-auto inline-flex">
                  <TabsTrigger
                    value="metrics"
                    className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white px-6 py-3 rounded-xl gap-2 text-zinc-400 transition-all font-medium"
                  >
                    <TrendingUp size={16} /> Metrics Grid
                  </TabsTrigger>
                  <TabsTrigger
                    value="moderation"
                    className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white px-6 py-3 rounded-xl gap-2 text-zinc-400 transition-all font-medium"
                  >
                    <ShieldAlert size={16} /> Moderation Queue
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="metrics" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimatePresence>
                    {formData.metrics.map((metric, index) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={metric.id}
                        className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 space-y-5 relative group backdrop-blur-sm hover:border-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-900/10"
                      >
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                            onClick={() => removeMetric(index)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-zinc-500 text-xs uppercase font-bold tracking-wider">Metric Label</Label>
                            <Input
                              value={metric.label}
                              onChange={e => updateMetric(index, 'label', e.target.value)}
                              className="bg-zinc-950/50 border-white/10 h-9 text-sm focus:border-emerald-500/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-zinc-500 text-xs uppercase font-bold tracking-wider">Current Value</Label>
                            <Input
                              value={metric.value}
                              onChange={e => updateMetric(index, 'value', e.target.value)}
                              className="bg-zinc-950/50 border-white/10 h-10 text-xl font-mono text-emerald-400 font-bold focus:border-emerald-500/50"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-zinc-500 text-xs uppercase font-bold tracking-wider">Trend %</Label>
                              <Input
                                type="number"
                                value={metric.trend}
                                onChange={e => updateMetric(index, 'trend', parseFloat(e.target.value))}
                                className="bg-zinc-950/50 border-white/10 h-9 text-sm focus:border-emerald-500/50"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-zinc-500 text-xs uppercase font-bold tracking-wider">Status</Label>
                              <Select value={metric.status} onValueChange={val => updateMetric(index, 'status', val as DashboardMetric['status'])}>
                                <SelectTrigger className="h-9 bg-zinc-950/50 border-white/10 text-xs focus:border-emerald-500/50">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                  <SelectItem value="stable" className="text-emerald-400">
                                    Stable
                                  </SelectItem>
                                  <SelectItem value="warning" className="text-yellow-400">
                                    Warning
                                  </SelectItem>
                                  <SelectItem value="critical" className="text-red-400">
                                    Critical
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addMetric}
                    className="bg-zinc-900/20 border-2 border-dashed border-zinc-800 rounded-3xl p-6 flex flex-col items-center justify-center text-zinc-500 hover:text-emerald-400 hover:bg-zinc-900/40 hover:border-emerald-500/30 transition-all min-h-[300px] gap-3 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-zinc-800 group-hover:bg-emerald-500/20 flex items-center justify-center transition-colors">
                      <Plus size={24} className="group-hover:text-emerald-400" />
                    </div>
                    <span className="text-sm font-bold tracking-wide">Add New Metric</span>
                  </motion.button>
                </div>
              </TabsContent>

              <TabsContent value="moderation" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-zinc-300">Pending Review</h3>
                  <Button onClick={addModItem} className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20">
                    <Plus className="mr-2 h-4 w-4" /> Add Item
                  </Button>
                </div>

                <div className="space-y-4">
                  <AnimatePresence>
                    {formData.moderationQueue.map((item, index) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={item.id}
                        className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 flex flex-col lg:flex-row gap-8 items-start backdrop-blur-sm group hover:border-emerald-500/20 transition-colors"
                      >
                        <div className="w-full lg:w-64 shrink-0 space-y-4">
                          <div className="flex flex-col items-center lg:items-start gap-4">
                            <div className="w-24 h-24 rounded-2xl bg-zinc-950 border border-white/10 overflow-hidden relative shadow-inner flex items-center justify-center">
                              <ImageUploadManagerSingle value={item.author.avatar} onChange={url => updateModItem(index, 'author.avatar', url)} />
                            </div>
                            <div className="w-full space-y-3">
                              <div className="space-y-1">
                                <Label className="text-zinc-500 text-xs ml-1">Author Name</Label>
                                <Input
                                  value={item.author.name}
                                  onChange={e => updateModItem(index, 'author.name', e.target.value)}
                                  className="bg-zinc-950/50 border-white/10 h-9 text-sm focus:border-emerald-500/50"
                                />
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex-1 space-y-1">
                                  <Label className="text-zinc-500 text-xs ml-1">Trust Score</Label>
                                  <Input
                                    type="number"
                                    value={item.author.trustScore}
                                    onChange={e => updateModItem(index, 'author.trustScore', parseInt(e.target.value))}
                                    className="bg-zinc-950/50 border-white/10 h-9 text-sm text-center focus:border-emerald-500/50"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 w-full space-y-6 lg:border-l lg:border-white/5 lg:pl-8">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="space-y-2">
                              <Label className="text-zinc-500 text-xs uppercase font-bold tracking-wider">Type</Label>
                              <Select value={item.type} onValueChange={val => updateModItem(index, 'type', val)}>
                                <SelectTrigger className="h-9 bg-zinc-950/50 border-white/10 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                  <SelectItem value="comment">Comment</SelectItem>
                                  <SelectItem value="article">Article</SelectItem>
                                  <SelectItem value="user">User Profile</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-zinc-500 text-xs uppercase font-bold tracking-wider">Flag Reason</Label>
                              <Input
                                value={item.flagReason}
                                onChange={e => updateModItem(index, 'flagReason', e.target.value)}
                                className="bg-zinc-950/50 border-white/10 h-9 text-xs focus:border-emerald-500/50"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-zinc-500 text-xs uppercase font-bold tracking-wider">Severity</Label>
                              <Select value={item.severity} onValueChange={val => updateModItem(index, 'severity', val)}>
                                <SelectTrigger className="h-9 bg-zinc-950/50 border-white/10 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                  <SelectItem value="low" className="text-emerald-400">
                                    Low
                                  </SelectItem>
                                  <SelectItem value="medium" className="text-yellow-400">
                                    Medium
                                  </SelectItem>
                                  <SelectItem value="high" className="text-red-400">
                                    High
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-zinc-500 text-xs uppercase font-bold tracking-wider">Time</Label>
                              <Input
                                value={item.timestamp}
                                onChange={e => updateModItem(index, 'timestamp', e.target.value)}
                                className="bg-zinc-950/50 border-white/10 h-9 text-xs focus:border-emerald-500/50"
                              />
                            </div>
                          </div>

                          <div className="space-y-2 relative">
                            <Label className="text-zinc-500 text-xs uppercase font-bold tracking-wider">Content Body</Label>
                            <Textarea
                              value={item.content}
                              onChange={e => updateModItem(index, 'content', e.target.value)}
                              className="bg-zinc-950/50 border-white/10 min-h-[100px] text-sm font-mono text-zinc-300 focus:border-emerald-500/50 leading-relaxed"
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => removeModItem(index)}
                              className="absolute bottom-2 right-2 h-8 w-8 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {formData.moderationQueue.length === 0 && (
                    <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl text-zinc-500 bg-zinc-900/20">
                      <ShieldAlert size={48} className="mx-auto mb-4 opacity-20" />
                      <p>All clean. No items in moderation.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
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
              <Sparkles size={14} className="text-emerald-400" />
              Editing Mode
            </span>
            <span className="text-xs text-zinc-400">Section 16: Dashboard</span>
          </div>
          <Button
            onClick={() => onSubmit(formData)}
            className="bg-white text-zinc-950 hover:bg-emerald-50 hover:text-emerald-900 px-8 py-6 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default MutationSection16;
