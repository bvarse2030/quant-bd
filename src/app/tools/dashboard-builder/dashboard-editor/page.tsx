'use client';

import { X, Plus, Save, Search, Trash2, Loader2, Settings, RefreshCcw, AlertCircle, BookOpen, CreditCard, User, Hash, School } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '@/lib/utils';
import {
  DashboardEditorItem,
  useGetDashboardEditorsQuery,
  useAddDashboardEditorMutation,
  useDeleteDashboardEditorMutation,
  useUpdateDashboardEditorMutation,
} from './../redux/features/dashboard-editor-slice/dashboardEditorSlice';

interface ApiErrorData {
  message?: string;
  error?: string;
}

const Button = ({
  onClick,
  children,
  variant = 'primary',
  className,
  disabled,
  loading,
  type = 'button',
}: {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'danger' | 'secondary' | 'ghost' | 'outline' | 'outlineGlassy' | 'outlineFire';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}) => {
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-lg shadow-indigo-500/20',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white border-none shadow-lg shadow-rose-500/20',
    secondary: 'bg-white/5 hover:bg-white/10 text-white/70 border-white/10',
    ghost: 'bg-transparent hover:bg-white/5 text-white/40 hover:text-white',
    outline: 'bg-transparent border border-white/20 text-white/70 hover:border-white/40 hover:text-white',
    outlineGlassy: 'backdrop-blur-md bg-white/5 border border-white/20 hover:bg-white/10 text-white transition-all',
    outlineFire: 'backdrop-blur-md bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 transition-all',
  };

  return (
    <motion.button
      type={type}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'px-4 py-2 rounded-xl font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-all border disabled:opacity-50',
        variants[variant],
        className,
      )}
    >
      {loading ? <Loader2 className="animate-spin" size={16} /> : children}
    </motion.button>
  );
};

