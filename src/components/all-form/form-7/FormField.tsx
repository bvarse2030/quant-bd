/*
|-----------------------------------------
| setting up FormField for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { toast } from 'react-toastify';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle, Clock, Save, Eraser, FileText, User, Phone, Plus, Trash2, FolderOpen, Image as ImageIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ImageUploadManagerSingle from '@/components/dashboard-ui/ImageUploadManagerSingle';

import type { IForm7Data, IOtherDoc } from './data';
import { defaultDataForm7 } from './data';

export interface Form7Props {
  data?: IForm7Data;
  onSubmit?: (values: IForm7Data) => void;
}

const COOLDOWN_KEY = 'form_submission_cooldown_v7';
const COOLDOWN_DURATION = 10 * 1 * 1000;

const emptyFormData: IForm7Data = {
  student_name: '',
  mobile_number: '',
  documents: {
    nid: '',
    passport: '',
    images: '',
    birth_certificate: '',
    ssc_certificate: '',
    hsc_certificate: '',
    others: [],
  },
  formUid: 'form-documents-uid-7',
  formTitle: 'Document Uploads',
  submitButtonText: 'Submit Documents',
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FormFieldForm7 = ({ data, onSubmit }: Form7Props) => {
  const [formData, setFormData] = useState<IForm7Data>(JSON.parse(JSON.stringify(emptyFormData)));
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

  const updateField = (field: keyof IForm7Data, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (status === 'error') setStatus('idle');
  };

  const updateDocument = (key: keyof Omit<IForm7Data['documents'], 'others'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [key]: value,
      },
    }));
  };

  const addNewSlot = () => {
    const newDoc: IOtherDoc = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      path: '',
    };

    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        others: [...prev.documents.others, newDoc],
      },
    }));
  };

  const updateOtherDoc = (id: string, field: keyof IOtherDoc, value: string) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        others: prev.documents.others.map(doc => (doc.id === id ? { ...doc, [field]: value } : doc)),
      },
    }));
  };

  const removeOtherDocument = (id: string) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        others: prev.documents.others.filter(doc => doc.id !== id),
      },
    }));
    toast.info('Document slot removed');
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleClear = () => {
    setFormData(JSON.parse(JSON.stringify(emptyFormData)));
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
      toast.success('Documents submitted successfully');

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

  const RenderUploadBlock = ({
    label,
    docKey,
    icon: Icon,
  }: {
    label: string;
    docKey: keyof Omit<IForm7Data['documents'], 'others'>;
    icon?: React.ElementType;
  }) => {
    return (
      <motion.div
        variants={inputContainerVariants}
        className="space-y-3 p-4 rounded-xl bg-stone-900/40 border border-stone-800 hover:border-teal-500/30 transition-colors group"
      >
        <Label className="text-xs font-semibold uppercase tracking-wider text-stone-400 group-hover:text-teal-400 transition-colors flex items-center gap-2">
          {Icon && <Icon size={14} />} {label}
        </Label>
        <div className="bg-stone-950/50 rounded-lg p-1 border border-stone-800/50 group-hover:border-teal-500/20 transition-all">
          <ImageUploadManagerSingle value={formData.documents[docKey] || ''} onChange={url => updateDocument(docKey, url)} />
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full max-w-5xl mx-auto p-1 rounded-3xl bg-gradient-to-br from-stone-800 to-stone-950 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 mix-blend-overlay pointer-events-none" />

      <div className="bg-stone-950/90 backdrop-blur-xl rounded-[22px] p-6 md:p-10 border border-stone-800 relative z-10 h-full">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-stone-800 pb-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-stone-50 via-stone-200 to-stone-400">
              Document Submission
            </h2>
            <p className="text-stone-400 text-sm max-w-md leading-relaxed">
              Securely upload your identification and academic documents. Supported formats: JPG, PNG, PDF.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClear} className="text-stone-500 hover:text-stone-200 hover:bg-stone-800 transition-colors">
            <Eraser className="w-4 h-4 mr-2" />
            Clear Form
          </Button>
        </div>

        <motion.div className="space-y-8" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} initial="hidden" animate="visible">
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-800/60">
              <div className="h-1.5 w-1.5 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.5)]" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-teal-500/90">Student Identity</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={inputContainerVariants} className="space-y-2 group">
                <Label className="text-xs font-semibold uppercase tracking-wider text-stone-500 group-focus-within:text-teal-400 transition-colors flex items-center gap-2">
                  <User size={12} /> Student Name
                </Label>
                <Input
                  value={formData.student_name}
                  onChange={e => updateField('student_name', e.target.value)}
                  placeholder={defaultDataForm7.student_name}
                  className="bg-stone-900/50 border-stone-800 text-stone-100 placeholder:text-stone-600 focus:border-teal-500/50 focus:ring-teal-500/20 focus:bg-stone-900 transition-all duration-300 h-12 rounded-xl"
                />
              </motion.div>
              <motion.div variants={inputContainerVariants} className="space-y-2 group">
                <Label className="text-xs font-semibold uppercase tracking-wider text-stone-500 group-focus-within:text-teal-400 transition-colors flex items-center gap-2">
                  <Phone size={12} /> Mobile Number
                </Label>
                <Input
                  value={formData.mobile_number}
                  onChange={e => updateField('mobile_number', e.target.value)}
                  placeholder={defaultDataForm7.mobile_number}
                  className="bg-stone-900/50 border-stone-800 text-stone-100 placeholder:text-stone-600 focus:border-teal-500/50 focus:ring-teal-500/20 focus:bg-stone-900 transition-all duration-300 h-12 rounded-xl"
                />
              </motion.div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-800/60">
              <div className="h-1.5 w-1.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-sky-500/90">Required Documents</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <RenderUploadBlock label="NID / Smart Card" docKey="nid" icon={FileText} />
              <RenderUploadBlock label="Passport Copy" docKey="passport" icon={FileText} />
              <RenderUploadBlock label="Passport Size Photo" docKey="images" icon={ImageIcon} />
              <RenderUploadBlock label="Birth Certificate" docKey="birth_certificate" icon={FileText} />
              <RenderUploadBlock label="SSC / O-Level" docKey="ssc_certificate" icon={FileText} />
              <RenderUploadBlock label="HSC / A-Level" docKey="hsc_certificate" icon={FileText} />
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-stone-800/60 pb-2">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-purple-500/90">Additional Files</h3>
              </div>
              <Button onClick={addNewSlot} variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 h-8">
                <Plus className="w-4 h-4 mr-2" /> Add Document
              </Button>
            </div>

            <AnimatePresence>
              {formData.documents.others.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-stone-600 text-sm border border-dashed border-stone-800 rounded-xl"
                >
                  No additional documents added.
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {formData.documents.others.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    className="flex flex-col gap-3 p-4 bg-stone-900/30 rounded-xl border border-stone-800 group hover:border-purple-500/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-stone-800 text-stone-500 text-[10px] font-mono">{index + 1}</div>
                      <div className="relative flex-1">
                        <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={14} />
                        <Input
                          placeholder="Document Name (e.g. Awards)"
                          value={doc.name}
                          onChange={e => updateOtherDoc(doc.id, 'name', e.target.value)}
                          className="h-9 pl-9 text-xs bg-stone-950/50 border-stone-800 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-lg"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOtherDocument(doc.id)}
                        className="h-9 w-9 text-stone-500 hover:text-red-400 hover:bg-red-500/10 shrink-0 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                    <div className="bg-stone-950/30 rounded-lg p-1 border border-stone-800/50">
                      <ImageUploadManagerSingle value={doc.path} onChange={url => updateOtherDoc(doc.id, 'path', url)} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </div>
        </motion.div>

        <div className="pt-8 mt-4 border-t border-stone-800">
          <AnimatePresence mode="wait">
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 flex items-center gap-3 text-sm shadow-[0_0_20px_-5px_rgba(239,68,68,0.3)]"
              >
                <AlertCircle className="shrink-0 text-red-400" size={18} />
                <span className="font-medium">{errorMessage || 'Failed to submit documents.'}</span>
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
                <span className="font-medium">Documents submitted successfully! Cooldown active.</span>
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
                  <Loader2 className="animate-spin text-teal-600" size={20} />
                  <span>Uploading Documents...</span>
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
                  <span>Submit Documents</span>
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

export default FormFieldForm7;
