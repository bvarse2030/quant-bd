/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { useState, useEffect } from 'react';
import { LayoutTemplate, Save, Phone, Calendar, PlayCircle } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import { ISection40Data, defaultDataSection40 } from './data';

export interface SectionFormProps {
  data?: ISection40Data;
  onSubmit: (values: ISection40Data) => void;
}

const MutationSection40 = ({ data, onSubmit }: SectionFormProps) => {
  const [formData, setFormData] = useState<ISection40Data>({ ...defaultDataSection40 });

  useEffect(() => {
    if (data) {
      setFormData({
        ...defaultDataSection40,
        ...data,
      });
    }
  }, [data]);

  const updateField = (field: keyof ISection40Data, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <LayoutTemplate className="text-indigo-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Edit Section 40</h2>
            <p className="text-zinc-400 text-sm">Update the Call-to-Action banner.</p>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-zinc-400">Headline</Label>
              <Input
                value={formData.title}
                onChange={e => updateField('title', e.target.value)}
                className="bg-zinc-950/50 border-zinc-800 focus:border-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Subtitle</Label>
              <Textarea
                value={formData.subtitle}
                onChange={e => updateField('subtitle', e.target.value)}
                className="bg-zinc-950/50 border-zinc-800 focus:border-indigo-500 min-h-[80px] resize-none"
              />
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          <div className="space-y-4">
            <Label className="text-zinc-300 text-lg font-semibold">Buttons</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-400 mb-2">
                  <Calendar size={16} />
                  <span className="text-xs font-medium uppercase">Primary Button</span>
                </div>
                <Input
                  value={formData.buttonPrimaryText}
                  onChange={e => updateField('buttonPrimaryText', e.target.value)}
                  className="bg-zinc-950/50 border-zinc-800"
                />
              </div>
              <div className="space-y-2 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-400 mb-2">
                  <PlayCircle size={16} />
                  <span className="text-xs font-medium uppercase">Secondary Button</span>
                </div>
                <Input
                  value={formData.buttonSecondaryText}
                  onChange={e => updateField('buttonSecondaryText', e.target.value)}
                  className="bg-zinc-950/50 border-zinc-800"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          <div className="space-y-4">
            <Label className="text-zinc-300 text-lg font-semibold">Contact Information</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-zinc-400">Label Text</Label>
                <Input value={formData.contactLabel} onChange={e => updateField('contactLabel', e.target.value)} className="bg-zinc-950/50 border-zinc-800" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400">Phone Number Display</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <Input
                    value={formData.contactNumber}
                    onChange={e => updateField('contactNumber', e.target.value)}
                    className="bg-zinc-950/50 border-zinc-800 pl-9"
                  />
                </div>
              </div>
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

export default MutationSection40;
