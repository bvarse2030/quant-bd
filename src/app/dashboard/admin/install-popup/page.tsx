/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Smartphone, Loader2, Palette, Activity, CheckCircle2, Layout, Type } from 'lucide-react';

import { cn } from '@/lib/utils';

interface ButtonConfig {
  text: string;
  bgColor: string;
  textColor: string;
  size: 'small' | 'medium' | 'large';
  animation: 'none' | 'pulse' | 'bounce' | 'ping';
}

interface ConfigState {
  isEnabled: boolean;
  title: string;
  description: string;
  installBtn: ButtonConfig;
  laterBtn: ButtonConfig;
}

const defaultConfig: ConfigState = {
  isEnabled: true,
  title: '',
  description: '',
  installBtn: { text: '', bgColor: '#4F46E5', textColor: '#ffffff', size: 'medium', animation: 'none' },
  laterBtn: { text: '', bgColor: 'transparent', textColor: '#ffffff', size: 'medium', animation: 'none' },
};

const ToggleSwitch = ({ checked, onChange, disabled }: { checked: boolean; onChange: (val: boolean) => void; disabled?: boolean }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={e => {
      e.stopPropagation();
      if (!disabled) onChange(!checked);
    }}
    className={cn(
      'relative w-12 h-6 flex items-center rounded-sm p-1 cursor-pointer transition-all duration-300 focus:outline-none',
      checked ? 'bg-indigo-600/40 border border-indigo-400/50' : 'bg-white/10 border border-white/20',
      disabled && 'opacity-50 cursor-not-allowed',
    )}
  >
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 700, damping: 30 }}
      className={cn('bg-white w-4 h-4 rounded-sm shadow-xl pointer-events-none', checked ? 'translate-x-5' : 'translate-x-0')}
    />
  </button>
);

