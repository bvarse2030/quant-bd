/*
|-----------------------------------------
| setting up PdfUploadManager for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import Link from 'next/link';
import { toast } from 'react-toastify';
import { FaFilePdf } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useMemo, useState, useEffect } from 'react';
import { X, Loader2, Ghost, Search, CheckCircle2, Zap, ChevronLeft, ChevronRight, Plus, Files, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { UploadButton } from '@/lib/uploadthing';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetMediasQuery, useAddMediaMutation } from '@/redux/features/media/mediaSlice';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface MediaItem {
  _id: string;
  name: string;
  url: string;
  status: string;
  contentType: string;
  createdAt: string;
  updatedAt: string;
}

interface MediaResponse {
  data: MediaItem[];
  total: number;
  page: number;
  limit: number;
}

interface InternalPdfVaultProps {
  onPdfToggle: (item: { url: string; name: string }) => void;
  selectedPdfs: { url: string; name: string }[];
}

const InternalPdfVault = ({ onPdfToggle, selectedPdfs }: InternalPdfVaultProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: response,
    isLoading: isFetching,
    isFetching: isRefetching,
  } = useGetMediasQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    q: debouncedSearch,
    contentType: 'pdf',
    status: 'active',
  }) as { data: MediaResponse | undefined; isLoading: boolean; isFetching: boolean };

  const [addMedia] = useAddMediaMutation();
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);

  const availablePdfs = useMemo(() => response?.data || [], [response]);

  const totalPages = useMemo(() => {
    if (!response?.total || !response?.limit) return 1;
    return Math.ceil(response.total / response.limit);
  }, [response]);

  const handleUploadComplete = async (res: { url: string; name: string }[]) => {
    if (res && res[0]) {
      try {
        await addMedia({
          url: res[0].url,
          name: res[0].name || 'PDF_Document',
          contentType: 'pdf',
          status: 'active',
        }).unwrap();
        toast.success('Successfully Uploaded');
        onPdfToggle({ url: res[0].url, name: res[0].name || 'PDF_Document' });
      } catch {
        toast.error('Failed to Uploaded');
      } finally {
        setIsUploadingLocal(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-[90vh] md:h-[80vh] backdrop-blur-3xl rounded-sm overflow-hidden shadow-2xl">
      <DialogHeader className="p-6 border-b border-white/10 bg-white/5 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isRefetching ? 'text-indigo-500 animate-pulse' : 'text-white/20'}`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="SEARCH DOCUMENT VAULT..."
              className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/20"
            />
          </div>
          <div className="hidden">
            <DialogTitle> </DialogTitle>
            <DialogDescription> </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="flex-1 relative overflow-hidden">
        <ScrollArea className="h-full w-full p-8">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full"
                />
                <Zap className="absolute inset-0 m-auto w-6 h-6 text-indigo-500/40" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 animate-pulse">Scanning Archive...</span>
            </div>
          ) : availablePdfs.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {availablePdfs.map((item, idx) => {
                  const isSelected = selectedPdfs.some(v => v.url === item.url);
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.03, type: 'spring', stiffness: 260, damping: 20 }}
                      onClick={() => onPdfToggle({ url: item.url, name: item.name })}
                      className={`relative aspect-[3/4] rounded-sm border cursor-pointer transition-all duration-500 group
                        ${isSelected ? 'border-indigo-500 scale-95 shadow-[0_0_40px_rgba(99,102,241,0.3)]' : 'border-white/5 hover:border-white/20 hover:scale-105 shadow-xl'}
                      `}
                    >
                      <div className="absolute inset-0 bg-white/5 flex flex-col items-center justify-center p-4">
                        <FaFilePdf className="w-24 h-24 text-white/50 group-hover:text-white/20 transition-all duration-500 group-hover:scale-110" />
                        <div className="mt-4 text-center w-full">
                          <h3
                            className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 truncate w-full ${isSelected ? 'text-indigo-400' : 'text-white/50 group-hover:text-white'}
                                                `}
                          >
                            {item.name || 'Untitled PDF'}
                          </h3>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center backdrop-blur-[2px]">
                          <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="bg-indigo-500 text-white rounded-sm p-2 shadow-2xl"
                          >
                            <CheckCircle2 className="w-6 h-6" />
                          </motion.div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 opacity-20 space-y-6">
              <Ghost className="w-20 h-20 animate-bounce" />
              <div className="text-center">
                <h3 className="text-2xl font-black uppercase tracking-[0.4em] text-white">Archive Empty</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-2 text-white/60">Zero PDF signatures detected</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 border-t border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1 border-white/20 hover:bg-white/10"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isFetching}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </Button>

          <div className="flex items-center gap-3 px-5 h-9 rounded-sm bg-white/5 border border-white/10">
            <span className="text-[11px] font-black text-white">{currentPage}</span>
            <span className="text-[10px] font-black text-white/20">/</span>
            <span className="text-[11px] font-black text-white/60">{totalPages}</span>
          </div>

          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1 border-white/20 hover:bg-white/10"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || isFetching}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </Button>

          <div className="hidden sm:block ml-4">
            <p className="text-sm text-white/60">Total : {response?.total || 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <UploadButton
            endpoint="pdfUploader"
            appearance={{
              button: `bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-white/30 text-white backdrop-blur-xl shadow-lg shadow-blue-500/20 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-white/50 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] transition-all duration-300 h-8 rounded-md gap-1 max-w-[100px] text-sm`,
              allowedContent: 'hidden',
            }}
            content={{
              button({ ready }) {
                if (isUploadingLocal) return <Loader2 className="w-4 h-4 animate-spin" />;
                return (
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>{ready ? 'Upload' : 'Connecting...'}</span>
                  </div>
                );
              },
            }}
            onUploadBegin={() => setIsUploadingLocal(true)}
            onClientUploadComplete={handleUploadComplete}
            onUploadError={err => {
              setIsUploadingLocal(false);
              toast.error(err.message);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default function PdfUploadManager({
  value,
  onChange,
  label = 'PDF Documents',
}: {
  value: { url: string; name: string }[];
  onChange: (val: { url: string; name: string }[]) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const togglePdf = (item: { url: string; name: string }) => {
    const exists = value.some(v => v.url === item.url);
    if (exists) {
      onChange(value.filter(v => v.url !== item.url));
    } else {
      onChange([...value, item]);
    }
  };

  return (
    <div className="space-y-6 w-full group/container">
      <div className="flex items-center justify-between px-2 flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-start gap-2">
            <Files className="w-3.5 h-3.5" />
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{label}</label>
          </div>
          <p className="text-[8px] font-bold tracking-widest text-white/60">{value.length} Selected</p>
        </div>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {value.length > 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <Button variant="outlineFire" size="sm" onClick={() => onChange([])}>
                  <X className="w-3.5 h-3.5" /> Remove all
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outlineGlassy" size="sm">
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                Select
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl bg-transparent p-0 shadow-none text-white overflow-hidden border border-white/50 rounded-sm mt-8">
              <InternalPdfVault selectedPdfs={value} onPdfToggle={togglePdf} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="min-h-[250px] rounded-sm p-8 border border-white/10 backdrop-blur-3xl transition-all duration-500 hover:border-white/20">
        <ScrollArea className="w-full h-full">
          {value.length > 0 ? (
            <div className="grid grid-cols-1 gap-1 pb-4">
              <AnimatePresence mode="popLayout">
                {value.map((item, index) => (
                  <motion.div
                    key={item.url}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group relative transition-all duration-500 flex flex-col items-center justify-center shadow-2xl border border-white/30 rounded-sm pl-2"
                  >
                    <div className="w-full flex gap-1 items-center justify-start">
                      <div className="text-white text-sm">{index + 1}. </div>
                      <FaFilePdf className="w-6 h-6 text-white/50 group-hover:text-white/20 transition-all duration-500 group-hover:scale-110" />

                      <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase truncate w-full px-2">{item.name || 'PDF_DOC'}</span>
                      <div className="flex items-center justify-center gap-1 hover:underline">
                        <Eye className="w-4 h-4" />
                        <Link href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-50">
                          Preview
                        </Link>
                      </div>
                      <Button
                        onClick={() => onChange(value.filter(v => v.url !== item.url))}
                        variant="ghost"
                        size="sm"
                        className="min-w-1 h-7 w-7 text-rose-500/80"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-10 gap-6">
              <div className="flex gap-4">
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -10, 0],
                      boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 40px rgba(99,102,241,0.2)', '0 0 0px rgba(99,102,241,0)'],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.5,
                    }}
                    className="w-16 h-20 rounded-sm bg-white/20 border border-white/10 flex items-center justify-center"
                  >
                    <FaFilePdf className="w-24 h-24 text-white/50 group-hover:text-white/20 transition-all duration-500 group-hover:scale-110" />
                  </motion.div>
                ))}
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-white/90">No PDF Selected</p>
                <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase">Awaiting Document Selection</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
