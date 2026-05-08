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
import { Loader2, CheckCircle2, AlertCircle, Clock, Save, Eraser, GraduationCap, School, Award, Languages, Calendar } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import type { IForm4Data } from './data';
import { defaultDataForm4 } from './data';

export interface Form4Props {
  data?: IForm4Data;
  onSubmit?: (values: IForm4Data) => void;
}

const COOLDOWN_KEY = 'form_submission_cooldown_v4';
const COOLDOWN_DURATION = 10 * 1 * 1000;

const emptyFormData: IForm4Data = {
  institutionName: '',
  qualification: '',
  passingYear: '',
  resultCGPA: '',
  englishTestType: '',
  englishTestScore: '',
  formUid: 'form-academic-uid-4',
  formTitle: 'Academic Background',
  submitButtonText: 'Save & Next',
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FormFieldForm4 = ({ data, onSubmit }: Form4Props) => {
  const [formData, setFormData] = useState<IForm4Data>(emptyFormData);
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

  const updateField = (field: keyof IForm4Data, value: string) => {
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
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-stone-800 pb-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-stone-50 via-stone-200 to-stone-400">
              Academic Background
            </h2>
            <p className="text-stone-400 text-sm max-w-md leading-relaxed">
              Please enter your most recent educational qualifications and language test scores.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClear} className="text-stone-500 hover:text-stone-200 hover:bg-stone-800 transition-colors">
            <Eraser className="w-4 h-4 mr-2" />
            Clear Form
          </Button>
        </div>

        <motion.div className="space-y-6" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} initial="hidden" animate="visible">
          <motion.div variants={inputContainerVariants} className="space-y-2 group">
            <Label className="text-xs font-semibold uppercase tracking-wider text-stone-500 group-focus-within:text-indigo-400 transition-colors flex items-center gap-2">
              <School size={12} /> Institution Name
            </Label>
            <Input
              value={formData.institutionName}
              onChange={e => updateField('institutionName', e.target.value)}
              placeholder={defaultDataForm4.institutionName}
              className="bg-stone-900/50 border-stone-800 text-stone-100 placeholder:text-stone-600 focus:border-indigo-500/50 focus:ring-indigo-500/20 focus:bg-stone-900 transition-all duration-300 h-12 rounded-xl"
            />
          </motion.div>

          <motion.div variants={inputContainerVariants} className="space-y-2 group">
            <Label className="text-xs font-semibold uppercase tracking-wider text-stone-500 group-focus-within:text-indigo-400 transition-colors flex items-center gap-2">
              <GraduationCap size={12} /> Qualification / Degree
            </Label>
            <Input
              value={formData.qualification}
              onChange={e => updateField('qualification', e.target.value)}
              placeholder={defaultDataForm4.qualification}
              className="bg-stone-900/50 border-stone-800 text-stone-100 placeholder:text-stone-600 focus:border-indigo-500/50 focus:ring-indigo-500/20 focus:bg-stone-900 transition-all duration-300 h-12 rounded-xl"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={inputContainerVariants} className="space-y-2 group">
              <Label className="text-xs font-semibold uppercase tracking-wider text-stone-500 group-focus-within:text-indigo-400 transition-colors flex items-center gap-2">
                <Calendar size={12} /> Passing Year
              </Label>
              <Input
                value={formData.passingYear}
                onChange={e => updateField('passingYear', e.target.value)}
                placeholder={defaultDataForm4.passingYear}
                className="bg-stone-900/50 border-stone-800 text-stone-100 placeholder:text-stone-600 focus:border-indigo-500/50 focus:ring-indigo-500/20 focus:bg-stone-900 transition-all duration-300 h-12 rounded-xl"
              />
            </motion.div>
            <motion.div variants={inputContainerVariants} className="space-y-2 group">
              <Label className="text-xs font-semibold uppercase tracking-wider text-stone-500 group-focus-within:text-indigo-400 transition-colors flex items-center gap-2">
                <Award size={12} /> Result (CGPA/GPA)
              </Label>
              <Input
                value={formData.resultCGPA}
                onChange={e => updateField('resultCGPA', e.target.value)}
                placeholder={defaultDataForm4.resultCGPA}
                className="bg-stone-900/50 border-stone-800 text-stone-100 placeholder:text-stone-600 focus:border-indigo-500/50 focus:ring-indigo-500/20 focus:bg-stone-900 transition-all duration-300 h-12 rounded-xl"
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={inputContainerVariants} className="space-y-2 group">
              <Label className="text-xs font-semibold uppercase tracking-wider text-stone-500 group-focus-within:text-indigo-400 transition-colors flex items-center gap-2">
                <Languages size={12} /> English Test Type
              </Label>
              <Input
                value={formData.englishTestType}
                onChange={e => updateField('englishTestType', e.target.value)}
                placeholder={defaultDataForm4.englishTestType || 'IELTS / TOEFL / PTE'}
                className="bg-stone-900/50 border-stone-800 text-stone-100 placeholder:text-stone-600 focus:border-indigo-500/50 focus:ring-indigo-500/20 focus:bg-stone-900 transition-all duration-300 h-12 rounded-xl"
              />
            </motion.div>
            <motion.div variants={inputContainerVariants} className="space-y-2 group">
              <Label className="text-xs font-semibold uppercase tracking-wider text-stone-500 group-focus-within:text-indigo-400 transition-colors flex items-center gap-2">
                <Award size={12} /> Test Score
              </Label>
              <Input
                value={formData.englishTestScore}
                onChange={e => updateField('englishTestScore', e.target.value)}
                placeholder={defaultDataForm4.englishTestScore}
                className="bg-stone-900/50 border-stone-800 text-stone-100 placeholder:text-stone-600 focus:border-indigo-500/50 focus:ring-indigo-500/20 focus:bg-stone-900 transition-all duration-300 h-12 rounded-xl"
              />
            </motion.div>
          </div>
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
                <span className="font-medium">Academic info saved successfully! Cooldown active.</span>
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
                  <Loader2 className="animate-spin text-indigo-600" size={20} />
                  <span>Processing Academics...</span>
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
                  <span>Save Academic Info</span>
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

export default FormFieldForm4;
