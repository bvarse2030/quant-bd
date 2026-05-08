/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { LayoutTemplate, Save, X } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ImageUploadManagerSingle from '@/components/dashboard-ui/ImageUploadManagerSingle';

import type { ISection1Data } from './data';
import { defaultDataSection1 } from './data';

export interface SectionFormProps {
  data?: ISection1Data;
  onSubmit: (values: ISection1Data) => void;
}

const MuationSection1 = ({ data, onSubmit }: SectionFormProps) => {
  const [formData, setFormData] = useState<ISection1Data>({ ...defaultDataSection1 });

  useEffect(() => {
    if (data) {
      setFormData({ ...data });
    }
  }, [data]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = (field: keyof ISection1Data, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSubmit(formData);
  };

  const handleRemoveUserImage = (indexToRemove: number) => {
    const newImages = formData.usersImages.filter((_, index) => index !== indexToRemove);
    updateField('usersImages', newImages);
  };

  const handleAddUserImage = (url: string) => {
    if (!url) return;
    const newImages = [...formData.usersImages, url];
    updateField('usersImages', newImages);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <LayoutTemplate className="text-indigo-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Edit Section 1</h2>
            <p className="text-zinc-400 text-sm">Update the content and design of this section.</p>
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-zinc-400">Title</Label>
              <Input
                value={formData.title}
                onChange={e => updateField('title', e.target.value)}
                placeholder="Enter section title"
                className="bg-zinc-950/50 border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-400">Heading</Label>
              <Input
                value={formData.heading}
                onChange={e => updateField('heading', e.target.value)}
                placeholder="Lecture number, topic etc."
                className="bg-zinc-950/50 border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-400">Description</Label>
              <Textarea
                value={formData.description}
                onChange={e => updateField('description', e.target.value)}
                placeholder="Write section description..."
                className="min-h-[120px] bg-zinc-950/50 border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-400">Main Image</Label>
              <div className="bg-zinc-950/30 p-4 rounded-xl border border-zinc-800/50">
                <div className="mb-3">
                  <Input
                    value={formData.image}
                    onChange={e => updateField('image', e.target.value)}
                    placeholder="https://..."
                    className="bg-zinc-900 border-zinc-800 mb-2"
                  />
                </div>
                <ImageUploadManagerSingle value={formData.image} onChange={url => updateField('image', url)} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-400">Featured Label</Label>
                <Input
                  value={formData.featuredLabel}
                  onChange={e => updateField('featuredLabel', e.target.value)}
                  className="bg-zinc-950/50 border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-400">Student Count</Label>
                <Input
                  value={formData.studentCount}
                  onChange={e => updateField('studentCount', e.target.value)}
                  className="bg-zinc-950/50 border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-400">Enrollment Text</Label>
              <Input
                value={formData.enrollmentText}
                onChange={e => updateField('enrollmentText', e.target.value)}
                className="bg-zinc-950/50 border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-zinc-400">User Avatars</Label>
              <div className="bg-zinc-950/30 p-4 rounded-xl border border-zinc-800/50 space-y-4">
                {formData.usersImages?.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {formData.usersImages.map((imgUrl, idx) => (
                      <div key={idx} className="relative group w-14 h-14">
                        <div className="relative w-full h-full rounded-full overflow-hidden border border-zinc-700 shadow-sm">
                          <Image src={imgUrl} alt={`User ${idx}`} fill className="object-cover" />
                        </div>
                        <button
                          onClick={() => handleRemoveUserImage(idx)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-zinc-800 pt-3">
                  <p className="text-xs text-zinc-500 mb-2">Add new avatar</p>

                  <ImageUploadManagerSingle label="" value="" onChange={handleAddUserImage} />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950/30 border border-zinc-800/50 space-y-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Buttons</h3>
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

export default MuationSection1;
