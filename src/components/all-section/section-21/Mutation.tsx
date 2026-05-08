/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import {
  Type,
  Save,
  Unlink,
  RotateCcw,
  Maximize2,
  AlignLeft,
  LucideIcon,
  AlignRight,
  AlignCenter,
  AlignJustify,
  ExternalLink,
  Link as LinkIcon,
  Underline as UnderlineIcon,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { defaultDataSection21, ITitleData, PADDINGS, SIZES, TitleAlign, TitleFormProps, TitlePadding } from './data';

const AnimatedInput = ({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon?: LucideIcon;
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative group">
      <Label
        className={cn(
          'absolute left-0 transition-all duration-200 font-medium',
          focused || value ? '-top-6 text-xs text-blue-400' : '-top-6 text-xs text-zinc-500',
        )}
      >
        {label}
      </Label>
      <div
        className={cn(
          'flex items-center bg-zinc-900/50 border rounded-xl overflow-hidden transition-all duration-300',
          focused ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-zinc-800 hover:border-zinc-700',
        )}
      >
        {Icon && (
          <div className="pl-3 text-zinc-500">
            <Icon size={16} />
          </div>
        )}
        <Input
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full bg-transparent p-3 text-sm text-zinc-100 focus:outline-none placeholder:text-zinc-600 border-none focus-visible:ring-0"
        />
      </div>
    </div>
  );
};

const MutationSection21 = ({ data, onSubmit }: TitleFormProps) => {
  const [formData, setFormData] = useState<ITitleData>({ ...defaultDataSection21 });

  useEffect(() => {
    if (data) setFormData({ ...defaultDataSection21, ...data });
  }, [data]);

  const updateField = (field: keyof ITitleData, value: ITitleData[keyof ITitleData]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFormData(defaultDataSection21);
  };

  return (
    <div className="min-h-[600px] w-full max-w-2xl md:max-w-5xl mx-auto bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-500/30 flex flex-col lg:flex-row border border-zinc-800 md:overflow-hidden shadow-2xl">
      <div className="flex-1 bg-zinc-950 relative h-auto lg:h-auto">
        <div className="p-6 lg:p-8 space-y-10">
          <div className="flex justify-end">
            <button onClick={handleReset} className="text-xs text-zinc-600 hover:text-zinc-300 flex items-center gap-1 transition-colors">
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          <section className="space-y-6">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Type size={14} /> Content
            </h3>
            <div className="bg-zinc-900/30 p-1 rounded-2xl border border-zinc-800">
              <Textarea
                value={formData.text}
                onChange={e => updateField('text', e.target.value)}
                placeholder="Enter your headline text..."
                rows={3}
                className="w-full bg-transparent p-4 text-lg font-medium text-white placeholder:text-zinc-600 focus:outline-none resize-none rounded-xl border-none focus-visible:ring-0"
              />
            </div>
          </section>

          <div className="w-full h-px bg-zinc-800/50" />

          <section className="space-y-6 max-w-2xl md:max-w-5xl">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Maximize2 size={14} /> Typography
            </h3>

            <div className="space-y-3">
              <Label className="text-xs text-zinc-500">Alignment</Label>
              <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-zinc-800">
                {[
                  { val: 'left', icon: AlignLeft },
                  { val: 'center', icon: AlignCenter },
                  { val: 'right', icon: AlignRight },
                  { val: 'justify', icon: AlignJustify },
                ].map(align => (
                  <button
                    key={align.val}
                    onClick={() => updateField('textAlign', align.val as TitleAlign)}
                    className={cn(
                      'flex-1 flex items-center justify-center py-2 rounded-lg transition-all duration-200',
                      formData.textAlign === align.val ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50',
                    )}
                  >
                    <align.icon size={18} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="text-xs text-zinc-500">Font Size</Label>
                <span className="text-xs font-mono text-blue-400">{formData.textSize}</span>
              </div>
              <div className="relative group">
                <div className="flex gap-2 flex-wrap pb-4 scrollbar-hide mask-linear-fade">
                  {SIZES.map(size => (
                    <button
                      key={size}
                      onClick={() => updateField('textSize', size)}
                      className={cn(
                        'px-4 py-2 rounded-lg text-xs font-medium border transition-all whitespace-nowrap',
                        formData.textSize === size
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300',
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-zinc-950 to-transparent pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label className="text-xs text-zinc-500">Spacing (Padding)</Label>
                <Select value={formData.padding} onValueChange={val => updateField('padding', val as TitlePadding)}>
                  <SelectTrigger className="bg-zinc-900/50 border-zinc-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(PADDINGS).map(p => (
                      <SelectItem key={p} value={p}>
                        {p.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-xs text-zinc-500">Decoration</Label>
                <button
                  onClick={() => updateField('isUnderline', !formData.isUnderline)}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all',
                    formData.isUnderline ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:bg-zinc-900',
                  )}
                >
                  <UnderlineIcon size={16} />
                  <span className="text-sm font-medium">Underline</span>
                </button>
              </div>
            </div>
          </section>

          <div className="w-full h-px bg-zinc-800/50" />

          <section>
            <div
              onClick={() => updateField('isLink', !formData.isLink)}
              className={cn(
                'flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-300',
                formData.isLink ? 'bg-blue-950/30 border-blue-500/30' : 'bg-zinc-900/30 border-zinc-800 hover:border-zinc-700',
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn('p-2 rounded-lg transition-colors', formData.isLink ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-500')}>
                  {formData.isLink ? <LinkIcon size={18} /> : <Unlink size={18} />}
                </div>
                <div>
                  <div className={cn('font-medium text-sm', formData.isLink ? 'text-blue-100' : 'text-zinc-300')}>Make Clickable</div>
                  <div className="text-xs text-zinc-500">Turn this title into a link</div>
                </div>
              </div>
              <Switch checked={formData.isLink} onCheckedChange={c => updateField('isLink', c)} />
            </div>

            <AnimatePresence>
              {formData.isLink && (
                <motion.div
                  initial={{ height: 0, opacity: 0, marginTop: 0 }}
                  animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                  exit={{ height: 0, opacity: 0, marginTop: 0 }}
                  className="overflow-hidden pl-2"
                >
                  <div className="border-l-2 border-blue-500/20 pl-4 space-y-4 pb-2">
                    <AnimatedInput
                      label="Destination URL"
                      value={formData.url}
                      onChange={e => updateField('url', e)}
                      placeholder="https://example.com"
                      icon={LinkIcon}
                    />

                    <label className="flex items-center gap-3 group cursor-pointer">
                      <Switch checked={formData.isNewTab} onCheckedChange={c => updateField('isNewTab', c)} />
                      <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">Open in new tab</span>
                      <ExternalLink size={12} className="text-zinc-600" />
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <div className="pt-6 border-t border-zinc-800 flex justify-end">
            <Button onClick={() => onSubmit(formData)} variant="outlineGlassy" className="w-full">
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default MutationSection21;
