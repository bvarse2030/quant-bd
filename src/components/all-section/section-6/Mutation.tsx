/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { useState, useEffect } from 'react';
import { Sparkles, X, LayoutTemplate, Save, Image as ImageIcon } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ImageUploadManagerSingle from '@/components/dashboard-ui/ImageUploadManagerSingle';

import type { ISection6Data } from './data';
import { defaultDataSection6 } from './data';

export interface SectionFormProps {
  data?: ISection6Data;
  onSubmit: (values: ISection6Data) => void;
}

const MutationSection6 = ({ data, onSubmit }: SectionFormProps) => {
  const [formData, setFormData] = useState<ISection6Data>({ ...defaultDataSection6 });
  const [highlightInput, setHighlightInput] = useState('');

  useEffect(() => {
    if (data) {
      setFormData({ ...data });
    }
  }, [data]);

  const updateField = (field: keyof ISection6Data, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addHighlight = () => {
    if (highlightInput.trim()) {
      updateField('highlights', [...formData.highlights, highlightInput.trim()]);
      setHighlightInput('');
    }
  };

  const removeHighlight = (index: number) => {
    updateField(
      'highlights',
      formData.highlights.filter((_, i) => i !== index),
    );
  };

  const handleSave = () => {
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur flex items-center gap-3">
          <div className="p-2 bg-teal-500/10 rounded-lg">
            <LayoutTemplate className="text-teal-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">Edit Section 6</h2>
            <p className="text-zinc-400 text-sm">Update the content and design of this section.</p>
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <LayoutTemplate size={16} /> Text Content
              </h3>
              <div className="space-y-4 bg-zinc-950/30 p-4 rounded-xl border border-zinc-800/50">
                <div className="space-y-2">
                  <Label className="text-zinc-400">Title</Label>
                  <Input
                    value={formData.title}
                    onChange={e => updateField('title', e.target.value)}
                    className="bg-zinc-900 border-zinc-800 focus:border-teal-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Heading</Label>
                  <Input
                    value={formData.heading}
                    onChange={e => updateField('heading', e.target.value)}
                    placeholder="Lecture number, topic etc."
                    className="bg-zinc-900 border-zinc-800 focus:border-teal-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Subtitle</Label>
                  <Input
                    value={formData.subtitle}
                    onChange={e => updateField('subtitle', e.target.value)}
                    placeholder="Subtitle or tag line"
                    className="bg-zinc-900 border-zinc-800 focus:border-teal-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <LayoutTemplate size={16} /> Descriptions
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-zinc-400">Main Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={e => updateField('description', e.target.value)}
                    placeholder="Write section description..."
                    className="min-h-[100px] bg-zinc-950/50 border-zinc-800 focus:border-teal-500 resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Additional Description</Label>
                  <Textarea
                    value={formData.additionalDescription}
                    onChange={e => updateField('additionalDescription', e.target.value)}
                    placeholder="Additional details..."
                    className="min-h-[100px] bg-zinc-950/50 border-zinc-800 focus:border-teal-500 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon size={16} /> Media
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 bg-zinc-950/30 p-4 rounded-xl border border-zinc-800/50">
                  <Label className="text-zinc-400 text-xs">Primary Image</Label>
                  <ImageUploadManagerSingle value={formData.image} onChange={url => updateField('image', url)} />
                </div>
                <div className="space-y-2 bg-zinc-950/30 p-4 rounded-xl border border-zinc-800/50">
                  <Label className="text-zinc-400 text-xs">Secondary Image</Label>
                  <ImageUploadManagerSingle value={formData.secondaryImage} onChange={url => updateField('secondaryImage', url)} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={16} /> Highlights
              </h3>
              <div className="bg-zinc-950/30 p-4 rounded-xl border border-zinc-800/50 space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={highlightInput}
                    onChange={e => setHighlightInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                    placeholder="Add highlight..."
                    className="bg-zinc-900 border-zinc-800 focus:border-teal-500"
                  />
                  <Button onClick={addHighlight} className="bg-teal-600 hover:bg-teal-500 text-white">
                    <Sparkles className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-lg text-sm text-teal-200">
                      <Sparkles className="w-3 h-3 text-teal-400" />
                      {highlight}
                      <button onClick={() => removeHighlight(idx)} className="ml-1 hover:text-red-400 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {formData.highlights.length === 0 && <p className="text-xs text-zinc-500 italic">No highlights added yet.</p>}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-400">Featured Label</Label>
                  <Input
                    value={formData.featuredLabel}
                    onChange={e => updateField('featuredLabel', e.target.value)}
                    className="bg-zinc-950/50 border-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Student Count</Label>
                  <Input value={formData.studentCount} onChange={e => updateField('studentCount', e.target.value)} className="bg-zinc-950/50 border-zinc-800" />
                </div>
              </div>
            </div>

            <div className="bg-zinc-950/30 p-4 rounded-xl border border-zinc-800/50 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-500 text-xs">Primary Button</Label>
                  <Input value={formData.buttonPrimary} onChange={e => updateField('buttonPrimary', e.target.value)} className="bg-zinc-900 border-zinc-800" />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-500 text-xs">Secondary Button</Label>
                  <Input
                    value={formData.buttonSecondary}
                    onChange={e => updateField('buttonSecondary', e.target.value)}
                    className="bg-zinc-900 border-zinc-800"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-500 text-xs">Enrollment Text</Label>
                  <Input
                    value={formData.enrollmentText}
                    onChange={e => updateField('enrollmentText', e.target.value)}
                    className="bg-zinc-900 border-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-500 text-xs">CTA Text</Label>
                  <Input value={formData.ctaText} onChange={e => updateField('ctaText', e.target.value)} className="bg-zinc-900 border-zinc-800" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur flex justify-end">
          <Button onClick={handleSave} variant="outlineGlassy" size="sm">
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MutationSection6;