const ColorPicker = ({ label, value, onChange }: { label: string; value: string; onChange: (val: string) => void }) => {
  const presets = [
    { name: 'Red', val: '#EF4444' },
    { name: 'Blue', val: '#3B82F6' },
    { name: 'Green', val: '#10B981' },
    { name: 'Indigo', val: '#4F46E5' },
    { name: 'Black', val: '#000000' },
    { name: 'White', val: '#FFFFFF' },
  ];

  return (
    <div className="space-y-4">
      <label className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em] flex items-center gap-2">
        <Palette className="w-3.5 h-3.5" />
        {label}
      </label>

      <div className="space-y-4">
        <div className="relative group">
          <div className="h-14 bg-white/5 rounded-sm border border-white/20 flex items-center px-4 gap-4 cursor-pointer hover:bg-white/10 transition-all">
            <div
              className="w-6 h-6 rounded-sm shadow-inner border border-white/30 group-hover:scale-110 transition-transform"
              style={{ backgroundColor: value === 'transparent' ? 'rgba(255,255,255,0.05)' : value }}
            />
            <span className="text-xs font-mono font-black text-white/60 uppercase">{value}</span>
          </div>
          <input
            type="color"
            value={value === 'transparent' ? '#000000' : value}
            onChange={e => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </div>

        <div className="grid grid-cols-7 gap-2">
          {presets.map(color => (
            <button
              key={color.val}
              onClick={() => onChange(color.val)}
              className={cn(
                'h-10 rounded-sm border transition-all flex items-center justify-center',
                value.toLowerCase() === color.val.toLowerCase() ? 'border-white scale-110 z-10 shadow-lg' : 'border-white/10 hover:border-white/40',
              )}
              style={{ backgroundColor: color.val }}
            />
          ))}
          <button
            onClick={() => onChange('transparent')}
            className={cn(
              'h-10 rounded-sm border transition-all flex items-center justify-center bg-white/5 relative overflow-hidden',
              value === 'transparent' ? 'border-white scale-110 z-10 shadow-lg' : 'border-white/10 hover:border-white/40',
            )}
          >
            <div className="w-full h-px bg-rose-500 rotate-45 transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AdminPWAPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<ConfigState>(defaultConfig);

  useEffect(() => {
    fetch('/api/pwa-pop-up')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) setConfig(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/pwa-pop-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        toast.success('Settings Synced Successfully');
      } else {
        throw new Error('Failed to save');
      }
    } catch {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = <K extends keyof ConfigState>(field: K, value: ConfigState[K]) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const updateBtn = (type: 'installBtn' | 'laterBtn', field: keyof ButtonConfig, value: string) => {
    setConfig(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [field]: value as any,
      },
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-400 animate-spin opacity-50" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 font-sans relative overflow-hidden p-4 md:p-8">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-500/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        <ToastContainer position="bottom-right" theme="dark" hideProgressBar />

        <header className="flex flex-col md:flex-row justify-between items-center gap-6 mt-8">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40">PWA Manager</h1>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em]">Installation & Context Controls</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="h-10 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-sm font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Update Settings
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          <div className="xl:col-span-7 space-y-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="backdrop-blur-xl bg-white/5 border border-white/20 p-8 rounded-sm shadow-2xl space-y-10"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-sm bg-white/10 flex items-center justify-center border border-white/10 shadow-xl">
                  <Smartphone className="w-6 h-6 text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold italic tracking-tight text-white uppercase">Platform Configuration</h2>
              </div>

              <div className="flex items-center justify-between p-6 bg-white/5 rounded-sm border border-white/10 group hover:border-white/40 transition-all">
                <div className="space-y-1">
                  <span className="flex items-center gap-3 text-[10px] font-black text-white uppercase tracking-widest italic">
                    <CheckCircle2 size={14} className={config.isEnabled ? 'text-indigo-400' : 'text-white/20'} />
                    Pop-up Engine
                  </span>
                  <p className="text-[9px] text-white/40 font-bold uppercase tracking-wider">Master Visibility Control</p>
                </div>
                <ToggleSwitch checked={config.isEnabled} onChange={() => updateConfig('isEnabled', !config.isEnabled)} />
              </div>

              <div className="grid gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Layout className="w-3.5 h-3.5" />
                    Header Title
                  </label>
                  <input
                    type="text"
                    value={config.title}
                    onChange={e => updateConfig('title', e.target.value)}
                    placeholder="Install Application"
                    className="h-14 w-full bg-white/5 border border-white/20 rounded-sm px-4 text-lg font-bold placeholder:text-white/5 focus:border-white/40 outline-none transition-all"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Type className="w-3.5 h-3.5" />
                    Manifest Description
                  </label>
                  <textarea
                    rows={4}
                    value={config.description}
                    onChange={e => updateConfig('description', e.target.value)}
                    placeholder="Experience the platform in native mode..."
                    className="w-full p-4 bg-white/5 border border-white/20 rounded-sm focus:border-white/40 outline-none transition-all text-sm font-bold resize-none"
                  />
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(['installBtn', 'laterBtn'] as const).map(key => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={key}
                  className="backdrop-blur-xl bg-white/5 border border-white/20 p-8 rounded-sm shadow-2xl space-y-8"
                >
                  <div className="space-y-1">
                    <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] italic">
                      {key === 'installBtn' ? 'Call to Action' : 'Dismiss Intent'}
                    </h2>
                    <h3 className="text-lg font-black text-white uppercase italic">{key === 'installBtn' ? 'Primary UI' : 'Secondary UI'}</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em]">Label</label>
                      <input
                        type="text"
                        value={config[key]?.text || ''}
                        onChange={e => updateBtn(key, 'text', e.target.value)}
                        className="h-12 w-full bg-white/5 border border-white/20 rounded-sm px-4 text-sm font-black text-white outline-none focus:border-white/40 transition-all"
                      />
                    </div>

                    <ColorPicker label="Backing Value" value={config[key]?.bgColor || ''} onChange={val => updateBtn(key, 'bgColor', val)} />
                    <ColorPicker label="Ink Identity" value={config[key]?.textColor || ''} onChange={val => updateBtn(key, 'textColor', val)} />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em]">Geometry</label>
                        <select
                          value={config[key]?.size || ''}
                          onChange={e => updateBtn(key, 'size', e.target.value)}
                          className="h-12 w-full bg-white/5 border border-white/20 rounded-sm px-4 text-[10px] font-black uppercase text-white outline-none focus:border-white transition-all appearance-none"
                        >
                          <option value="small" className="bg-slate-900">
                            Small
                          </option>
                          <option value="medium" className="bg-slate-900">
                            Medium
                          </option>
                          <option value="large" className="bg-slate-900">
                            Large
                          </option>
                        </select>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em]">Physics</label>
                        <select
                          value={config[key]?.animation || ''}
                          onChange={e => updateBtn(key, 'animation', e.target.value)}
                          className="h-12 w-full bg-white/5 border border-white/20 rounded-sm px-4 text-[10px] font-black uppercase text-white outline-none focus:border-white transition-all appearance-none"
                        >
                          <option value="none" className="bg-slate-900">
                            Stable
                          </option>
                          <option value="pulse" className="bg-slate-900">
                            Pulse
                          </option>
                          <option value="bounce" className="bg-slate-900">
                            Bounce
                          </option>
                          <option value="ping" className="bg-slate-900">
                            Ping
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="xl:col-span-5">
            <div className="sticky top-8 space-y-6">
              <div className="flex items-center justify-between bg-white/5 border border-white/10 px-6 py-4 rounded-sm">
                <h2 className="text-[10px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-3">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  Real-time Simulation
                </h2>
                <span className="text-[9px] font-black text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-sm border border-indigo-500/20 uppercase tracking-widest">
                  Mobile Environment
                </span>
              </div>

              <div className="relative mx-auto border-[12px] border-white/5 rounded-[3rem] bg-slate-950 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden max-w-sm border-t-[16px] border-b-[16px]">
                <div className="h-6 bg-white/5 w-full absolute top-0 left-0 z-20 flex justify-center">
                  <div className="h-4 w-28 bg-black/80 rounded-b-xl border-x border-b border-white/5"></div>
                </div>

                <div className="h-[650px] bg-gradient-to-br from-slate-900 to-black w-full relative flex items-center justify-center p-6">
                  <div className="absolute inset-0 grid grid-cols-3 gap-6 p-10 content-start opacity-10 mt-12">
                    {[...Array(9)]?.map((_, i) => (
                      <div key={i} className="aspect-square rounded-sm bg-white/20 border border-white/10"></div>
                    ))}
                  </div>

                  <AnimatePresence>
                    {config.isEnabled && (
                      <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className="absolute inset-x-4 bottom-8"
                      >
                        <div className="relative overflow-hidden bg-slate-950/95 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-sm p-8 isolate">
                          <div className="absolute top-0 right-0 p-4">
                            <div className="w-6 h-6 rounded-sm bg-white/5 flex items-center justify-center border border-white/10">
                              <span className="text-[10px] text-white/40 font-black">×</span>
                            </div>
                          </div>

                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-indigo-500/20 to-transparent -z-10" />
                          <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -z-10" />

                          <div className="flex flex-col items-center text-center">
                            <div className="mb-6 relative w-16 h-16 rounded-sm bg-slate-950 flex items-center justify-center border border-white/20 shadow-2xl group transition-all">
                              <Smartphone className="w-8 h-8 text-white transition-transform" />
                              <div className="absolute inset-0 bg-indigo-500/10 animate-pulse rounded-sm" />
                            </div>

                            <h3 className="text-2xl font-black text-white mb-3 leading-tight italic tracking-tighter uppercase">
                              {config.title || 'Pop-up Heading'}
                            </h3>
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-8">
                              {config.description || 'Global configuration preview active'}
                            </p>

                            <div className="w-full space-y-3">
                              <button
                                style={{
                                  backgroundColor: config.installBtn.bgColor,
                                  color: config.installBtn.textColor,
                                }}
                                className={cn(
                                  'w-full rounded-sm font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95 flex items-center justify-center border-none',
                                  config.installBtn.size === 'small'
                                    ? 'h-10 text-[9px]'
                                    : config.installBtn.size === 'large'
                                      ? 'h-14 text-xs'
                                      : 'h-12 text-[10px]',
                                  config.installBtn.animation === 'pulse' && 'animate-pulse',
                                  config.installBtn.animation === 'bounce' && 'animate-bounce',
                                  config.installBtn.animation === 'ping' && 'animate-ping',
                                )}
                              >
                                {config.installBtn.text || 'Accept'}
                              </button>

                              <button
                                style={{
                                  backgroundColor: config.laterBtn.bgColor,
                                  color: config.laterBtn.textColor,
                                }}
                                className={cn(
                                  'w-full rounded-sm font-black uppercase tracking-widest transition-all flex items-center justify-center border border-white/10',
                                  config.laterBtn.size === 'small' ? 'h-10 text-[9px]' : config.laterBtn.size === 'large' ? 'h-14 text-xs' : 'h-12 text-[10px]',
                                )}
                              >
                                {config.laterBtn.text || 'Later'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-white/20">System-wide UI Instance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
