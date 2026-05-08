/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { useState, useEffect } from 'react';
import { LayoutTemplate, Save, Plus, X, Type } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import { ISection34Data, defaultDataSection34 } from './data';

export interface SectionFormProps {
  data?: ISection34Data;
  onSubmit: (values: ISection34Data) => void;
}

const MutationSection34 = ({ data, onSubmit }: SectionFormProps) => {
  const [formData, setFormData] = useState<ISection34Data>({ ...defaultDataSection34 });

  useEffect(() => {
    if (data) {
      setFormData({
        ...defaultDataSection34,
        ...data,
        features: data.features || defaultDataSection34.features,
      });
    }
  }, [data]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = (field: keyof ISection34Data, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSubmit(formData);
  };

  const handleAddFeature = () => {
    updateField('features', [...formData.features, 'New Feature']);
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    updateField('features', newFeatures);
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    updateField('features', newFeatures);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <LayoutTemplate className="text-indigo-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Edit Section 34</h2>
            <p className="text-zinc-400 text-sm">Update the hero text and animated tags.</p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-400">Heading Line 1</Label>
                <Input
                  value={formData.headingLine1}
                  onChange={e => updateField('headingLine1', e.target.value)}
                  className="bg-zinc-950/50 border-zinc-800 focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-red-400">Heading Highlight (Red)</Label>
                <Input
                  value={formData.headingHighlight}
                  onChange={e => updateField('headingHighlight', e.target.value)}
                  className="bg-zinc-950/50 border-zinc-800 focus:border-red-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-400">Heading Line 2</Label>
                <Input
                  value={formData.headingLine2}
                  onChange={e => updateField('headingLine2', e.target.value)}
                  className="bg-zinc-950/50 border-zinc-800 focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-orange-400">Heading Gradient (Orange)</Label>
                <Input
                  value={formData.headingGradient}
                  onChange={e => updateField('headingGradient', e.target.value)}
                  className="bg-zinc-950/50 border-zinc-800 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-400">Subtitle</Label>
              <Textarea
                value={formData.subtitle}
                onChange={e => updateField('subtitle', e.target.value)}
                className="min-h-[100px] bg-zinc-950/50 border-zinc-800 focus:border-indigo-500 resize-none"
              />
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-zinc-300 text-lg font-semibold">Animated Feature Tags</Label>
              <Button onClick={handleAddFeature} size="sm" variant="outline" className="border-zinc-700 hover:bg-zinc-800">
                <Plus className="w-4 h-4 mr-2" /> Add Tag
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formData.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-zinc-900/50 border border-zinc-800 rounded-lg group">
                  <div className="p-2 bg-zinc-800 rounded text-zinc-500">
                    <Type size={16} />
                  </div>
                  <Input
                    value={feature}
                    onChange={e => updateFeature(idx, e.target.value)}
                    className="border-0 bg-transparent focus-visible:ring-0 px-0 h-auto"
                  />
                  <Button
                    onClick={() => handleRemoveFeature(idx)}
                    variant="ghost"
                    size="icon"
                    className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </Button>
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

export default MutationSection34;
