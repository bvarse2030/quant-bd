/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { useState, useEffect } from 'react';
import { LayoutTemplate, Save, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { ISection35Data, defaultDataSection35, IFeatureItem, IStatItem } from './data';

export interface SectionFormProps {
  data?: ISection35Data;
  onSubmit: (values: ISection35Data) => void;
}

const MutationSection35 = ({ data, onSubmit }: SectionFormProps) => {
  const [formData, setFormData] = useState<ISection35Data>({ ...defaultDataSection35 });

  useEffect(() => {
    if (data) {
      setFormData({
        ...defaultDataSection35,
        ...data,
        features: data.features || defaultDataSection35.features,
        stats: data.stats || defaultDataSection35.stats,
      });
    }
  }, [data]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = (field: keyof ISection35Data, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSubmit(formData);
  };

  const handleAddFeature = () => {
    const newFeature: IFeatureItem = {
      title: 'New Feature',
      subtitle: 'Feature description',
      iconName: 'Zap',
      iconColorClass: 'text-blue-500',
      bgColorClass: 'bg-blue-100',
    };
    updateField('features', [...formData.features, newFeature]);
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    updateField('features', newFeatures);
  };

  const updateFeature = (index: number, field: keyof IFeatureItem, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    updateField('features', newFeatures);
  };

  const handleAddStat = () => {
    const newStat: IStatItem = { value: '100+', label: 'New Stat', colorClass: 'text-blue-500' };
    updateField('stats', [...formData.stats, newStat]);
  };

  const handleRemoveStat = (index: number) => {
    const newStats = formData.stats.filter((_, i) => i !== index);
    updateField('stats', newStats);
  };

  const updateStat = (index: number, field: keyof IStatItem, value: string) => {
    const newStats = [...formData.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    updateField('stats', newStats);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <LayoutTemplate className="text-indigo-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Edit Section 35</h2>
            <p className="text-zinc-400 text-sm">Update features, CTA, and statistics.</p>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-zinc-300">CTA Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-400">Button Text</Label>
                <Input value={formData.ctaText} onChange={e => updateField('ctaText', e.target.value)} className="bg-zinc-950/50 border-zinc-800" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400">Button Link</Label>
                <Input value={formData.ctaLink} onChange={e => updateField('ctaLink', e.target.value)} className="bg-zinc-950/50 border-zinc-800" />
              </div>
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-zinc-300 text-lg font-semibold">Left Column: Features</Label>
              <Button onClick={handleAddFeature} size="sm" variant="outline" className="border-zinc-700 hover:bg-zinc-800">
                <Plus className="w-4 h-4 mr-2" /> Add Feature
              </Button>
            </div>

            <div className="space-y-3">
              {formData.features.map((item, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl relative group">
                  <button
                    onClick={() => handleRemoveFeature(idx)}
                    className="absolute top-2 right-2 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="flex-1 space-y-2">
                    <Label className="text-xs text-zinc-500">Title</Label>
                    <Input value={item.title} onChange={e => updateFeature(idx, 'title', e.target.value)} className="bg-zinc-950/50 border-zinc-800 h-8" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label className="text-xs text-zinc-500">Subtitle</Label>
                    <Input
                      value={item.subtitle}
                      onChange={e => updateFeature(idx, 'subtitle', e.target.value)}
                      className="bg-zinc-950/50 border-zinc-800 h-8"
                    />
                  </div>
                  <div className="w-32 space-y-2">
                    <Label className="text-xs text-zinc-500">Icon Name</Label>
                    <select
                      value={item.iconName}
                      onChange={e => updateFeature(idx, 'iconName', e.target.value)}
                      className="w-full h-8 bg-zinc-950/50 border border-zinc-800 rounded-md px-2 text-sm text-zinc-300"
                    >
                      <option value="FileText">FileText</option>
                      <option value="Clock">Clock</option>
                      <option value="Target">Target</option>
                      <option value="CheckCircle">CheckCircle</option>
                      <option value="Zap">Zap</option>
                    </select>
                  </div>
                  <div className="w-32 space-y-2">
                    <Label className="text-xs text-zinc-500">Color Class</Label>
                    <Input
                      value={item.iconColorClass}
                      onChange={e => updateFeature(idx, 'iconColorClass', e.target.value)}
                      className="bg-zinc-950/50 border-zinc-800 h-8"
                      placeholder="text-red-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-zinc-300 text-lg font-semibold">Right Column: Stats</Label>
              <Button onClick={handleAddStat} size="sm" variant="outline" className="border-zinc-700 hover:bg-zinc-800">
                <Plus className="w-4 h-4 mr-2" /> Add Stat
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {formData.stats.map((item, idx) => (
                <div key={idx} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl relative group space-y-3">
                  <button
                    onClick={() => handleRemoveStat(idx)}
                    className="absolute top-2 right-2 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="space-y-1">
                    <Label className="text-xs text-zinc-500">Value</Label>
                    <Input value={item.value} onChange={e => updateStat(idx, 'value', e.target.value)} className="bg-zinc-950/50 border-zinc-800 h-8" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-zinc-500">Label</Label>
                    <Input value={item.label} onChange={e => updateStat(idx, 'label', e.target.value)} className="bg-zinc-950/50 border-zinc-800 h-8" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-zinc-500">Color Class</Label>
                    <Input
                      value={item.colorClass}
                      onChange={e => updateStat(idx, 'colorClass', e.target.value)}
                      className="bg-zinc-950/50 border-zinc-800 h-8"
                      placeholder="text-red-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur flex justify-end">
          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-500 text-white">
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MutationSection35;