const SkeletonCard = () => (
  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 animate-pulse">
    <div className="flex items-center gap-5 w-full md:w-auto">
      <div className="w-12 h-12 rounded-full bg-white/5" />
      <div className="space-y-3">
        <div className="h-4 w-48 bg-white/10 rounded-md" />
        <div className="h-3 w-32 bg-white/5 rounded-md" />
      </div>
    </div>
    <div className="flex gap-3">
      <div className="h-10 w-24 bg-white/5 rounded-xl" />
      <div className="h-10 w-24 bg-white/5 rounded-xl" />
    </div>
  </div>
);

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  icon: Icon,
  maxWidth = 'max-w-2xl',
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  icon?: React.ElementType;
  maxWidth?: string;
}) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
          className={cn('relative z-10 bg-slate-900 border border-white/10 w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]', maxWidth)}
        >
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
            <h2 className="text-lg font-bold text-white flex items-center gap-3">
              {Icon && <Icon className="text-indigo-400" size={20} />}
              {title}
            </h2>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default function DashboardEditorManager() {
  const { data: records = [], isLoading, isError, refetch } = useGetDashboardEditorsQuery();
  const [addRecord, { isLoading: isAdding }] = useAddDashboardEditorMutation();
  const [updateRecord, { isLoading: isUpdating }] = useUpdateDashboardEditorMutation();
  const [deleteRecord, { isLoading: isDeleting }] = useDeleteDashboardEditorMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<DashboardEditorItem>>({
    Name: '',
    Roll: 0,
    class: 0,
    subject: [],
    payment: [],
  });

  const [subjectInput, setSubjectInput] = useState('');

  const getErrorMessage = (err: unknown) => {
    if (err && typeof err === 'object' && 'data' in err) {
      const errorData = (err as { data: ApiErrorData }).data;
      return errorData?.message || errorData?.error || 'An unexpected error occurred.';
    }
    return 'An unexpected error occurred.';
  };

  const handleOpenAdd = () => {
    setFormData({ Name: '', Roll: 0, class: 0, subject: [], payment: [] });
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (record: DashboardEditorItem) => {
    setFormData({
      _id: record._id,
      Name: record.Name || '',
      Roll: record.Roll || 0,
      class: record.class || 0,
      subject: record.subject ? [...record.subject] : [],
      payment: record.payment ? [...record.payment] : [],
    });
    setEditingId(record._id);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleAddSubject = () => {
    if (subjectInput.trim()) {
      setFormData(prev => ({
        ...prev,
        subject: [...(prev.subject || []), subjectInput.trim()],
      }));
      setSubjectInput('');
    }
  };

  const handleRemoveSubject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subject: (prev.subject || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddPayment = () => {
    setFormData(prev => ({
      ...prev,
      payment: [...(prev.payment || []), { key: '', value: '' }],
    }));
  };

  const handleUpdatePayment = (index: number, field: 'key' | 'value', val: string) => {
    setFormData(prev => {
      const newPayments = [...(prev.payment || [])];
      newPayments[index] = { ...newPayments[index], [field]: val };
      return { ...prev, payment: newPayments };
    });
  };

  const handleRemovePayment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      payment: (prev.payment || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.Name?.trim() || formData.Roll === undefined || formData.class === undefined) {
      toast.error('Name, Roll, and Class are required.');
      return;
    }
    const isEdit = !!editingId;
    try {
      if (isEdit) {
        await updateRecord({ ...formData, _id: editingId }).unwrap();
      } else {
        await addRecord(formData).unwrap();
      }
      setIsFormOpen(false);
      setEditingId(null);
      toast.success('Record Synced Successfully');
    } catch (err) {
      toast.error(`Operation failed: ${getErrorMessage(err)}`);
    }
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await deleteRecord(deleteId).unwrap();
        setIsDeleteOpen(false);
        setDeleteId(null);
        toast.success('Record deleted.');
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30 font-sans relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-emerald-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto relative z-10 p-6 max-w-7xl">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 mt-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Dashboard Editor</h1>
            <p className="text-sm text-slate-400 font-medium">Manage student directories and financial records</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <Button onClick={() => refetch()} variant="outlineGlassy" className="p-3" disabled={isLoading}>
              <RefreshCcw size={18} className={cn(isLoading && 'animate-spin')} />
            </Button>
            <Button onClick={handleOpenAdd} variant="primary" className="h-11 px-6">
              <Plus size={18} className="mr-2" /> New Record
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading ? (
            Array(6)
              .fill(0)
              .map((_, i) => <SkeletonCard key={i} />)
          ) : isError ? (
            <div className="col-span-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-rose-500/20 rounded-2xl bg-rose-500/5">
              <AlertCircle size={40} className="text-rose-500 mb-4" />
              <p className="text-sm font-bold uppercase tracking-widest text-rose-400">Sync Error</p>
              <Button onClick={() => refetch()} variant="outlineFire" className="mt-6">
                Try Again
              </Button>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {records.length > 0 ? (
                records.map((record, index) => (
                  <motion.div
                    key={record._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group backdrop-blur-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 rounded-2xl overflow-hidden shadow-xl transition-all"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <User size={24} />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white mb-1">{record.Name}</h3>
                            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                              <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md">
                                <Hash size={12} /> Roll: {record.Roll}
                              </span>
                              <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md">
                                <School size={12} /> Class: {record.class}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <BookOpen size={14} className="text-emerald-400" /> Enrolled Subjects
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {record.subject && record.subject.length > 0 ? (
                              record.subject.map((sub, i) => (
                                <span
                                  key={i}
                                  className="text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-3 py-1 rounded-full"
                                >
                                  {sub}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-500 italic">No subjects enrolled</span>
                            )}
                          </div>
                        </div>

                        <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <CreditCard size={14} className="text-amber-400" /> Financial Records
                          </h4>
                          <div className="space-y-2">
                            {record.payment && record.payment.length > 0 ? (
                              record.payment.map((pay, i) => (
                                <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                  <span className="text-slate-300">{pay.key}</span>
                                  <span className="font-mono text-amber-300">{pay.value}</span>
                                </div>
                              ))
                            ) : (
                              <span className="text-xs text-slate-500 italic">No financial records</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-white/10 flex gap-3">
                        <Button variant="outlineGlassy" onClick={() => handleOpenEdit(record)} className="flex-1 py-2.5">
                          <Settings size={16} className="mr-2" /> Edit
                        </Button>
                        <Button variant="outlineFire" onClick={() => record._id && handleOpenDelete(record._id)} className="px-4 py-2.5">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/10 rounded-2xl bg-white/5"
                >
                  <Search className="text-white/10 mb-6" size={56} />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Empty Database</h3>
                  <Button onClick={handleOpenAdd} variant="outlineGlassy" className="mt-8">
                    Create First Record
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingId ? 'Edit Record' : 'New Record'} icon={User}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2 col-span-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                value={formData.Name || ''}
                onChange={e => setFormData({ ...formData, Name: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Student Name"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Roll Number</label>
              <input
                type="number"
                value={formData.Roll === 0 ? '' : formData.Roll}
                onChange={e => setFormData({ ...formData, Roll: Number(e.target.value) })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                placeholder="e.g. 101"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Class</label>
              <input
                type="number"
                value={formData.class === 0 ? '' : formData.class}
                onChange={e => setFormData({ ...formData, class: Number(e.target.value) })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                placeholder="e.g. 10"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <BookOpen size={16} className="text-emerald-400" /> Subjects
              </label>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-md uppercase">
                {formData.subject?.length || 0} Added
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={subjectInput}
                onChange={e => setSubjectInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSubject())}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                placeholder="Enter subject name..."
              />
              <button
                type="button"
                onClick={handleAddSubject}
                className="bg-white/5 hover:bg-emerald-600 border border-white/10 hover:border-emerald-500 text-white px-4 rounded-xl transition-all"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.subject?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-full text-sm"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubject(idx)}
                    className="hover:text-emerald-100 hover:bg-emerald-500/50 rounded-full p-0.5 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <CreditCard size={16} className="text-amber-400" /> Payment Records
              </label>
              <Button variant="outlineGlassy" onClick={handleAddPayment} className="py-1.5 px-3 text-[10px]">
                <Plus size={14} className="mr-1" /> Add Entry
              </Button>
            </div>

            <div className="space-y-3 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
              {formData.payment?.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-center bg-black/40 p-3 rounded-xl border border-white/5">
                  <input
                    type="text"
                    value={item.key}
                    onChange={e => handleUpdatePayment(idx, 'key', e.target.value)}
                    className="flex-1 bg-transparent border-b border-white/10 px-2 py-1.5 text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none transition-all"
                    placeholder="Fee Type (e.g. Tuition)"
                  />
                  <input
                    type="text"
                    value={item.value}
                    onChange={e => handleUpdatePayment(idx, 'value', e.target.value)}
                    className="w-1/3 bg-transparent border-b border-white/10 px-2 py-1.5 text-sm font-mono text-amber-300 placeholder:text-white/20 focus:border-amber-500 outline-none transition-all"
                    placeholder="Amount/Status"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePayment(idx)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {(!formData.payment || formData.payment.length === 0) && (
                <div className="text-center py-6 text-xs text-slate-500 italic border border-dashed border-white/10 rounded-xl">
                  No payment records attached.
                </div>
              )}
            </div>
          </div>

          <div className="pt-6">
            <Button
              onClick={handleSubmit}
              className="w-full h-12 text-sm"
              disabled={!formData.Name || !formData.Roll || !formData.class}
              loading={isAdding || isUpdating}
            >
              <Save size={18} className="mr-2" /> {editingId ? 'Save Changes' : 'Create Record'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Confirm Deletion" icon={Trash2}>
        <div className="text-center py-6">
          <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500 shadow-xl shadow-rose-500/10">
            <Trash2 size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Permanently delete this record?</h3>
          <p className="text-sm text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">
            This operation cannot be undone. All related data including subjects and financial history will be removed.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outlineGlassy" onClick={() => setIsDeleteOpen(false)} className="h-12">
              Cancel
            </Button>
            <Button variant="outlineFire" onClick={confirmDelete} loading={isDeleting} className="h-12">
              Confirm Wipe
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
