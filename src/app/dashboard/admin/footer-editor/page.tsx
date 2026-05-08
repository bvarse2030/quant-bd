/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import {
  X,
  Plus,
  Save,
  Search,
  Trash2,
  Loader2,
  FileJson,
  Activity,
  Download,
  Settings,
  ChevronUp,
  RefreshCcw,
  AlertCircle,
  ShieldAlert,
  ChevronDown,
  MonitorPlay,
  CheckCircle2,
  LayoutTemplate,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '@/lib/utils';
import {
  FooterItem,
  useGetFootersQuery,
  useAddFooterMutation,
  useDeleteFooterMutation,
  useUpdateFooterMutation,
} from '@/redux/features/footer-settings/footerSlice';
import { AllFooter, AllFooterKeys } from '@/components/all-footer/all-footer-index/all-footer';

interface ApiError {
  data?: { message?: string; error?: string };
  error?: string;
  status?: number;
}

interface FooterDataPayload {
  templateKey: string;
  content: string;
}

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
        'px-4 py-2 rounded-sm font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all border disabled:opacity-50',
        variants[variant],
        className,
      )}
    >
      {loading ? <Loader2 className="animate-spin" size={14} /> : children}
    </motion.button>
  );
};

const SkeletonCard = () => (
  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-sm p-6 flex flex-col md:flex-row items-center justify-between gap-6 animate-pulse">
    <div className="flex items-center gap-5 w-full md:w-auto">
      <div className="w-10 h-10 rounded-sm bg-white/5" />
      <div className="space-y-2">
        <div className="h-4 w-48 bg-white/10 rounded-sm" />
        <div className="h-2 w-32 bg-white/5 rounded-sm" />
      </div>
    </div>
    <div className="flex gap-3">
      <div className="h-10 w-24 bg-white/5 rounded-sm" />
      <div className="h-10 w-24 bg-white/5 rounded-sm" />
    </div>
  </div>
);

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  icon: Icon,
  maxWidth = 'max-w-lg',
  fullScreen = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  icon?: React.ElementType;
  maxWidth?: string;
  fullScreen?: boolean;
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
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.95, x: -20 }}
          transition={{ type: 'spring', duration: 0.5, ease: 'circOut' }}
          className={cn(
            'relative z-10 bg-slate-950 border border-white/10 w-full rounded-sm shadow-2xl overflow-hidden flex flex-col',
            fullScreen ? 'h-[95vh] max-w-[95vw]' : `max-h-[85vh] ${maxWidth}`,
          )}
        >
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
            <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 italic">
              {Icon && <Icon className="text-indigo-400" size={16} />}
              {title}
            </h2>
            <button onClick={onClose} className="p-2 rounded-sm hover:bg-white/10 text-white/40 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 relative">{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const FooterManager = () => {
  const { data: footers = [], isLoading, isError, refetch } = useGetFootersQuery();
  const [addFooter, { isLoading: isAdding }] = useAddFooterMutation();
  const [updateFooter, { isLoading: isUpdating }] = useUpdateFooterMutation();
  const [deleteFooter, { isLoading: isDeleting }] = useDeleteFooterMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isEditContentOpen, setIsEditContentOpen] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [importTargetId, setImportTargetId] = useState<string | null>(null);
  const [expandedFooterId, setExpandedFooterId] = useState<string | null>(null);
  const [contentEditingFooter, setContentEditingFooter] = useState<FooterItem | null>(null);

  const [formData, setFormData] = useState<Partial<FooterItem>>({
    name: '',
    disabledPaths: [],
    isEnabled: true,
    data: {},
  });
  const [pathInput, setPathInput] = useState('');

  const getErrorMessage = (err: unknown) => {
    const error = err as ApiError;
    return error?.data?.message || error?.data?.error || error?.error || 'An unexpected error occurred.';
  };

  const handleOpenAdd = () => {
    setFormData({ name: '', disabledPaths: [], isEnabled: true, data: {} });
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleOpenEditSettings = (footer: FooterItem) => {
    setFormData({
      _id: footer?._id,
      name: footer?.name || '',
      disabledPaths: footer?.disabledPaths ? [...footer.disabledPaths] : [],
      isEnabled: footer?.isEnabled ?? true,
      data: footer?.data || {},
    });
    setEditingId(footer?._id);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleOpenImport = (id: string) => {
    setImportTargetId(id);
    setIsImportOpen(true);
  };

  const handleSelectTemplate = async (key: string) => {
    if (!importTargetId) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const templateData = (AllFooter as any)[key]?.data;
    const payload: FooterDataPayload = { templateKey: key, content: JSON.stringify(templateData) };
    const original = footers.find(f => f._id === importTargetId);
    if (!original) return;
    const updatedFooter = { ...original, data: payload };

    try {
      await updateFooter(updatedFooter).unwrap();
      setIsImportOpen(false);
      setImportTargetId(null);
      setExpandedFooterId(original._id);
      toast.success('Template imported successfully!');
    } catch (err) {
      toast.error(`Import failed: ${getErrorMessage(err)}`);
    }
  };

  const handleOpenEditContent = (footer: FooterItem) => {
    setContentEditingFooter(footer);
    setIsEditContentOpen(true);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSaveContent = async (newSettings: any) => {
    if (!contentEditingFooter) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentData = contentEditingFooter.data as any;
    const templateKey = currentData?.templateKey;
    if (!templateKey) {
      toast.error('Template key missing');
      return;
    }
    const payload: FooterDataPayload = { templateKey, content: JSON.stringify(newSettings) };
    const updatedFooter = { ...contentEditingFooter, data: payload };

    try {
      await updateFooter(updatedFooter).unwrap();
      setIsEditContentOpen(false);
      setContentEditingFooter(null);
      toast.success('Content updated');
    } catch (err) {
      toast.error(`Failed: ${getErrorMessage(err)}`);
    }
  };

  const handleAddPath = () => {
    if (pathInput?.trim()) {
      setFormData(prev => ({
        ...prev,
        disabledPaths: [...(prev?.disabledPaths || []), { path: pathInput.trim(), isExcluded: true }],
      }));
      setPathInput('');
    }
  };

  const togglePathRule = (index: number) => {
    const newPaths = [...(formData?.disabledPaths || [])];
    if (newPaths[index]) {
      newPaths[index] = { ...newPaths[index], isExcluded: !newPaths[index]?.isExcluded };
      setFormData({ ...formData, disabledPaths: newPaths });
    }
  };

  const removePath = (index: number) => {
    const newPaths = (formData?.disabledPaths || []).filter((_, i) => i !== index);
    setFormData({ ...formData, disabledPaths: newPaths });
  };

  const handleSubmitSettings = async () => {
    if (!formData?.name?.trim()) {
      toast.error('Friendly Name is required.');
      return;
    }
    const isEdit = !!editingId;
    try {
      if (isEdit) {
        await updateFooter({ ...formData, _id: editingId }).unwrap();
      } else {
        await addFooter(formData).unwrap();
      }
      setIsFormOpen(false);
      setEditingId(null);
      toast.success('Settings Synced Successfully');
    } catch (err) {
      toast.error(`Update failed: ${getErrorMessage(err)}`);
    }
  };

  const handleListToggle = async (footer: FooterItem) => {
    const newState = !footer?.isEnabled;
    try {
      await updateFooter({ ...footer, isEnabled: newState }).unwrap();
      toast.success(newState ? 'Enabled' : 'Disabled');
    } catch (err) {
      toast.error(`Failed: ${getErrorMessage(err)}`);
    }
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await deleteFooter(deleteId).unwrap();
        setIsDeleteOpen(false);
        setDeleteId(null);
        toast.success('Footer deleted.');
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    }
  };

  const renderFooterPreview = (footer: FooterItem) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = footer.data as any;
    if (!data || !data.templateKey || !data.content) return <div className="p-4 text-rose-400 font-bold uppercase text-[10px]">Invalid Structure</div>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Component = (AllFooter as any)[data.templateKey]?.query;
    if (!Component) return <div className="p-4 text-amber-400 font-bold uppercase text-[10px]">Unknown Template</div>;

    return (
      <div className="bg-white/5 rounded-sm overflow-hidden border border-white/20 relative group/preview">
        <div className="absolute inset-0 z-50 bg-transparent" />
        <div className="transform origin-top scale-[0.6] sm:scale-[0.8] lg:scale-100 w-full h-full origin-top-left pointer-events-none p-4">
          <Component data={data.content} />
        </div>
      </div>
    );
  };

  const renderMutationForm = () => {
    if (!contentEditingFooter) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = contentEditingFooter.data as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Component = (AllFooter as any)[data?.templateKey]?.mutation;
    if (!Component) return <div className="p-10 text-center text-white/40 font-black uppercase tracking-widest">Template Not Found</div>;
    return (
      <div className="h-full bg-slate-950 overflow-y-auto selection:bg-indigo-500/30">
        <Component data={data.content} onSave={handleSaveContent} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 font-sans relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-500/10 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto relative z-10 p-4 max-w-7xl">
        <ToastContainer position="bottom-right" theme="dark" hideProgressBar />

        <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 mt-8">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40">Footer Manager</h1>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em]">Global Presence & Content Controls</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <Button onClick={() => refetch()} variant="outlineGlassy" className="p-3" disabled={isLoading}>
              <RefreshCcw size={16} className={cn(isLoading && 'animate-spin')} />
            </Button>
            <Button onClick={handleOpenAdd} variant="primary" className="h-10 px-6">
              <Plus size={16} className="mr-2" /> New Configuration
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8">
          {isLoading ? (
            Array(3)
              .fill(0)
              .map((_, i) => <SkeletonCard key={i} />)
          ) : isError ? (
            <div className="h-60 flex flex-col items-center justify-center border-2 border-dashed border-rose-500/20 rounded-sm bg-rose-500/5">
              <AlertCircle size={32} className="text-rose-500 mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest text-rose-400">Sync Error</p>
              <Button onClick={() => refetch()} variant="outlineFire" className="mt-4">
                Try Again
              </Button>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {footers.length > 0 ? (
                footers.map(footer => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const hasData = footer.data && (footer.data as any).templateKey;
                  const isExpanded = expandedFooterId === footer._id;

                  return (
                    <motion.div
                      key={footer._id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="backdrop-blur-xl bg-white/5 border border-white/20 rounded-sm overflow-hidden shadow-2xl transition-all hover:border-white/40"
                    >
                      <div className="p-6 md:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                        <div className="flex items-center gap-6 w-full lg:w-auto">
                          <div className="relative">
                            <div
                              className={cn('w-3 h-3 rounded-full', footer.isEnabled ? 'bg-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.8)]' : 'bg-white/10')}
                            />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-xl font-bold text-white italic flex items-center gap-4">
                              {footer.name}
                              {hasData && (
                                <span className="text-[9px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-sm uppercase tracking-widest italic">
                                  {
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    (footer.data as any).templateKey
                                  }
                                </span>
                              )}
                            </h3>
                            <div className="flex gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                              <span className="flex items-center gap-2">
                                <ShieldAlert size={12} className="text-indigo-400" /> {footer.disabledPaths?.length || 0} Rules
                              </span>
                              <span
                                className={cn('flex items-center gap-2 border-l border-white/10 pl-4', footer.isEnabled ? 'text-indigo-300' : 'text-white/20')}
                              >
                                <Activity size={12} /> {footer.isEnabled ? 'Globally Active' : 'Offline'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-end">
                          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-sm border border-white/10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Visibility</span>
                            <ToggleSwitch checked={!!footer.isEnabled} onChange={() => handleListToggle(footer)} disabled={isUpdating} />
                          </div>

                          {hasData ? (
                            <div className="flex gap-2">
                              <Button variant="outlineGlassy" onClick={() => setExpandedFooterId(isExpanded ? null : footer._id)}>
                                {isExpanded ? <ChevronUp size={14} className="mr-2" /> : <ChevronDown size={14} className="mr-2" />}
                                {isExpanded ? 'Hide' : 'Preview'}
                              </Button>
                              <Button onClick={() => handleOpenEditContent(footer)} variant="primary">
                                <FileJson size={14} className="mr-2" /> Edit Data
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="primary"
                              className="bg-emerald-600 hover:bg-emerald-700 animate-pulse"
                              onClick={() => footer._id && handleOpenImport(footer._id)}
                            >
                              <Download size={14} className="mr-2" /> Import Template
                            </Button>
                          )}

                          <div className="flex gap-2 pl-4 border-l border-white/10">
                            <Button variant="outlineGlassy" onClick={() => handleOpenEditSettings(footer)} className="!p-2.5">
                              <Settings size={16} />
                            </Button>
                            <Button variant="outlineFire" onClick={() => footer._id && handleOpenDelete(footer._id)} className="!p-2.5">
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && hasData && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: 'circOut' }}
                            className="border-t border-white/10 bg-black/40"
                          >
                            <div className="p-8">
                              <div className="flex items-center justify-between mb-6">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 flex items-center gap-3">
                                  <MonitorPlay size={14} className="text-indigo-400" /> Instance Live Preview
                                </h4>
                              </div>
                              {renderFooterPreview(footer)}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/10 rounded-sm bg-white/5"
                >
                  <Search className="text-white/10 mb-6" size={48} />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Empty Configuration Library</h3>
                  <Button onClick={handleOpenAdd} variant="outlineGlassy" className="mt-8">
                    Create First Entry
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingId ? 'Edit Configuration' : 'Create Footer'} icon={Settings}>
        <div className="space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em]">Friendly Name</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="h-14 w-full bg-white/5 border border-white/20 rounded-sm px-4 text-lg font-bold placeholder:text-white/5 focus:border-white/40 outline-none transition-all"
              placeholder="Untitled Config"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-between bg-white/5 p-6 rounded-sm border border-white/10">
            <div className="space-y-1">
              <span className="flex items-center gap-3 text-[10px] font-black text-white uppercase tracking-widest italic">
                <CheckCircle2 size={14} className={formData.isEnabled ? 'text-indigo-400' : 'text-white/20'} />
                Global Deployment
              </span>
              <p className="text-[9px] text-white/40 font-bold uppercase tracking-wider">Status of this configuration</p>
            </div>
            <ToggleSwitch checked={!!formData.isEnabled} onChange={val => setFormData({ ...formData, isEnabled: val })} />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em]">Exclusion Geometry</label>
              <span className="text-[9px] font-black bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-sm uppercase tracking-widest">
                {formData.disabledPaths?.length || 0} ACTIVE
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={pathInput}
                onChange={e => setPathInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddPath()}
                className="flex-1 h-12 bg-white/5 border border-white/20 rounded-sm px-4 text-xs font-mono text-white outline-none focus:border-white/40 transition-all"
                placeholder="/restricted-zone"
              />
              <button onClick={handleAddPath} className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-sm transition-colors">
                <Plus size={18} />
              </button>
            </div>

            <div className="bg-black/40 rounded-sm border border-white/10 min-h-[120px] max-h-[250px] overflow-y-auto p-3 space-y-3 custom-scrollbar">
              {formData.disabledPaths?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/5 p-4 rounded-sm border border-white/5">
                  <span className="text-xs font-mono font-bold text-indigo-300 truncate max-w-[200px] italic">{item.path}</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 px-3 py-1.5 rounded-sm border border-white/5 bg-black/40">
                      <span className={cn('text-[8px] font-black uppercase tracking-widest', item.isExcluded ? 'text-indigo-300' : 'text-white/20')}>
                        {item.isExcluded ? 'HIDDEN' : 'VISIBLE'}
                      </span>
                      <ToggleSwitch checked={!!item.isExcluded} onChange={() => togglePathRule(idx)} />
                    </div>
                    <button onClick={() => removePath(idx)} className="p-2 hover:bg-rose-500/20 text-white/20 hover:text-rose-500 rounded-sm transition-all">
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <Button onClick={handleSubmitSettings} className="w-full h-14" disabled={!formData.name} loading={isAdding || isUpdating}>
              <Save size={16} className="mr-2" /> {editingId ? 'Update Configuration' : 'Finalize Entry'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} title="Select Template" icon={LayoutTemplate} maxWidth="max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AllFooterKeys.map(key => (
            <button
              key={key}
              onClick={() => handleSelectTemplate(key)}
              className="group relative flex flex-col items-center gap-6 p-8 bg-white/5 border border-white/10 rounded-sm hover:bg-white/10 hover:border-white transition-all text-left overflow-hidden"
            >
              <div className="w-16 h-16 rounded-sm bg-white/5 flex items-center justify-center text-white/20 group-hover:text-indigo-400 group-hover:scale-110 transition-all border border-white/10">
                <LayoutTemplate size={28} />
              </div>
              <div className="text-center relative z-10">
                <h4 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-2 group-hover:text-indigo-300 transition-colors italic">
                  {key.replace(/-/g, ' ')}
                </h4>
                <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Deploy structure</p>
              </div>
            </button>
          ))}
        </div>
      </Modal>

      <Modal
        isOpen={isEditContentOpen}
        onClose={() => setIsEditContentOpen(false)}
        title={`Sync ${contentEditingFooter?.name || 'Footer'} Data`}
        icon={FileJson}
        fullScreen
      >
        <div className="h-full">{renderMutationForm()}</div>
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Confirm Deletion" icon={Trash2}>
        <div className="text-center py-4">
          <div className="w-24 h-24 bg-rose-500/10 border border-rose-500/20 rounded-sm flex items-center justify-center mx-auto mb-8 text-rose-500 shadow-2xl shadow-rose-500/10">
            <Trash2 size={40} />
          </div>
          <h3 className="text-xl font-bold text-white italic mb-4">Wipe Configuration?</h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-10 max-w-[280px] mx-auto leading-relaxed">
            This operation is permanent. Data recovery is not available after deletion.
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
};

export default FooterManager;
