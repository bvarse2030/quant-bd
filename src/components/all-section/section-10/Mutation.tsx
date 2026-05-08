/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { useState, useEffect } from 'react';
import { Save, Type, AlignLeft, MessageSquare, LayoutTemplate, Sparkles, Quote, Globe } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { ISection10Data, defaultDataSection10 } from './data';

export interface Section10FormProps {
  data?: ISection10Data;
  onSubmit: (values: ISection10Data) => void;
}

const MutationSection10 = ({ data, onSubmit }: Section10FormProps) => {
  const [formData, setFormData] = useState<ISection10Data>({ ...defaultDataSection10 });

  useEffect(() => {
    if (data && typeof data !== 'string') {
      setFormData(data);
    }
  }, [data]);

  const handleChange = (field: keyof ISection10Data, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
            <Quote className="text-indigo-400" size={24} />
          </div>
          <div className="z-10">
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Success Stories</h2>
            <p className="text-zinc-400 text-sm">Manage the section introduction content.</p>
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <LayoutTemplate size={16} /> Content Settings
              </h3>

              <div className="bg-zinc-950/50 p-5 rounded-xl border border-zinc-800/50 space-y-5 shadow-inner">
                <div className="space-y-2 group">
                  <Label className="text-zinc-400 text-xs font-medium flex items-center gap-2 group-focus-within:text-indigo-400 transition-colors">
                    <Type size={14} /> Primary Heading
                  </Label>
                  <div className="relative group/input">
                    <Input
                      value={formData.title}
                      onChange={e => handleChange('title', e.target.value)}
                      className="bg-zinc-900 border-zinc-800 pl-4 focus:border-indigo-500 transition-all duration-300 focus:ring-1 focus:ring-indigo-500/20"
                      placeholder="e.g. Success"
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <Label className="text-zinc-400 text-xs font-medium flex items-center gap-2 group-focus-within:text-indigo-400 transition-colors">
                    <AlignLeft size={14} /> Sub Heading
                  </Label>
                  <div className="relative group/input">
                    <Input
                      value={formData.subTitle}
                      onChange={e => handleChange('subTitle', e.target.value)}
                      className="bg-zinc-900 border-zinc-800 pl-4 focus:border-indigo-500 transition-all duration-300 focus:ring-1 focus:ring-indigo-500/20"
                      placeholder="e.g. Stories"
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <Label className="text-zinc-400 text-xs font-medium flex items-center gap-2 group-focus-within:text-indigo-400 transition-colors">
                    <MessageSquare size={14} /> Description
                  </Label>
                  <div className="relative group/input">
                    <Textarea
                      value={formData.description}
                      onChange={e => handleChange('description', e.target.value)}
                      className="bg-zinc-900 border-zinc-800 min-h-[140px] p-4 focus:border-indigo-500 transition-all duration-300 focus:ring-1 focus:ring-indigo-500/20 rounded-md resize-none placeholder:text-zinc-600 text-sm leading-relaxed"
                      placeholder="Add a brief description..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={16} /> Live Preview
            </h3>

            <div className="bg-zinc-950/30 border border-zinc-800 rounded-2xl p-2 h-full min-h-[500px] flex flex-col relative overflow-hidden group/preview">
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/30 bg-zinc-900/20 rounded-t-xl">
                <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                  <Globe size={12} />
                  <span>Preview Mode</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-zinc-800" />
                  <div className="w-2 h-2 rounded-full bg-zinc-800" />
                  <div className="w-2 h-2 rounded-full bg-zinc-800" />
                </div>
              </div>

              <div className="flex-1 rounded-b-xl relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.1),rgba(0,0,0,0))]" />
                <div
                  className="absolute inset-0 opacity-[0.05]"
                  style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
                />

                <div className="relative z-10 max-w-lg mx-auto text-center px-8">
                  <div className="space-y-2 mb-8">
                    <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter drop-shadow-lg">{formData.title || 'Title'}</h2>
                    <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-600 tracking-tighter drop-shadow-md">
                      {formData.subTitle || 'Subtitle'}
                    </h2>
                  </div>

                  <div className="h-1 w-24 bg-gradient-to-r from-transparent via-zinc-700 to-transparent mx-auto rounded-full mb-8" />

                  <p className="text-lg text-zinc-400 leading-relaxed font-light">{formData.description || 'Description text goes here...'}</p>
                </div>
              </div>
            </div>
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

export default MutationSection10;
