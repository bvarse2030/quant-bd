/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import {
  Bold,
  Type,
  Save,
  List,
  Italic,
  AlignLeft,
  RotateCcw,
  AlignRight,
  ListOrdered,
  AlignCenter,
  AlignJustify,
  Highlighter,
  Underline as UnderlineIcon,
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { defaultDataSection22, DescAlign, DescPadding, DescriptionFormProps, DescSize, IDescriptionData, PADDING_MAP, SIZE_MAP } from './data';

const ToolbarBtn = ({ icon: Icon, onClick, active, title }: { icon: React.ElementType; onClick: () => void; active?: boolean; title: string }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={cn(
      'p-2 rounded-lg transition-all duration-200 flex items-center justify-center',
      active ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200',
    )}
  >
    <Icon size={16} />
  </button>
);

const MutationSection22 = ({ data, onSubmit }: DescriptionFormProps) => {
  const [formData, setFormData] = useState<IDescriptionData>({ ...defaultDataSection22 });
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData({ ...defaultDataSection22, ...data });
      if (editorRef.current && editorRef.current.innerHTML !== data.content) {
        editorRef.current.innerHTML = data.content || '';
      }
    }
  }, [data]);

  const handleContentChange = () => {
    if (editorRef.current) {
      setFormData(prev => ({ ...prev, content: editorRef.current?.innerHTML || '' }));
    }
  };

  const updateField = (field: keyof IDescriptionData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const execCmd = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    handleContentChange();
    editorRef.current?.focus();
  };

  const handleReset = () => {
    setFormData(defaultDataSection22);
    if (editorRef.current) editorRef.current.innerHTML = defaultDataSection22.content;
  };

  return (
    <div className="min-h-[650px] w-full max-w-5xl mx-auto bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-500/30 flex flex-col lg:flex-row rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
      <div className="lg:w-1/2 bg-zinc-950 relative flex flex-col h-[600px] lg:h-auto">
        <ScrollArea className="h-full">
          <div className="p-6 lg:p-8 space-y-8">
            <div className="flex justify-end">
              <button onClick={handleReset} className="text-xs text-zinc-600 hover:text-zinc-300 flex items-center gap-1 transition-colors">
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-wider">
                  <Highlighter size={14} /> Editor
                </Label>
              </div>

              <div
                className={cn(
                  'rounded-xl border-2 bg-zinc-900/30 transition-all duration-300 flex flex-col overflow-hidden',
                  isFocused ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'border-zinc-800 hover:border-zinc-700',
                )}
              >
                <div className="flex items-center gap-1 p-2 border-b border-zinc-800 bg-zinc-900/50">
                  <ToolbarBtn icon={Bold} onClick={() => execCmd('bold')} title="Bold" />
                  <ToolbarBtn icon={Italic} onClick={() => execCmd('italic')} title="Italic" />
                  <ToolbarBtn icon={UnderlineIcon} onClick={() => execCmd('underline')} title="Underline" />
                  <div className="w-px h-4 bg-zinc-700 mx-1" />
                  <ToolbarBtn icon={List} onClick={() => execCmd('insertUnorderedList')} title="Bullet List" />
                  <ToolbarBtn icon={ListOrdered} onClick={() => execCmd('insertOrderedList')} title="Numbered List" />
                </div>

                <div
                  ref={editorRef}
                  contentEditable
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onInput={handleContentChange}
                  className="min-h-[150px] p-4 text-sm text-zinc-200 focus:outline-none overflow-y-auto prose prose-invert prose-sm max-w-none [&>ul]:list-disc [&>ol]:list-decimal [&>ul]:pl-4 [&>ol]:pl-4"
                  spellCheck={false}
                />
              </div>
              <p className="text-[10px] text-zinc-600 text-right">Supports basic formatting commands</p>
            </div>

            <div className="w-full h-px bg-zinc-800/50" />

            <div className="space-y-6">
              <Label className="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-wider">
                <Type size={14} /> Typography
              </Label>

              <div className="space-y-2">
                <span className="text-xs text-zinc-500">Alignment</span>
                <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-zinc-800">
                  {[
                    { val: 'left', icon: AlignLeft },
                    { val: 'center', icon: AlignCenter },
                    { val: 'right', icon: AlignRight },
                    { val: 'justify', icon: AlignJustify },
                  ].map(item => (
                    <button
                      key={item.val}
                      onClick={() => updateField('textAlign', item.val as DescAlign)}
                      className={cn(
                        'flex-1 flex items-center justify-center py-2 rounded-lg transition-all',
                        formData.textAlign === item.val ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300',
                      )}
                    >
                      <item.icon size={16} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-xs text-zinc-500">Size</span>
                  <div className="relative">
                    <Select value={formData.textSize} onValueChange={val => updateField('textSize', val as DescSize)}>
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
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-zinc-500">Padding</span>
                  <div className="relative">
                    <Select value={formData.padding} onValueChange={val => updateField('padding', val as DescPadding)}>
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
                </div>
              </div>

              <div
                onClick={() => updateField('isGlobalUnderline', !formData.isGlobalUnderline)}
                className={cn(
                  'flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all',
                  formData.isGlobalUnderline ? 'bg-blue-500/10 border-blue-500/30' : 'bg-zinc-900/30 border-zinc-800 hover:bg-zinc-900',
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400">
                    <UnderlineIcon size={16} />
                  </div>
                  <div className="text-xs">
                    <p className={cn('font-medium', formData.isGlobalUnderline ? 'text-blue-200' : 'text-zinc-300')}>Global Underline</p>
                    <p className="text-zinc-600">Force underline on entire block</p>
                  </div>
                </div>
                <Switch checked={formData.isGlobalUnderline} onCheckedChange={c => updateField('isGlobalUnderline', c)} />
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-800 flex justify-end">
              <Button onClick={() => onSubmit(formData)} variant="outlineGlassy" className="w-full">
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default MutationSection22;
