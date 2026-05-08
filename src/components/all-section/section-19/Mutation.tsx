/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Save, Link as LinkIcon, Type, LayoutTemplate, Search, MousePointer2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { iconMap, iconOptions } from '@/components/all-icons/all-icons-jsx';

import type { Button1FormProps, IButton1Data } from './data';
import { defaultDataSection19 } from './data';

const MutationSection18 = ({ data, onSubmit }: Button1FormProps) => {
  const [formData, setFormData] = useState<IButton1Data>({ ...defaultDataSection19 });
  const [iconSearch, setIconSearch] = useState('');

  useEffect(() => {
    if (data) {
      setFormData({ ...defaultDataSection19, ...data });
    }
  }, [data]);

  const updateField = (field: keyof IButton1Data, value: IButton1Data[keyof IButton1Data]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const filteredIcons = useMemo(() => {
    if (!iconSearch) return iconOptions;
    return iconOptions.filter(name => name.toLowerCase().includes(iconSearch.toLowerCase()));
  }, [iconSearch]);

  return (
    <div className="min-h-[400px] w-full max-w-3xl mx-auto bg-zinc-950 text-zinc-100 font-sans border border-zinc-800 overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur flex items-center gap-3">
        <div className="p-2 bg-indigo-500/10 rounded-lg">
          <LayoutTemplate className="text-indigo-400" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Edit Button</h2>
          <p className="text-zinc-400 text-sm">Configure your button settings.</p>
        </div>
      </div>

      <div className="p-4 md:p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-zinc-400 flex items-center gap-2">
              <Type size={14} /> Button Text
            </Label>
            <Input
              value={formData.buttonName}
              onChange={e => updateField('buttonName', e.target.value)}
              className="bg-zinc-900 border-zinc-800 focus:border-indigo-500 transition-colors"
              placeholder="e.g. Get Started"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-400 flex items-center gap-2">
              <LinkIcon size={14} /> Button Path
            </Label>
            <Input
              value={formData.buttonPath}
              onChange={e => updateField('buttonPath', e.target.value)}
              className="bg-zinc-900 border-zinc-800 focus:border-indigo-500 transition-colors"
              placeholder="e.g. /about or https://google.com"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl md:col-span-2">
            <div className="space-y-0.5">
              <Label className="text-zinc-300">Open in New Tab</Label>
              <p className="text-xs text-zinc-500">Should the link open in a new window?</p>
            </div>
            <Switch checked={formData.isNewTab} onCheckedChange={checked => updateField('isNewTab', checked)} />
          </div>

          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center justify-between">
              <Label className="text-zinc-400 flex items-center gap-2">
                <MousePointer2 size={14} /> Iconography
              </Label>
              <span className="text-[10px] bg-zinc-900 px-2 py-1 rounded border border-zinc-800 text-zinc-500 font-mono">
                {formData.buttonIcon || 'No Icon'}
              </span>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                value={iconSearch}
                onChange={e => setIconSearch(e.target.value)}
                placeholder="Search icons..."
                className="pl-9 bg-zinc-900 border-zinc-800 focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-3 h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
              {filteredIcons.length > 0 ? (
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                  {filteredIcons.map(iconName => {
                    const IconComp = iconMap[iconName];
                    if (!IconComp) return null;
                    const isActive = formData.buttonIcon === iconName;

                    return (
                      <button
                        key={iconName}
                        onClick={() => updateField('buttonIcon', iconName)}
                        className={cn(
                          'group relative aspect-square flex flex-col items-center justify-center rounded-lg transition-all duration-200 border',
                          isActive
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)] scale-105 z-10'
                            : 'bg-zinc-900/50 border-transparent text-zinc-500 hover:bg-zinc-800 hover:border-zinc-700 hover:text-zinc-200',
                        )}
                        title={iconName}
                      >
                        <IconComp size={18} strokeWidth={1.5} />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500 text-xs gap-2">
                  <Search className="w-6 h-6 opacity-20" />
                  No icons found matching &quot;{iconSearch}&quot;
                </div>
              )}
            </div>
            <div className="flex justify-between text-[10px] text-zinc-500 px-1">
              <span>Selected: {formData.buttonIcon || 'None'}</span>
              <span>Total Available: {filteredIcons.length}</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-800 flex justify-end">
          <Button onClick={() => onSubmit(formData)} variant="outlineGlassy" className="w-full">
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MutationSection18;
