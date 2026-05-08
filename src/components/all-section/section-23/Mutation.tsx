/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import {
  Save,
  Type,
  Pilcrow,
  Droplets,
  AlignLeft,
  RotateCcw,
  AlignRight,
  AlignCenter,
  AlignJustify,
  MoveVertical,
  Underline as UnderlineIcon,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import type { IParagraphData, ParagraphFormProps } from './data';
import { defaultDataSection23, PADDING_MAP, SIZE_MAP, WEIGHT_MAP } from './data';

const MutationSection23 = ({ data, onSubmit }: ParagraphFormProps) => {
  const [formData, setFormData] = useState<IParagraphData>({ ...defaultDataSection23 });

  useEffect(() => {
    if (data) {
      setFormData({ ...defaultDataSection23, ...data });
    }
  }, [data]);

  const updateField = (field: keyof IParagraphData, value: IParagraphData[keyof IParagraphData]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFormData(defaultDataSection23);
  };

  return (
    <div className="min-h-[600px] w-full max-w-5xl mx-auto bg-zinc-950 text-zinc-100 font-sans rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl flex flex-col lg:flex-row">
      <div className="lg:w-1/2 bg-zinc-950 p-6 lg:p-8 flex flex-col h-full overflow-y-auto">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">Edit Paragraph</h2>
              <p className="text-zinc-400 text-sm">Customize typography and layout.</p>
            </div>
            <button onClick={handleReset} className="text-xs text-zinc-600 hover:text-zinc-300 flex items-center gap-1 transition-colors">
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          <div className="space-y-4">
            <Label className="text-zinc-400 flex items-center gap-2">
              <Pilcrow size={14} /> Content
            </Label>
            <Textarea
              value={formData.text}
              onChange={e => updateField('text', e.target.value)}
              className="min-h-[120px] bg-zinc-900 border-zinc-800 focus:border-emerald-500 resize-none"
              placeholder="Enter your paragraph text here..."
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-zinc-400 text-xs uppercase tracking-wider font-bold flex items-center gap-2">
                <Type size={14} /> Typography
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-xs text-zinc-500">Size</span>
                  <Select value={formData.textSize} onValueChange={val => updateField('textSize', val)}>
                    <SelectTrigger className="bg-zinc-900 border-zinc-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(SIZE_MAP).map(s => (
                        <SelectItem key={s} value={s}>
                          {s.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <span className="text-xs text-zinc-500">Weight</span>
                  <Select value={formData.textWeight} onValueChange={val => updateField('textWeight', val)}>
                    <SelectTrigger className="bg-zinc-900 border-zinc-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(WEIGHT_MAP).map(w => (
                        <SelectItem key={w} value={w}>
                          {w.charAt(0).toUpperCase() + w.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-400 text-xs uppercase tracking-wider font-bold flex items-center gap-2">
                <MoveVertical size={14} /> Layout & Style
              </Label>

              <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-zinc-800 mb-4">
                {[
                  { val: 'left', icon: AlignLeft },
                  { val: 'center', icon: AlignCenter },
                  { val: 'right', icon: AlignRight },
                  { val: 'justify', icon: AlignJustify },
                ].map(item => (
                  <button
                    key={item.val}
                    onClick={() => updateField('textAlign', item.val)}
                    className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-all ${
                      formData.textAlign === item.val ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <item.icon size={16} />
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-xs text-zinc-500">Padding</span>
                  <Select value={formData.padding} onValueChange={val => updateField('padding', val)}>
                    <SelectTrigger className="bg-zinc-900 border-zinc-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(PADDING_MAP).map(p => (
                        <SelectItem key={p} value={p}>
                          {p.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-3 bg-zinc-900/30 border border-zinc-800 rounded-lg">
                  <span className="text-sm text-zinc-300 flex items-center gap-2">
                    <UnderlineIcon size={14} /> Underline
                  </span>
                  <Switch checked={formData.isUnderline} onCheckedChange={c => updateField('isUnderline', c)} />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="text-zinc-400 text-xs uppercase tracking-wider font-bold flex items-center gap-2">
                  <Droplets size={14} /> Opacity
                </Label>
                <span className="text-xs text-emerald-400 font-mono">{formData.opacity}%</span>
              </div>
              <Slider value={[formData.opacity]} onValueChange={([val]) => updateField('opacity', val)} max={100} step={5} className="py-2" />
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
    </div>
  );
};

export default MutationSection23;
