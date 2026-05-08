/*
|-----------------------------------------
| setting up PdfUploadManagerSingle for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { toast } from 'react-toastify';
import { FaFilePdf } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useMemo, useState, useEffect } from 'react';
import { X, Loader2, Ghost, RefreshCcw, Search, CheckCircle2, Zap, FileText, Files, ChevronLeft, ChevronRight, FilePlus, Plus } from 'lucide-react';

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
  onPdfSelect: (val: { name: string; url: string }) => void;
  selectedUrl: string;
}

const InternalPdfVault = ({ onPdfSelect, selectedUrl }: InternalPdfVaultProps) => {
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
          name: res[0].name || 'PDF_Source',
          contentType: 'pdf',
          status: 'active',
        }).unwrap();
        toast.success('Successfully Uploaded');
        onPdfSelect({ name: res[0].name, url: res[0].url });
      } catch {
        toast.error('Failed to Uploaded');
      } finally {
        setIsUploadingLocal(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-[90vh] md:h-[80vh] backdrop-blur-3xl rounded-sm overflow-hidden shadow-2xl">
      <DialogHeader className="p-6 border-b border-white/50 bg-white/2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                isRefetching ? 'text-indigo-500 animate-pulse' : 'text-white/20'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="SEARCH PDF VAULT..."
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
                  className="w-20 h-20 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full"
                />
                <Zap className="absolute inset-0 m-auto w-8 h-8 text-indigo-500 animate-pulse" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500/60">Initializing Archive...</span>
            </div>
          ) : availablePdfs.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {availablePdfs.map((item, idx) => {
                  const isSelected = selectedUrl === item.url;
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.03, type: 'spring', stiffness: 260, damping: 20 }}
                      onClick={() => onPdfSelect({ name: item.name, url: item.url })}
                      className="group flex flex-col gap-3"
                    >
                      <div
                        className={`relative aspect-[3/4] rounded-sm overflow-hidden border cursor-pointer transition-all duration-500 
                        ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/50 ring-offset-2 ring-offset-black' : 'border-white/10 hover:border-white/30'}
                      `}
                      >
                        <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                          <FaFilePdf className="w-12 h-12 text-white/50 group-hover:text-white/20 transition-all duration-500 group-hover:scale-110" />
                        </div>

                        {isSelected && (
                          <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center backdrop-blur-[2px]">
                            <motion.div
                              initial={{ scale: 0, rotate: -45 }}
                              animate={{ scale: 1, rotate: 0 }}
                              className="bg-indigo-500 text-white rounded-sm p-3 shadow-2xl"
                            >
                              <CheckCircle2 className="w-6 h-6" />
                            </motion.div>
                          </div>
                        )}
                      </div>
                      <div className="-mt-1 flex items-center justify-start gap-2">
                        <FileText className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-white/40'}`} />
                        <h3
                          className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 truncate w-full
                            ${isSelected ? 'text-indigo-400' : 'text-white/50 group-hover:text-white'}
                          `}
                        >
                          {item.name || 'Untitled Document'}
                        </h3>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 opacity-30 space-y-6">
              <Ghost className="w-24 h-24 animate-bounce" />
              <div className="text-center">
                <h3 className="text-2xl font-black uppercase text-white">No Assets Found</h3>
                <p className="text-[10px] font-bold uppercase mt-3 text-white/60 tracking-widest">Awaiting new pdf uploads</p>
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

export default function PdfUploadManagerSingle({
  value,
  onChange,
  label = 'PDF',
}: {
  value: { name: string; url: string };
  onChange: (val: { name: string; url: string }) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4 w-full group/container">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Files className="w-3.5 h-3.5 text-indigo-50" />
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{label}</label>
        </div>
        <AnimatePresence>
          {value?.url && (
            <>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <Button variant="outlineFire" size="sm" onClick={() => onChange({ name: '', url: '' })}>
                  <X className="w-3.5 h-3.5" /> Remove
                </Button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="group relative w-full aspect-video rounded-sm backdrop-blur-3xl transition-all duration-500 cursor-pointer overflow-hidden flex flex-col items-center justify-center border border-white/10 hover:border-indigo-500/40 bg-white/[0.02]">
            {value?.url ? (
              <div className="w-full h-full relative flex flex-col items-center justify-center bg-white/[0.03]">
                <FaFilePdf className="w-24 h-24 text-white/50 group-hover:text-white/20 transition-all duration-500 group-hover:scale-110" />

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 px-8 py-4 rounded-sm bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[0.3em] text-white"
                  >
                    <RefreshCcw className="w-4 h-4 animate-[spin_4s_linear_infinite]" />
                    CHANGE ASSET
                  </motion.div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-sm">
                  <FileText className="w-3 h-3 text-indigo-400" />
                  <span className="text-[10px] font-bold text-white tracking-wider truncate flex-1">{value.name || 'ACTIVE_DOC'}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 40px rgba(99,102,241,0.2)', '0 0 0px rgba(99,102,241,0)'],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1 * 0.5,
                  }}
                  className="w-16 h-16 rounded-sm bg-white/20 border border-white/10 flex items-center justify-center"
                >
                  <FilePlus className="w-8 h-8 text-white/50" />
                </motion.div>
                <div className="text-center space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90 group-hover:text-white transition-colors">No pdf Selected</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">Click here to Select one</p>
                </div>
              </div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="bg-transparent border border-white/50 p-0 shadow-none overflow-hidden max-w-5xl w-[95vw] text-white mt-8">
          <InternalPdfVault
            selectedUrl={value?.url}
            onPdfSelect={val => {
              onChange(val);
              setIsOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
