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

import { ISection43Data, defaultDataSection43, IStoryItem } from './data';

export interface SectionFormProps {
  data?: ISection43Data;
  onSubmit: (values: ISection43Data) => void;
}

const MutationSection43 = ({ data, onSubmit }: SectionFormProps) => {
  const [formData, setFormData] = useState<ISection43Data>({ ...defaultDataSection43 });

  useEffect(() => {
    if (data) {
      setFormData({
        ...defaultDataSection43,
        ...data,
        stories: data.stories || defaultDataSection43.stories,
      });
    }
  }, [data]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = (field: keyof ISection43Data, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSubmit(formData);
  };

  const handleAddStory = () => {
    const newStory: IStoryItem = {
      id: Date.now().toString(),
      name: 'New Student',
      university: 'University Name',
      subject: 'Major / Subject',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000&auto=format&fit=crop',
      description: 'Enter a brief description of the student journey here.',
    };
    updateField('stories', [...formData.stories, newStory]);
  };

  const handleRemoveStory = (index: number) => {
    const newStories = formData.stories.filter((_, i) => i !== index);
    updateField('stories', newStories);
  };

  const updateStory = (index: number, field: keyof IStoryItem, value: string) => {
    const newStories = [...formData.stories];
    newStories[index] = { ...newStories[index], [field]: value };
    updateField('stories', newStories);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <LayoutTemplate className="text-indigo-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Edit Timeline Section</h2>
            <p className="text-zinc-400 text-sm">Manage student success stories and journey timeline.</p>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-zinc-400">Section Title</Label>
              <Input
                value={formData.title}
                onChange={e => updateField('title', e.target.value)}
                className="bg-zinc-950/50 border-zinc-800 focus:border-indigo-500 text-lg font-semibold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Subtitle / Description</Label>
              <Input
                value={formData.subtitle}
                onChange={e => updateField('subtitle', e.target.value)}
                className="bg-zinc-950/50 border-zinc-800 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          <div className="space-y-6">
            <div className="flex items-center justify-between sticky top-0 z-10 bg-zinc-900/95 backdrop-blur py-4 border-b border-zinc-800">
              <Label className="text-zinc-300 text-lg font-semibold flex items-center gap-2">
                Stories <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{formData.stories.length}</span>
              </Label>
              <Button onClick={handleAddStory} size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white">
                <Plus className="w-4 h-4 mr-2" /> Add Story
              </Button>
            </div>

            <div className="space-y-6">
              {formData.stories.map((story, idx) => (
                <div
                  key={story.id || idx}
                  className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl relative group hover:border-zinc-700 transition-colors"
                >
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span className="text-xs text-zinc-600 font-mono bg-zinc-950 px-2 py-1 rounded">#{idx + 1}</span>
                    <button
                      onClick={() => handleRemoveStory(idx)}
                      className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-4 space-y-4">
                      <div className="aspect-square relative rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800">
                        {story.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={story.image} alt="Preview" className="w-full h-full object-cover opacity-70" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-zinc-700">No Image</div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                          <Label className="text-xs text-zinc-400 block mb-1">Image URL</Label>
                          <Input
                            value={story.image}
                            onChange={e => updateStory(idx, 'image', e.target.value)}
                            className="bg-black/50 border-zinc-700 h-8 text-xs focus:ring-0"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-8 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs text-zinc-500">Name</Label>
                          <Input
                            value={story.name}
                            onChange={e => updateStory(idx, 'name', e.target.value)}
                            className="bg-zinc-950/50 border-zinc-800 focus:border-indigo-500"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-zinc-500">University</Label>
                          <Input
                            value={story.university}
                            onChange={e => updateStory(idx, 'university', e.target.value)}
                            className="bg-zinc-950/50 border-zinc-800 focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-500">Subject / Major</Label>
                        <Input
                          value={story.subject}
                          onChange={e => updateStory(idx, 'subject', e.target.value)}
                          className="bg-zinc-950/50 border-zinc-800 focus:border-indigo-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-500">Description</Label>
                        <Textarea
                          value={story.description}
                          onChange={e => updateStory(idx, 'description', e.target.value)}
                          className="bg-zinc-950/50 border-zinc-800 focus:border-indigo-500 min-h-[100px] resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur flex justify-end">
          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8">
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MutationSection43;
