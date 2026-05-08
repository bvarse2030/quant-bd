/*
|-----------------------------------------
| setting up FormField for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { usePathname } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle, Clock, Save, Eraser } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import type { IForm2Data } from './data';
import { defaultDataForm2 } from './data';

export interface Form2Props {
  data?: IForm2Data;
  onSubmit?: (values: IForm2Data) => void;
}

const COOLDOWN_KEY = 'form_submission_cooldown_v2';
const COOLDOWN_DURATION = 10 * 1 * 1000;

const emptyFormData: IForm2Data = {
  fatherName: '',
  motherName: '',
  sponsorName: '',
  sponsorRelation: '',
  annualFamilyIncome: '',
  emergencyContact: '',
  formUid: 'form-family-uid-2',
  formTitle: 'Family & Sponsorship Information',
  submitButtonText: 'Save & Next',
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FormFieldForm2 = ({ data, onSubmit }: Form2Props) => {
  const [formData, setFormData] = useState<IForm2Data>(emptyFormData);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const pathname = usePathname();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const storedCooldown = localStorage.getItem(COOLDOWN_KEY);
    if (storedCooldown) {
      const expiryTime = parseInt(storedCooldown, 10);
      const now = Date.now();

      if (expiryTime > now) {
        setCooldownRemaining(expiryTime - now);
        startTimer(expiryTime);
      } else {
        localStorage.removeItem(COOLDOWN_KEY);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTimer = (expiryTime: number) => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const remaining = expiryTime - now;

      if (remaining <= 0) {
        setCooldownRemaining(0);
        localStorage.removeItem(COOLDOWN_KEY);
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        setCooldownRemaining(remaining);
      }
    }, 1000);
  };

  const updateField = (field: keyof IForm2Data, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (status === 'error') setStatus('idle');
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleClear = () => {
    setFormData(emptyFormData);
    setStatus('idle');
  };

  const handleSubmit = async () => {
    if (cooldownRemaining > 0) return;

    setStatus('loading');
    setErrorMessage('');

    const payload = { ...formData, currentPath: pathname };

    try {
      const response = await fetch('/api/form-submission/v1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: payload }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      if (onSubmit) onSubmit(formData);
      setStatus('success');

      const expiryTime = Date.now() + COOLDOWN_DURATION;
      localStorage.setItem(COOLDOWN_KEY, expiryTime.toString());
      setCooldownRemaining(COOLDOWN_DURATION);
      startTimer(expiryTime);

      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const inputContainerVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full max-w-4xl mx-auto p-1 rounded-3xl bg-gradient-to-br from-stone-800 to-stone-950 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 mix-blend-overlay pointer-events-none" />

      <div className="bg-stone-950/90 backdrop-blur-xl rounded-[22px] p-6 md:p-10 border border-stone-800 relative z-10 h-full">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-stone-800 pb-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-stone-50 via-stone-200 to-stone-400">
              Family & Sponsorship
            </h2>
            <p className="text-stone-400 text-sm max-w-md leading-relaxed">Provide details about your family background and sponsorship for verification.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClear} className="text-stone-500 hover:text-stone-200 hover:bg-stone-800 transition-colors">
            <Eraser className="w-4 h-4 mr-2" />
            Clear Form
          </Button>
        </div>

        <motion.div className="space-y-6" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} initial="hidden" animate="visible">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={inputContainerVariants} className="space-y-2 group">
              <Label className="text-xs font-semibold uppercase tracking-wider text-stone-500 group-focus-within:text-pink-400 transition-colors">
                Father&apos;s Name
              </Label>
              <Input
                value={formData.fatherName}
                onChange={e => updateField('fatherName', e.target.value)}
                placeholder={defaultDataForm2.fatherName}
                className="bg-stone-900/50 border-stone-800 text-stone-100 placeholder:text-stone-600 focus:border-pink-500/50 focus:ring-pink-500/20 focus:bg-stone-900 transition-all duration-300 h-12 rounded-xl"
              />
            </motion.div>
            <motion.div variants={inputContainerVariants} className="space-y-2 group">
              <Label className="text-xs font-semibold uppercase tracking-wider text-stone-500 group-focus-within:text-pink-400 transition-colors">
                Mother&apos;s Name
              </Label>
              <Input
                value={formData.motherName}
                onChange={e => updateField('motherName', e.target.value)}
                placeholder={defaultDataForm2.motherName}
                className="bg-stone-900/50 border-stone-800 text-stone-100 placeholder:text-stone-600 focus:border-pink-500/50 focus:ring-pink-500/20 focus:bg-stone-900 transition-all duration-300 h-12 rounded-xl"
              />
            </motion.div>
          </div>

          <motion.div variants={inputContainerVariants} className="space-y-2 group">
            <Label className="text-xs font-semibold uppercase tracking-wider text-stone-500 group-focus-within:text-pink-400 transition-colors">
              Sponsor Name
            </Label>
            <Input
              value={formData.sponsorName}
              onChange={e => updateField('sponsorName', e.target.value)}
              placeholder={defaultDataForm2.sponsorName}
              className="bg-stone-900/50 border-stone-800 text-stone-100 placeholder:text-stone-600 focus:border-pink-500/50 focus:ring-pink-500/20 focus:bg-stone-900 transition-all duration-300 h-12 rounded-xl"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={inputContainerVariants} className="space-y-2 group">
              <Label className="text-xs font-semibold uppercase tracking-wider text-stone-500 group-focus-within:text-pink-400 transition-colors">
                Sponsor Relation
              </Label>
              <Input
                value={formData.sponsorRelation}
                onChange={e => updateField('sponsorRelation', e.target.value)}
                placeholder={defaultDataForm2.sponsorRelation}
                className="bg-stone-900/50 border-stone-800 text-stone-100 placeholder:text-stone-600 focus:border-pink-500/50 focus:ring-pink-500/20 focus:bg-stone-900 transition-all duration-300 h-12 rounded-xl"
              />
            </motion.div>
            <motion.div variants={inputContainerVariants} className="space-y-2 group">
              <Label className="text-xs font-semibold uppercase tracking-wider text-stone-500 group-focus-within:text-pink-400 transition-colors">
                Annual Family Income
              </Label>
              <Input
                value={formData.annualFamilyIncome}
                onChange={e => updateField('annualFamilyIncome', e.target.value)}
                placeholder={defaultDataForm2.annualFamilyIncome}
                className="bg-stone-900/50 border-stone-800 text-stone-100 placeholder:text-stone-600 focus:border-pink-500/50 focus:ring-pink-500/20 focus:bg-stone-900 transition-all duration-300 h-12 rounded-xl"
              />
            </motion.div>
          </div>

          <motion.div variants={inputContainerVariants} className="space-y-2 group">
            <Label className="text-xs font-semibold uppercase tracking-wider text-stone-500 group-focus-within:text-pink-400 transition-colors">
              Emergency Contact Number
            </Label>
            <Input
              type="tel"
              value={formData.emergencyContact}
              onChange={e => updateField('emergencyContact', e.target.value)}
              placeholder={defaultDataForm2.emergencyContact}
              className="bg-stone-900/50 border-stone-800 text-stone-100 placeholder:text-stone-600 focus:border-pink-500/50 focus:ring-pink-500/20 focus:bg-stone-900 transition-all duration-300 h-12 rounded-xl"
            />
          </motion.div>
        </motion.div>

        <div className="pt-8">
          <AnimatePresence mode="wait">
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 flex items-center gap-3 text-sm shadow-[0_0_20px_-5px_rgba(239,68,68,0.3)]"
              >
                <AlertCircle className="shrink-0 text-red-400" size={18} />
                <span className="font-medium">{errorMessage || 'Failed to submit form.'}</span>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 flex items-center gap-3 text-sm shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]"
              >
                <CheckCircle2 className="shrink-0 text-emerald-400" size={18} />
                <span className="font-medium">Family details saved successfully! Cooldown active.</span>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            onClick={handleSubmit}
            disabled={status === 'loading' || cooldownRemaining > 0}
            className={`w-full h-14 rounded-xl relative overflow-hidden transition-all duration-500 font-semibold tracking-wide text-base
              ${
                cooldownRemaining > 0
                  ? 'bg-stone-800 text-stone-500 border border-stone-700/50 cursor-not-allowed'
                  : 'bg-stone-100 text-stone-950 hover:bg-white hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] border border-transparent'
              }`}
          >
            <AnimatePresence mode="wait">
              {status === 'loading' ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3"
                >
                  <Loader2 className="animate-spin text-pink-600" size={20} />
                  <span>Processing Request...</span>
                </motion.div>
              ) : cooldownRemaining > 0 ? (
                <motion.div
                  key="cooldown"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3"
                >
                  <Clock size={20} />
                  <span>Resubmit in {formatTime(cooldownRemaining)}</span>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-3"
                >
                  <Save size={20} />
                  <span>Save Family Details</span>
                </motion.div>
              )}
            </AnimatePresence>

            {cooldownRemaining <= 0 && status !== 'loading' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 opacity-0 group-hover:opacity-100"
                initial={{ x: '-150%' }}
                whileHover={{ x: '150%' }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
              />
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default FormFieldForm2;
