/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Clock, Monitor, Smartphone, Tablet, Grid, Link as LinkIcon, Save, Settings2, RotateCcw } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import ImageUploadManagerSingle from '@/components/dashboard-ui/ImageUploadManagerSingle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { defaultDataSection27, ILogoData, ILogoItem, LogoFormProps } from './data';

const ScrollArea = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn('relative w-full h-full overflow-hidden', className)}>
      <div className="h-full w-full overflow-y-auto scrollbar-hide scroll-smooth pb-10">{children}</div>
      <div className="pointer-events-none absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-zinc-950 to-transparent z-10" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-zinc-950 to-transparent z-10" />
    </div>
  );
};

const ModernInput = ({ icon: Icon, label, ...props }: { icon?: React.ElementType; label?: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="space-y-1.5">
    {label && <Label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">{label}</Label>}
    <div className="relative group">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />}
      <Input {...props} className={cn('w-full bg-zinc-900/50 border-zinc-800 focus:border-blue-500', Icon ? 'pl-9 pr-3' : 'px-3')} />
    </div>
  </div>
);

const DeviceControl = ({
  icon: Icon,
  label,
  value,
  onChange,
  min,
  max,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
}) => (
  <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-3 flex flex-col items-center gap-3 hover:border-zinc-700 transition-colors">
    <div className="flex items-center gap-2 text-zinc-500">
      <Icon size={14} />
      <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
    </div>
    <div className="flex items-center gap-3 w-full">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-6 h-6 flex items-center justify-center rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400"
      >
        -
      </button>
      <div className="flex-1 text-center font-mono text-lg font-bold text-white">{value}</div>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-6 h-6 flex items-center justify-center rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400"
      >
        +
      </button>
    </div>
    <span className="text-[9px] text-zinc-600">Columns</span>
  </div>
);

const MutationSection27 = ({ data, onSubmit }: LogoFormProps) => {
  const [formData, setFormData] = useState<ILogoData>({ ...defaultDataSection27 });
  const [activeLogoIndex, setActiveLogoIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'assets' | 'settings'>('assets');

  useEffect(() => {
    if (data) setFormData({ ...defaultDataSection27, ...data });
  }, [data]);

  const updateField = (field: keyof ILogoData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateResponsive = (device: 'mobile' | 'tablet' | 'desktop', value: number) => {
    setFormData(prev => ({
      ...prev,
      responsive: { ...prev.responsive, [device]: value },
    }));
  };

  const addLogo = () => {
    const newLogo: ILogoItem = {
      id: Math.random().toString(36).substr(2, 9),
      image: '',
      alt: 'Partner',
      link: '',
    };
    setFormData(prev => ({ ...prev, logos: [...prev.logos, newLogo] }));
    setActiveLogoIndex(formData.logos.length);
  };

  const removeLogo = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newLogos = formData.logos.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, logos: newLogos }));
    if (activeLogoIndex >= newLogos.length) setActiveLogoIndex(Math.max(0, newLogos.length - 1));
  };

  const updateLogo = (index: number, field: keyof ILogoItem, value: string) => {
    const newLogos = [...formData.logos];
    newLogos[index] = { ...newLogos[index], [field]: value };
    setFormData(prev => ({ ...prev, logos: newLogos }));
  };

  const activeLogo = formData.logos[activeLogoIndex];

  const handleReset = () => {
    setFormData(defaultDataSection27);
  };

  return (
    <div className="min-h-[600px] w-full max-w-5xl mx-auto bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-500/30 flex flex-col lg:flex-row rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
      <div className="lg:w-1/2 bg-zinc-950 relative flex flex-col h-[600px] lg:h-auto">
        <div className="flex border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('assets')}
            className={cn(
              'flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors',
              activeTab === 'assets' ? 'text-blue-400 border-b-2 border-blue-500 bg-zinc-900/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900',
            )}
          >
            <Grid size={14} /> Logos
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={cn(
              'flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors',
              activeTab === 'settings' ? 'text-blue-400 border-b-2 border-blue-500 bg-zinc-900/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900',
            )}
          >
            <Settings2 size={14} /> Settings
          </button>
        </div>

        <ScrollArea className="h-full">
          <div className="p-6 lg:p-8 space-y-8">
            <div className="flex justify-end">
              <button onClick={handleReset} className="text-xs text-zinc-600 hover:text-zinc-300 flex items-center gap-1 transition-colors">
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            {activeTab === 'assets' ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500">Manage Client Logos</span>
                  <Button onClick={addLogo} size="sm" className="h-7 text-xs bg-blue-600 hover:bg-blue-500 text-white">
                    <Plus size={12} className="mr-1" /> Add Logo
                  </Button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {formData.logos.map((logo, idx) => (
                    <button
                      key={logo.id}
                      onClick={() => setActiveLogoIndex(idx)}
                      className={cn(
                        'aspect-square rounded-lg border relative group overflow-hidden transition-all',
                        activeLogoIndex === idx
                          ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/50'
                          : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700',
                      )}
                    >
                      {logo.image ? (
                        <Image src={logo.image} alt="Logo" width={100} height={100} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600">
                          <span className="text-[9px] font-bold">{idx + 1}</span>
                        </div>
                      )}
                      <div
                        onClick={e => removeLogo(idx, e)}
                        className="absolute top-0.5 right-0.5 bg-black/60 text-white p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all"
                      >
                        <Trash2 size={10} />
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={addLogo}
                    className="aspect-square rounded-lg border border-dashed border-zinc-800 flex items-center justify-center text-zinc-600 hover:text-zinc-400 hover:bg-zinc-900 hover:border-zinc-700 transition-all"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="w-full h-px bg-zinc-800/50" />

                {activeLogo ? (
                  <motion.div
                    key={activeLogo.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5 bg-zinc-900/30 p-4 rounded-xl border border-zinc-800"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">{activeLogoIndex + 1}</div>
                      <span className="text-xs font-bold uppercase text-zinc-400">Editing Selection</span>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Logo File</Label>
                      <ImageUploadManagerSingle value={activeLogo.image} onChange={(url: string) => updateLogo(activeLogoIndex, 'image', url)} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ModernInput
                        label="Alt Text"
                        value={activeLogo.alt}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateLogo(activeLogoIndex, 'alt', e.target.value)}
                        placeholder="Company Name"
                      />
                      <ModernInput
                        label="External Link"
                        icon={LinkIcon}
                        value={activeLogo.link}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateLogo(activeLogoIndex, 'link', e.target.value)}
                        placeholder="https://"
                      />
                    </div>
                  </motion.div>
                ) : (
                  <div className="py-10 text-center text-zinc-500 text-sm">Select a logo above to edit details.</div>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                <section className="space-y-4">
                  <Label className="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-wider">
                    <Monitor size={14} /> Responsive Columns
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    <DeviceControl
                      icon={Smartphone}
                      label="Mobile"
                      value={formData.responsive.mobile}
                      min={1}
                      max={3}
                      onChange={(v: number) => updateResponsive('mobile', v)}
                    />
                    <DeviceControl
                      icon={Tablet}
                      label="Tablet"
                      value={formData.responsive.tablet}
                      min={2}
                      max={5}
                      onChange={(v: number) => updateResponsive('tablet', v)}
                    />
                    <DeviceControl
                      icon={Monitor}
                      label="Desktop"
                      value={formData.responsive.desktop}
                      min={3}
                      max={8}
                      onChange={(v: number) => updateResponsive('desktop', v)}
                    />
                  </div>
                </section>

                <div className="w-full h-px bg-zinc-800/50" />

                <section className="space-y-4">
                  <Label className="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-wider">
                    <Clock size={14} /> Behavior & Styles
                  </Label>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-zinc-900/30 border border-zinc-800 rounded-xl">
                      <div>
                        <p className="text-xs text-zinc-200 font-medium">Autoplay Speed</p>
                        <p className="text-[10px] text-zinc-500">Delay between slides</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-700 rounded px-2 py-1">
                          <Input
                            type="number"
                            value={formData.autoplaySpeed}
                            onChange={e => updateField('autoplaySpeed', parseInt(e.target.value))}
                            className="w-12 bg-transparent text-right text-xs focus:outline-none h-6 border-none p-0"
                          />
                          <span className="text-zinc-600 text-[10px]">ms</span>
                        </div>
                        <Switch checked={formData.isAutoplay} onCheckedChange={c => updateField('isAutoplay', c)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className={cn(
                          'flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all',
                          formData.grayscale ? 'bg-zinc-900 border-zinc-600' : 'bg-zinc-900/30 border-zinc-800',
                        )}
                      >
                        <span className="text-xs text-zinc-300">Grayscale</span>
                        <Switch checked={formData.grayscale} onCheckedChange={c => updateField('grayscale', c)} />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-zinc-900/30 border border-zinc-800 rounded-xl cursor-pointer">
                        <span className="text-xs text-zinc-300">Pause Hover</span>
                        <Switch checked={formData.pauseOnHover} onCheckedChange={c => updateField('pauseOnHover', c)} />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-2">
                  <span className="text-xs text-zinc-500">Navigation Controls</span>
                  <Select value={formData.navPosition} onValueChange={val => updateField('navPosition', val)}>
                    <SelectTrigger className="bg-zinc-900 border-zinc-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hidden">Hidden (Auto scroll only)</SelectItem>
                      <SelectItem value="middle-outside">Middle Arrows</SelectItem>
                      <SelectItem value="bottom-outside">Bottom Arrows</SelectItem>
                    </SelectContent>
                  </Select>
                </section>
              </div>
            )}

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

export default MutationSection27;
