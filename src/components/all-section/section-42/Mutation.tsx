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

import { ISection42Data, defaultDataSection42, IStatItem } from './data';

export interface SectionFormProps {
  data?: ISection42Data;
  onSubmit: (values: ISection42Data) => void;
}

const MutationSection42 = ({ data, onSubmit }: SectionFormProps) => {
  const [formData, setFormData] = useState<ISection42Data>({ ...defaultDataSection42 });

  useEffect(() => {
    if (data) {
      setFormData({
        ...defaultDataSection42,
        ...data,
        stats: data.stats || defaultDataSection42.stats,
      });
    }
  }, [data]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = (field: keyof ISection42Data, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSubmit(formData);
  };

  const handleAddStat = () => {
    const newStat: IStatItem = {
      number: '100+',
      label: 'New Metric',
    };
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
      <div className="max-w-4xl mx-auto bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <LayoutTemplate className="text-indigo-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Edit Section 42</h2>
            <p className="text-zinc-400 text-sm">Update hero text and statistics.</p>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-zinc-400">Badge Text</Label>
              <Input
                value={formData.badgeText}
                onChange={e => updateField('badgeText', e.target.value)}
                className="bg-zinc-950/50 border-zinc-800 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-400">Heading Prefix</Label>
                <Input
                  value={formData.headingPrefix}
                  onChange={e => updateField('headingPrefix', e.target.value)}
                  className="bg-zinc-950/50 border-zinc-800 focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-red-400">Heading Highlight</Label>
                <Input
                  value={formData.headingHighlight}
                  onChange={e => updateField('headingHighlight', e.target.value)}
                  className="bg-zinc-950/50 border-zinc-800 focus:border-red-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400">Heading Suffix</Label>
                <Input
                  value={formData.headingSuffix}
                  onChange={e => updateField('headingSuffix', e.target.value)}
                  className="bg-zinc-950/50 border-zinc-800 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-zinc-300 text-lg font-semibold">Statistics Grid</Label>
              <Button onClick={handleAddStat} size="sm" variant="outline" className="border-zinc-700 hover:bg-zinc-800">
                <Plus className="w-4 h-4 mr-2" /> Add Stat
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formData.stats.map((stat, idx) => (
                <div key={idx} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl space-y-3 relative group">
                  <button
                    onClick={() => handleRemoveStat(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500/10 text-red-400 rounded-md hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all z-10"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="space-y-1">
                    <Label className="text-xs text-zinc-500">Number Value</Label>
                    <Input
                      value={stat.number}
                      onChange={e => updateStat(idx, 'number', e.target.value)}
                      className="bg-zinc-950/50 border-zinc-800 h-9 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-zinc-500">Label</Label>
                    <Input value={stat.label} onChange={e => updateStat(idx, 'label', e.target.value)} className="bg-zinc-950/50 border-zinc-800 h-9" />
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

export default MutationSection42;
