/*
|-----------------------------------------
| setting up YTVideoUploadManagerSingle for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useMemo, useState, useEffect } from 'react';
import { X, Loader2, RefreshCcw, Search, CheckCircle2, Zap, MonitorPlay, Film, ChevronLeft, ChevronRight, VideoIcon, Youtube, Code } from 'lucide-react';

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
  uploaderPlace?: string;
  createdAt: string;
}

interface MediaResponse {
  data: MediaItem[];
  total: number;
  page: number;
  limit: number;
}

interface InternalYouTubeVaultProps {
  onVideoSelect: (val: { name: string; url: string }) => void;
  selectedUrl: string;
}

const InternalYouTubeVault = ({ onVideoSelect, selectedUrl }: InternalYouTubeVaultProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [iframeCode, setIframeCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const ITEMS_PER_PAGE = 6;

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
    contentType: 'video',
    status: 'active',
  }) as { data: MediaResponse | undefined; isLoading: boolean; isFetching: boolean };

  const [addMedia] = useAddMediaMutation();

  const availableVideos = useMemo(() => response?.data || [], [response]);
  const totalPages = useMemo(() => Math.ceil((response?.total || 0) / ITEMS_PER_PAGE) || 1, [response]);

  const handleProcessImport = async () => {
    if (!iframeCode.trim()) {
      toast.warn('Please paste iframe from YouTube');
      return;
    }

    setIsProcessing(true);
    try {
      const match = iframeCode.match(/src="([^"]+)"/);
      const url = match ? match[1] : iframeCode.trim();

      const payload = {
        name: `YT_STREAM_${Date.now()}`,
        url: url,
        status: 'active',
        contentType: 'video',
        uploaderPlace: 'youtube',
      };

      const result = await addMedia(payload).unwrap();
      toast.success('YouTube Asset Integrated');
      onVideoSelect({ name: result.name, url: result.url });
      setIframeCode('');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to process YouTube asset');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-[90vh] md:h-[85vh] backdrop-blur-3xl rounded-sm overflow-hidden bg-black/60 border border-white/20 shadow-2xl">
      <DialogHeader className="p-6 border-b border-white/10 bg-white/5">
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
              placeholder="SEARCH YOUTUBE VAULT..."
              className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/20"
            />
          </div>
          <div className="hidden">
            <DialogTitle />
            <DialogDescription />
          </div>
        </div>
      </DialogHeader>

      <div className="flex-1 relative overflow-hidden">
        <ScrollArea className="h-full w-full p-8">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-20 h-20 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full"
                />
                <Zap className="absolute inset-0 m-auto w-8 h-8 text-indigo-500 animate-pulse" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400">Syncing Grid...</span>
            </div>
          ) : availableVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {availableVideos.map((item, idx) => {
                  const isSelected = selectedUrl === item.url;
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => onVideoSelect({ name: item.name, url: item.url })}
                      className="group flex flex-col gap-3"
                    >
                      <div
                        className={`relative aspect-video rounded-sm overflow-hidden border cursor-pointer transition-all duration-500 
                        ${isSelected ? 'border-indigo-500 ring-1 ring-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.2)]' : 'border-white/10 hover:border-white/30'}
                      `}
                      >
                        <div className="absolute inset-0 bg-black flex items-center justify-center">
                          <iframe
                            src={item.url}
                            className="absolute inset-0 w-full h-full pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                        </div>
                        {isSelected && (
                          <div className="absolute inset-0 bg-indigo-500/10 backdrop-blur-[2px] flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-indigo-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 px-1">
                        <Youtube className={`w-3 h-3 ${isSelected ? 'text-indigo-400' : 'text-white/30'}`} />
                        <span className={`text-[10px] font-bold truncate uppercase tracking-tighter ${isSelected ? 'text-indigo-400' : 'text-white/50'}`}>
                          {item.name}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 opacity-20">
              <Film className="w-16 h-16 animate-pulse mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest">Vault Empty</p>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="p-6 border-t border-white/10 bg-white/5 space-y-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Code className="w-3.5 h-3.5 text-indigo-400" />
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Import YouTube Embed</label>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <textarea
              value={iframeCode}
              onChange={e => setIframeCode(e.target.value)}
              placeholder='<iframe src="https://www.youtube.com/embed/..." ...></iframe>'
              className="flex-1 bg-black/40 border border-white/10 rounded-sm p-3 text-[11px] font-mono text-indigo-300 focus:outline-none focus:border-indigo-500/50 min-h-[70px] transition-all resize-none"
            />
            <Button
              onClick={handleProcessImport}
              disabled={isProcessing}
              variant="outlineGlassy"
              className="h-auto px-8 bg-indigo-500/10 border-indigo-500/30 hover:bg-indigo-500/20 text-indigo-400"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Youtube className="w-4 h-4 mr-2" />}
              <span className="text-[10px] font-black uppercase tracking-widest">Process & Link</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Button
              variant="outlineGlassy"
              size="sm"
              className="px-2"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isFetching}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-sm text-[10px] font-black text-white/60">
              {currentPage} / {totalPages}
            </div>
            <Button
              variant="outlineGlassy"
              size="sm"
              className="px-2"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || isFetching}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[9px] font-black uppercase tracking-widest text-white/20">System Status: Operational</p>
        </div>
      </div>
    </div>
  );
};

export default function YouTubeVideoUploadManagerSingle({
  value,
  onChange,
  label = 'YOUTUBE SOURCE',
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
          <Youtube className="w-4 h-4 text-red-500" />
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{label}</label>
        </div>
        <AnimatePresence>
          {value?.url && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <Button variant="outlineFire" size="sm" onClick={() => onChange({ name: '', url: '' })} className="min-w-1">
                <X className="w-3 h-3" /> Remove
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="group relative w-full aspect-video rounded-sm backdrop-blur-3xl transition-all duration-700 cursor-pointer overflow-hidden flex flex-col items-center justify-center border border-white/10 hover:border-indigo-500/40 bg-white/[0.02]">
            {value?.url ? (
              <div className="w-full h-full relative">
                <iframe src={value.url} className="w-full h-full pointer-events-none" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 px-8 py-4 rounded-sm bg-indigo-500/10 border border-indigo-500/30 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400"
                  >
                    <RefreshCcw className="w-4 h-4 animate-spin-slow" />
                    RELINK SOURCE
                  </motion.div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-sm">
                  <div className="flex items-center gap-2 truncate">
                    <VideoIcon className="w-3 h-3 text-indigo-400" />
                    <span className="text-[9px] font-black text-white tracking-widest truncate uppercase">{value.name || 'ACTIVE_YOUTUBE_STREAM'}</span>
                  </div>
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6">
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                    boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 40px rgba(99,102,241,0.1)', '0 0 0px rgba(99,102,241,0)'],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-16 h-16 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center"
                >
                  <MonitorPlay className="w-8 h-8 text-white/20" />
                </motion.div>
                <div className="text-center space-y-2 px-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/80 group-hover:text-indigo-400 transition-colors">
                    No Asset Deployed
                  </p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">Select from YouTube Vault</p>
                </div>
              </div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="bg-transparent border border-white/40 p-0 shadow-none overflow-hidden max-w-5xl w-[95vw] text-white mt-8">
          <InternalYouTubeVault
            selectedUrl={value?.url}
            onVideoSelect={val => {
              onChange(val);
              setIsOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
