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
import { LayoutTemplate, Save, Plus, X, Link as LinkIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { ISection33Data, defaultDataSection33 } from './data';

export interface SectionFormProps {
  data?: ISection33Data;
  onSubmit: (values: ISection33Data) => void;
}

const MutationSection33 = ({ data, onSubmit }: SectionFormProps) => {
  const [formData, setFormData] = useState<ISection33Data>({ ...defaultDataSection33 });
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    if (data) {
      setFormData({
        ...defaultDataSection33,
        ...data,
        avatarUrls: data.avatarUrls || defaultDataSection33.avatarUrls,
      });
    }
  }, [data]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = (field: keyof ISection33Data, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSubmit(formData);
  };

  const handleAddImage = () => {
    if (!newUrl.trim()) return;
    updateField('avatarUrls', [...formData.avatarUrls, newUrl]);
    setNewUrl('');
  };

  const handleRemoveImage = (index: number) => {
    const newImages = formData.avatarUrls.filter((_, i) => i !== index);
    updateField('avatarUrls', newImages);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <LayoutTemplate className="text-indigo-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Edit Section 33</h2>
            <p className="text-zinc-400 text-sm">Update social proof text and avatars.</p>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-zinc-400">Subtitle Text</Label>
              <Input
                value={formData.subTitle}
                onChange={e => updateField('subTitle', e.target.value)}
                className="bg-zinc-950/50 border-zinc-800 focus:border-indigo-500"
                placeholder="e.g., Join thousands..."
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Count Text</Label>
              <Input
                value={formData.countText}
                onChange={e => updateField('countText', e.target.value)}
                className="bg-zinc-950/50 border-zinc-800 focus:border-indigo-500"
                placeholder="e.g., +50,000 students"
              />
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          <div className="space-y-4">
            <Label className="text-zinc-300 text-lg font-semibold">User Avatars</Label>

            {formData.avatarUrls.length > 0 && (
              <div className="flex flex-wrap gap-4 p-4 bg-zinc-950/30 rounded-xl border border-zinc-800/50">
                {formData.avatarUrls.map((url, idx) => (
                  <div key={idx} className="relative group w-16 h-16">
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-zinc-700 shadow-sm relative">
                      <Image
                        src={url}
                        alt="Avatar"
                        fill
                        className="object-cover"
                        onError={e => {
                          (e.target as HTMLImageElement).src = 'https://i.ibb.co.com/PGXYXwTq/img.jpg';
                        }}
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg transform hover:scale-110"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 items-end">
              <div className="space-y-2 flex-1">
                <Label className="text-xs text-zinc-500">Add Image URL</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-2.5 text-zinc-600 w-4 h-4" />
                  <Input value={newUrl} onChange={e => setNewUrl(e.target.value)} className="bg-zinc-950/50 border-zinc-800 pl-9" placeholder="https://..." />
                </div>
              </div>
              <Button onClick={handleAddImage} size="icon" className="bg-indigo-600 hover:bg-indigo-500 mb-0.5">
                <Plus className="w-5 h-5" />
              </Button>
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

export default MutationSection33;
