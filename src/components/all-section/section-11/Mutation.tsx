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
import { Save, Plus, Trash2, User, Building2, BookOpen, GraduationCap, ChevronDown, ImageIcon, Sparkles, LayoutGrid } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ImageUploadManagerSingle from '@/components/dashboard-ui/ImageUploadManagerSingle';

import { ISection11Data, defaultDataSection11, IStory } from './data';

export interface Section11FormProps {
  data?: ISection11Data;
  onSubmit: (values: ISection11Data) => void;
}

const MutationSection11 = ({ data, onSubmit }: Section11FormProps) => {
  const [formData, setFormData] = useState<ISection11Data>({ ...defaultDataSection11 });
  const [expandedStory, setExpandedStory] = useState<string | null>(defaultDataSection11.stories[0]?.id || null);

  useEffect(() => {
    if (data && typeof data !== 'string') {
      setFormData(data);
    }
  }, [data]);

  const updateStory = (index: number, field: keyof IStory, value: string) => {
    const updatedStories = [...formData.stories];
    updatedStories[index] = { ...updatedStories[index], [field]: value };
    setFormData(prev => ({ ...prev, stories: updatedStories }));
  };

  const addStory = () => {
    const newStory: IStory = {
      id: `story-${Date.now()}`,
      name: 'New Student',
      university: 'University Name',
      subject: 'Program / Course',
      image: '',
      description: 'Add a description about the student success story...',
    };
    setFormData(prev => ({ ...prev, stories: [newStory, ...prev.stories] }));
    setExpandedStory(newStory.id);
  };

  const removeStory = (index: number) => {
    const updatedStories = formData.stories.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, stories: updatedStories }));
  };

  const toggleExpand = (id: string) => {
    setExpandedStory(expandedStory === id ? null : id);
  };

  const handleSave = () => {
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur flex items-center gap-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-violet-600/5 pointer-events-none" />
          <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 z-10">
            <Sparkles className="text-indigo-400" size={24} />
          </div>
          <div className="z-10">
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Success Stories Reel</h2>
            <p className="text-zinc-400 text-sm">Manage the vertical scroll timeline stories.</p>
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6 h-fit lg:sticky lg:top-8">
            <div className="bg-zinc-950/50 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm space-y-6 shadow-inner">
              <div className="text-center space-y-3">
                <div className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center mx-auto text-zinc-500 ring-1 ring-zinc-800 shadow-lg">
                  <User size={28} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-zinc-200">Student Profiles</h3>
                  <p className="text-zinc-500 text-xs mt-1">
                    You have <span className="text-indigo-400 font-bold">{formData.stories.length}</span> stories in the reel.
                  </p>
                </div>
              </div>

              <div className="h-px bg-zinc-800/50 w-full" />

              <div className="space-y-3">
                <Label className="text-zinc-400 text-xs font-medium flex items-center gap-2">
                  <LayoutGrid size={14} className="text-indigo-400" />
                  Display Configuration
                </Label>
                <div className="relative group">
                  <select
                    value={formData.storiesPerPage}
                    onChange={e => setFormData(prev => ({ ...prev, storiesPerPage: parseInt(e.target.value) }))}
                    className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm rounded-xl h-11 pl-3 pr-10 appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer hover:bg-zinc-900/80 hover:border-zinc-700"
                  >
                    <option value={1}>1 Story per view</option>
                    <option value={2}>2 Stories per view</option>
                    <option value={3}>3 Stories per view</option>
                    <option value={4}>4 Stories per view</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-zinc-500 pointer-events-none group-hover:text-zinc-300 transition-colors" />
                </div>
                <p className="text-[10px] text-zinc-500 leading-tight">Determines how many story cards are visible simultaneously on larger screens.</p>
              </div>

              <div className="h-px bg-zinc-800/50 w-full" />

              <Button
                onClick={addStory}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20 border border-indigo-500/20 py-6 rounded-xl font-bold transition-all hover:scale-105 active:scale-95"
              >
                <Plus className="mr-2 h-4 w-4" /> Add New Story
              </Button>
            </div>

            <div className="p-5 bg-indigo-900/10 border border-indigo-500/10 rounded-2xl text-xs text-indigo-300 leading-relaxed backdrop-blur-md">
              <p className="flex gap-2">
                <span className="font-bold bg-indigo-500/20 px-1.5 py-0.5 rounded text-indigo-200 h-fit shrink-0">Tip</span>
                <span>High-quality vertical or square images work best for the reel cards. The sequence here determines the scroll order.</span>
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            {formData.stories.length === 0 && (
              <div className="text-center py-16 bg-zinc-950/30 border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-3">
                <div className="h-12 w-12 rounded-full bg-zinc-900 flex items-center justify-center">
                  <User className="text-zinc-700" size={24} />
                </div>
                <p className="text-zinc-500 text-sm">No stories added yet.</p>
                <Button onClick={addStory} variant="link" className="text-indigo-400 hover:text-indigo-300">
                  Add your first success story
                </Button>
              </div>
            )}

            {formData.stories.map((story, index) => (
              <div
                key={story.id}
                className={`
                    group bg-zinc-950/30 border rounded-2xl overflow-hidden transition-all duration-300
                    ${expandedStory === story.id ? 'border-indigo-500/30 ring-1 ring-indigo-500/10 bg-zinc-900/40 shadow-xl' : 'border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-900/20'}
                  `}
              >
                <div className="p-5 flex items-center justify-between cursor-pointer select-none" onClick={() => toggleExpand(story.id)}>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-zinc-900 flex items-center justify-center border border-zinc-800 overflow-hidden shrink-0 shadow-sm group-hover:border-zinc-700 transition-colors">
                      {story.image ? (
                        <Image width={100} height={100} src={story.image} alt={story.name} className="w-full h-full object-cover" />
                      ) : (
                        <User size={20} className="text-zinc-600" />
                      )}
                    </div>
                    <div>
                      <h3 className={`text-base font-bold transition-colors ${expandedStory === story.id ? 'text-indigo-200' : 'text-zinc-200'}`}>
                        {story.name}
                      </h3>
                      <p className="text-zinc-500 text-xs flex items-center gap-1.5 mt-0.5">
                        <Building2 size={10} /> {story.university || 'No University'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={e => {
                        e.stopPropagation();
                        removeStory(index);
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                    <div
                      className={`p-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 transition-transform duration-300 ${expandedStory === story.id ? 'rotate-180 text-indigo-400 border-indigo-500/30' : ''}`}
                    >
                      <ChevronDown size={14} />
                    </div>
                  </div>
                </div>

                {expandedStory === story.id && (
                  <div className="p-6 pt-0 border-t border-zinc-800/50 animate-in slide-in-from-top-2 fade-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                      <div className="space-y-5">
                        <div className="space-y-2">
                          <Label className="text-zinc-400 text-xs font-medium flex items-center gap-2">
                            <User size={12} /> Student Name
                          </Label>
                          <div className="relative group/input">
                            <Input
                              value={story.name}
                              onChange={e => updateStory(index, 'name', e.target.value)}
                              className="bg-zinc-900 border-zinc-800 focus:border-indigo-500 transition-all pl-3"
                              placeholder="e.g. John Doe"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-zinc-400 text-xs font-medium flex items-center gap-2">
                            <Building2 size={12} /> University
                          </Label>
                          <div className="relative group/input">
                            <Input
                              value={story.university}
                              onChange={e => updateStory(index, 'university', e.target.value)}
                              className="bg-zinc-900 border-zinc-800 focus:border-indigo-500 transition-all pl-3"
                              placeholder="e.g. Harvard University"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-zinc-400 text-xs font-medium flex items-center gap-2">
                            <GraduationCap size={12} /> Course / Subject
                          </Label>
                          <div className="relative group/input">
                            <Input
                              value={story.subject}
                              onChange={e => updateStory(index, 'subject', e.target.value)}
                              className="bg-zinc-900 border-zinc-800 focus:border-indigo-500 transition-all pl-3"
                              placeholder="e.g. MSc Data Science"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-zinc-400 text-xs font-medium flex items-center gap-2">
                          <ImageIcon size={12} /> Profile Image
                        </Label>
                        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 hover:border-zinc-700 transition-colors h-full flex flex-col justify-center">
                          <ImageUploadManagerSingle value={story.image} onChange={url => updateStory(index, 'image', url)} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mt-5">
                      <Label className="text-zinc-400 text-xs font-medium flex items-center gap-2">
                        <BookOpen size={12} /> Success Story Description
                      </Label>
                      <div className="relative group/input">
                        <Textarea
                          value={story.description}
                          onChange={e => updateStory(index, 'description', e.target.value)}
                          className="bg-zinc-900 border-zinc-800 min-h-[100px] focus:border-indigo-500 transition-all resize-none text-sm leading-relaxed"
                          placeholder="Describe their achievements and journey..."
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur flex justify-between items-center">
          <p className="text-xs text-zinc-500 hidden sm:block">
            Last updated: <span className="text-zinc-400">Just now</span>
          </p>
          <Button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20 border border-indigo-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MutationSection11;
