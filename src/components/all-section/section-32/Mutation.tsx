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

import { ISection32Data, defaultDataSection32, IFeatureCard } from './data';

export interface SectionFormProps {
  data?: ISection32Data;
  onSubmit: (values: ISection32Data) => void;
}

const gradientOptions = [
  { label: 'Red - Pink', value: 'from-red-500 to-pink-500' },
  { label: 'Green - Teal', value: 'from-green-500 to-teal-500' },
  { label: 'Blue - Indigo', value: 'from-blue-500 to-indigo-500' },
  { label: 'Purple - Violet', value: 'from-purple-500 to-violet-500' },
  { label: 'Orange - Amber', value: 'from-orange-500 to-amber-500' },
  { label: 'Pink - Rose', value: 'from-pink-500 to-rose-500' },
];

const iconOptions = ['BookOpen', 'Play', 'Award', 'Zap', 'Star', 'Globe', 'Monitor'];

const MutationSection32 = ({ data, onSubmit }: SectionFormProps) => {
  const [formData, setFormData] = useState<ISection32Data>({ ...defaultDataSection32 });

  useEffect(() => {
    if (data) {
      setFormData({
        ...defaultDataSection32,
        ...data,
        cards: data.cards || defaultDataSection32.cards,
      });
    }
  }, [data]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = (field: keyof ISection32Data, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSubmit(formData);
  };

  const handleAddCard = () => {
    const newCard: IFeatureCard = {
      title: 'New Feature',
      description: 'Description of the new feature.',
      iconName: 'Zap',
      gradient: 'from-purple-500 to-violet-500',
    };
    updateField('cards', [...formData.cards, newCard]);
  };

  const handleRemoveCard = (index: number) => {
    const newCards = formData.cards.filter((_, i) => i !== index);
    updateField('cards', newCards);
  };

  const updateCard = (index: number, field: keyof IFeatureCard, value: string) => {
    const newCards = [...formData.cards];
    newCards[index] = { ...newCards[index], [field]: value };
    updateField('cards', newCards);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <LayoutTemplate className="text-indigo-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Edit Section 32</h2>
            <p className="text-zinc-400 text-sm">Manage your feature cards grid.</p>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <Label className="text-zinc-300 text-lg font-semibold">Feature Cards</Label>
            <Button onClick={handleAddCard} size="sm" variant="outline" className="border-zinc-700 hover:bg-zinc-800">
              <Plus className="w-4 h-4 mr-2" /> Add Card
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formData.cards.map((card, idx) => (
              <div key={idx} className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl space-y-4 relative group hover:border-zinc-700 transition-colors">
                <button
                  onClick={() => handleRemoveCard(idx)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500/10 text-red-400 rounded-md hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all z-10"
                >
                  <Trash2 size={14} />
                </button>

                <div className="space-y-2">
                  <Label className="text-xs text-zinc-500">Title</Label>
                  <Input
                    value={card.title}
                    onChange={e => updateCard(idx, 'title', e.target.value)}
                    className="bg-zinc-950/50 border-zinc-800 focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-zinc-500">Description</Label>
                  <Textarea
                    value={card.description}
                    onChange={e => updateCard(idx, 'description', e.target.value)}
                    className="min-h-[80px] bg-zinc-950/50 border-zinc-800 focus:border-indigo-500 resize-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-zinc-500">Icon</Label>
                    <select
                      value={card.iconName}
                      onChange={e => updateCard(idx, 'iconName', e.target.value)}
                      className="w-full h-9 bg-zinc-950/50 border border-zinc-800 rounded-md px-2 text-sm text-zinc-300 focus:outline-none focus:border-indigo-500"
                    >
                      {iconOptions.map(opt => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-zinc-500">Theme</Label>
                    <select
                      value={card.gradient}
                      onChange={e => updateCard(idx, 'gradient', e.target.value)}
                      className="w-full h-9 bg-zinc-950/50 border border-zinc-800 rounded-md px-2 text-sm text-zinc-300 focus:outline-none focus:border-indigo-500"
                    >
                      {gradientOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={`h-2 w-full rounded-full bg-gradient-to-r ${card.gradient} opacity-50`} />
              </div>
            ))}
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

export default MutationSection32;
