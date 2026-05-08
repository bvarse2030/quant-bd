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

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import { ISection41Data, defaultDataSection41, IServiceFeature } from './data';

export interface SectionFormProps {
  data?: ISection41Data;
  onSubmit: (values: ISection41Data) => void;
}

const iconOptions = ['Users', 'Award', 'BookOpen', 'Plane', 'Globe', 'Zap', 'CheckCircle'];

const MutationSection41 = ({ data, onSubmit }: SectionFormProps) => {
  const [formData, setFormData] = useState<ISection41Data>({ ...defaultDataSection41 });

  useEffect(() => {
    if (data) {
      setFormData({
        ...defaultDataSection41,
        ...data,
        features: data.features || defaultDataSection41.features,
      });
    }
  }, [data]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = (field: keyof ISection41Data, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSubmit(formData);
  };

  const handleAddFeature = () => {
    const newFeature: IServiceFeature = {
      title: 'New Feature',
      description: 'Feature description goes here.',
      iconName: 'Zap',
    };
    updateField('features', [...formData.features, newFeature]);
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    updateField('features', newFeatures);
  };

  const updateFeature = (index: number, field: keyof IServiceFeature, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    updateField('features', newFeatures);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <LayoutTemplate className="text-indigo-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Edit Section 41</h2>
            <p className="text-zinc-400 text-sm">Update study abroad services content.</p>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-zinc-400">Top Badge Text</Label>
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

            <div className="space-y-2">
              <Label className="text-zinc-400">CTA Button Text</Label>
              <Input value={formData.ctaText} onChange={e => updateField('ctaText', e.target.value)} className="bg-zinc-950/50 border-zinc-800" />
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          <div className="space-y-4">
            <Label className="text-zinc-300 text-lg font-semibold">Illustration Card Details</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-400">Card Badge</Label>
                <Input
                  value={formData.rightCardBadge}
                  onChange={e => updateField('rightCardBadge', e.target.value)}
                  className="bg-zinc-950/50 border-zinc-800"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400">Location Label</Label>
                <Input value={formData.locationLabel} onChange={e => updateField('locationLabel', e.target.value)} className="bg-zinc-950/50 border-zinc-800" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400">Destination Label</Label>
                <Input
                  value={formData.destinationLabel}
                  onChange={e => updateField('destinationLabel', e.target.value)}
                  className="bg-zinc-950/50 border-zinc-800"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-zinc-300 text-lg font-semibold">Service Features</Label>
              <Button onClick={handleAddFeature} size="sm" variant="outline" className="border-zinc-700 hover:bg-zinc-800">
                <Plus className="w-4 h-4 mr-2" /> Add Feature
              </Button>
            </div>

            <div className="space-y-4">
              {formData.features.map((feature, idx) => (
                <div key={idx} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl relative group flex gap-4 items-start">
                  <button
                    onClick={() => handleRemoveFeature(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500/10 text-red-400 rounded-md hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all z-10"
                  >
                    <Trash2 size={14} />
                  </button>

                  <div className="w-16 space-y-2">
                    <Label className="text-xs text-zinc-500">Icon</Label>
                    <select
                      value={feature.iconName}
                      onChange={e => updateFeature(idx, 'iconName', e.target.value)}
                      className="w-full h-9 bg-zinc-950/50 border border-zinc-800 rounded-md px-1 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500"
                    >
                      {iconOptions.map(opt => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-zinc-500">Title</Label>
                      <Input value={feature.title} onChange={e => updateFeature(idx, 'title', e.target.value)} className="bg-zinc-950/50 border-zinc-800 h-9" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-zinc-500">Description</Label>
                      <Textarea
                        value={feature.description}
                        onChange={e => updateFeature(idx, 'description', e.target.value)}
                        className="bg-zinc-950/50 border-zinc-800 min-h-[60px] resize-none text-sm"
                      />
                    </div>
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

export default MutationSection41;
