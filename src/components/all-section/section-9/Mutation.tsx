/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { useState, useEffect } from 'react';
import { Save, Megaphone, Type, MousePointerClick, Sparkles, LayoutTemplate, Link as LinkIcon, AlignLeft, Globe } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import { ISection9Data, defaultDataSection9 } from './data';

export interface Section9FormProps {
  data?: ISection9Data;
  onSubmit: (values: ISection9Data) => void;
}

const MutationSection9 = ({ data, onSubmit }: Section9FormProps) => {
  const [formData, setFormData] = useState<ISection9Data>({ ...defaultDataSection9 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (data && typeof data !== 'string') {
      setFormData(data);
    }
  }, [data]);

  const handleChange = (field: keyof ISection9Data, value: string) => {
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
            <Megaphone className="text-indigo-400" size={24} />
          </div>
          <div className="z-10">
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Call to Action</h2>
            <p className="text-zinc-400 text-sm">Manage final section content and triggers.</p>
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <LayoutTemplate size={16} /> Content Configuration
              </h3>

              <div className="bg-zinc-950/50 p-5 rounded-xl border border-zinc-800/50 space-y-5 shadow-inner">
                <div className="space-y-2 group">
                  <Label className="text-zinc-400 text-xs font-medium flex items-center gap-2 group-focus-within:text-indigo-400 transition-colors">
                    <Type size={14} /> Heading Title
                  </Label>
                  <div className="relative group/input">
                    <Input
                      value={formData.title}
                      onChange={e => handleChange('title', e.target.value)}
                      className="bg-zinc-900 border-zinc-800 pl-4 focus:border-indigo-500 transition-all duration-300 focus:ring-1 focus:ring-indigo-500/20"
                      placeholder="e.g. Be The Next Story"
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <Label className="text-zinc-400 text-xs font-medium flex items-center gap-2 group-focus-within:text-indigo-400 transition-colors">
                    <AlignLeft size={14} /> Subtitle Description
                  </Label>
                  <div className="relative group/input">
                    <Textarea
                      value={formData.subTitle}
                      onChange={e => handleChange('subTitle', e.target.value)}
                      className="min-h-[100px] w-full bg-zinc-900 border-zinc-800 p-4 focus:border-indigo-500 transition-all duration-300 focus:ring-1 focus:ring-indigo-500/20 rounded-md resize-none placeholder:text-zinc-600 text-sm"
                      placeholder="Enter a compelling description..."
                    />
                  </div>
                </div>

                <div className="h-px bg-zinc-800/50" />

                <div className="space-y-2 group">
                  <Label className="text-zinc-400 text-xs font-medium flex items-center gap-2 group-focus-within:text-indigo-400 transition-colors">
                    <MousePointerClick size={14} /> Button Label
                  </Label>
                  <div className="relative group/input">
                    <Input
                      value={formData.buttonText}
                      onChange={e => handleChange('buttonText', e.target.value)}
                      className="bg-zinc-900 border-zinc-800 pl-4 focus:border-indigo-500 transition-all duration-300 focus:ring-1 focus:ring-indigo-500/20"
                      placeholder="e.g. Apply Now"
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <Label className="text-zinc-400 text-xs font-medium flex items-center gap-2 group-focus-within:text-indigo-400 transition-colors">
                    <LinkIcon size={14} /> Button URL
                  </Label>
                  <div className="relative group/input">
                    <Input
                      value={formData.buttonUrl}
                      onChange={e => handleChange('buttonUrl', e.target.value)}
                      className="bg-zinc-900 border-zinc-800 pl-4 focus:border-indigo-500 transition-all duration-300 focus:ring-1 focus:ring-indigo-500/20 font-mono text-xs text-indigo-300/90"
                      placeholder="https://"
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
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(79,70,229,0.15),rgba(0,0,0,0))]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.8))]" />

                <div
                  className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                    backgroundSize: '32px 32px',
                  }}
                />

                <div className="relative z-10 text-center space-y-8 max-w-xl mx-auto px-6">
                  <div className="space-y-6">
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-2xl">
                      {formData.title || 'Your Title Here'}
                    </h2>
                    <p className="text-base md:text-lg text-zinc-400 font-light leading-relaxed">
                      {formData.subTitle || 'Your engaging subtitle description goes here.'}
                    </p>
                  </div>

                  <div className="flex justify-center flex-col items-center gap-4">
                    <button
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      className="relative group px-8 py-4 bg-white text-black font-bold text-lg rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(99,102,241,0.5)]"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {formData.buttonText || 'Button Text'}
                        <Megaphone
                          size={18}
                          className={`transition-transform duration-300 ease-out ${isHovered ? 'rotate-[-15deg] scale-110 translate-x-1' : ''}`}
                        />
                      </span>
                      <div
                        className={`absolute inset-0 bg-gradient-to-r from-indigo-300 via-violet-200 to-indigo-300 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                      />
                    </button>

                    {formData.buttonUrl && (
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-600 font-mono bg-zinc-900/50 px-3 py-1 rounded-full border border-zinc-800/50">
                        <LinkIcon size={10} />
                        <span className="truncate max-w-[200px]">{formData.buttonUrl}</span>
                      </div>
                    )}
                  </div>
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

export default MutationSection9;
