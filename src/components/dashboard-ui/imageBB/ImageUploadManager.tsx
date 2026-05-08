/*
|-----------------------------------------
| setting up ImageUploadManager for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import Image from 'next/image';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import imageCompression from 'browser-image-compression';
import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Plus, X, UploadCloud, Loader2, ImageIcon, Ghost, Search, CheckCircle2, Zap, ChevronLeft, ChevronRight, ImagesIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
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

interface InternalImageDialogProps {
  onImageToggle: (item: { url: string; name: string }) => void;
  selectedImages: { url: string; name: string }[];
}

const InternalImageVault = ({ onImageToggle, selectedImages }: InternalImageDialogProps) => {
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
    contentType: 'image',
    status: 'active',
  }) as {
    data: MediaResponse | undefined;
    isLoading: boolean;
    isFetching: boolean;
  };

  const [addMedia, { isLoading: isAdding }] = useAddMediaMutation();
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableImages = useMemo(() => response?.data || [], [response]);

  const totalPages = useMemo(() => {
    if (!response?.total || !response?.limit) return 1;
    return Math.ceil(response.total / response.limit);
  }, [response]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLocal(true);
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      const formData = new FormData();
      formData.append('image', compressedFile);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        await addMedia({
          url: data.data.url,
          name: file.name,
          contentType: 'image',
          uploaderPlace: 'imageBB',
          status: 'active',
        }).unwrap();
        toast.success('Image successfully uploaded');
        onImageToggle({ url: data.data.url, name: file.name });
      }
    } catch {
      toast.error('Image upload failed');
    } finally {
      setIsUploadingLocal(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-[90vh] md:h-[80vh] backdrop-blur-[150px] rounded-sm overflow-hidden bg-white/2 shadow-2xl">
      <DialogHeader className="p-6 border-b border-white/5 bg-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 -mt-1">
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
              placeholder="SEARCH ASSET VAULT..."
              className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-white/20"
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
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500/60">Loading...</span>
            </div>
          ) : availableImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {availableImages.map((item, idx) => {
                  const isSelected = selectedImages.some(img => img.url === item.url);
                  return (
                    <motion.div
                      key={item.url}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        delay: idx * 0.03,
                        type: 'spring',
                        stiffness: 260,
                        damping: 20,
                      }}
                      className="flex flex-col gap-3 group"
                    >
                      <div
                        onClick={() => onImageToggle({ url: item.url, name: item.name })}
                        className={`relative aspect-square rounded-sm overflow-hidden cursor-pointer transition-all duration-500 
                          ${isSelected ? 'scale-[0.98] shadow-[0_0_40px_rgba(99,102,241,0.3)]' : 'hover:scale-[1.02] shadow-2xl'}
                        `}
                      >
                        <Image
                          src={item.url}
                          fill
                          alt={item.name || 'Gallery Image'}
                          className={`object-cover transition-transform duration-1000 ease-out border border-white/40 rounded-sm 
                            ${isSelected ? 'scale-110' : 'group-hover:scale-110'}
                            `}
                          unoptimized
                        />

                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-indigo-600/20 backdrop-blur-[3px] flex items-center justify-center overflow-hidden border border-white/60 rounded-sm"
                            >
                              <motion.div
                                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                exit={{ scale: 0, rotate: 180, opacity: 0 }}
                                transition={{ type: 'spring', damping: 12 }}
                                className="bg-white text-indigo-600 rounded-sm p-4 shadow-2xl"
                              >
                                <CheckCircle2 className="w-8 h-8" />
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="absolute inset-0 pointer-events-none border-[1px] border-white/10 rounded-sm" />
                      </div>

                      <div className="-mt-1 flex items-center justify-start gap-2 px-1">
                        <ImageIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-white/40'}`} />
                        <h3
                          className={`text-sm font-medium transition-colors duration-300 truncate w-full
                            ${isSelected ? 'text-indigo-400' : 'text-white/50 group-hover:text-white'}
                          `}
                        >
                          {item.name || 'Untitled Asset'}
                        </h3>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 opacity-30 space-y-6">
              <Ghost className="w-24 h-24 animate-bounce" />
              <div className="text-center">
                <h3 className="text-2xl font-black uppercase ">Ops! Nothing was found!</h3>
                <p className="text-[10px] font-bold uppercase mt-3">Please Upload a New Image</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 border-t border-white/5 bg-white/5">
        <div className="flex items-center gap-3">
          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isFetching}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </Button>

          <div className="flex items-center gap-3 px-5 h-8 rounded-sm bg-white/5 border border-white/10">
            <span className="text-[11px] text-white">{currentPage}</span>
            <span className="text-[10px] text-white/20">/</span>
            <span className="text-[11px] text-white/60">{totalPages}</span>
          </div>

          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || isFetching}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </Button>

          <div className="hidden sm:block ml-4">
            <p className="text-sm text-white/60 ">Total : {response?.total || 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageUpload} />
          <Button onClick={() => fileInputRef.current?.click()} disabled={isUploadingLocal || isAdding} variant="outlineGlassy" size="sm">
            {isUploadingLocal || isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            {isAdding || isUploadingLocal ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function ImageUploadManager({
  value,
  onChange,
  label = 'Images',
}: {
  value: { url: string; name: string }[];
  onChange: (val: { url: string; name: string }[]) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleImage = (item: { url: string; name: string }) => {
    const exists = value.some(v => v.url === item.url);
    if (exists) {
      onChange(value.filter(v => v.url !== item.url));
    } else {
      onChange([...value, item]);
    }
  };

  return (
    <div className="space-y-4 w-full h-full">
      <div className="flex items-center justify-between px-1 flex-col md:flex-row">
        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-start gap-2">
            <ImagesIcon className="w-3.5 h-3.5" />
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{label}</label>
          </div>
          <p className="text-[8px] font-bold tracking-widest text-white/60">{value.length} Assets Linked</p>
        </div>

        <div className="flex items-center gap-2 mt-2 md:mt-0">
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
              <Button variant="outlineGlassy" size="sm" className="min-w-1">
                <Plus className="w-3.5 h-3.5" /> SELECT
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-transparent p-0 shadow-none overflow-hidden max-w-5xl w-[95vw] text-white mt-4 border-white/50 border rounded-sm">
              <InternalImageVault selectedImages={value} onImageToggle={toggleImage} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <ScrollArea className="w-full h-[300px]">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 p-8 rounded-sm bg-white/2 border border-white/50 backdrop-blur-3xl min-h-[20vh] transition-all">
          <AnimatePresence mode="popLayout">
            {value.length > 0 ? (
              value.map((item, idx) => (
                <motion.div
                  key={item.url}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="flex flex-col gap-3 group"
                >
                  <div className="relative aspect-square rounded-sm bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl shadow-2xl overflow-hidden group-hover:border-indigo-500/30 transition-all duration-500">
                    <Image src={item.url} fill alt={item.name} className="object-cover transition-transform duration-700 group-hover:scale-110" unoptimized />
                    <div className="absolute inset-0 bg-black/60 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button
                        type="button"
                        onClick={() => onChange(value.filter(u => u.url !== item.url))}
                        className="p-3 cursor-pointer rounded-sm bg-rose-500/20 border border-rose-500/50 text-rose-400 hover:bg-rose-500 hover:text-white transition-all duration-300 transform scale-90 group-hover:scale-100 min-w-1"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                    <Zap className="absolute -top-1 -right-1 w-4 h-4 text-indigo-500/40 animate-pulse pointer-events-none z-10" />
                  </div>
                  <div className="flex items-center gap-2 px-1 opacity-70 group-hover:opacity-100 transition-opacity overflow-hidden">
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="text-[11px] font-medium text-white/80 truncate">{item.name || 'Untitled'}</span>
                  </div>
                </motion.div>
              ))
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
                      className="w-16 h-16 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center"
                    >
                      <ImageIcon className="w-8 h-8 text-white/10" />
                    </motion.div>
                  ))}
                </div>
                <div className="text-center space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90 group-hover:text-white transition-colors">No Images Selected</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">Click here to Select one</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}
