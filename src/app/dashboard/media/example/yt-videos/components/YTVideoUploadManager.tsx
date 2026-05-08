/*
|-----------------------------------------
| setting up YTVideoUploadManager for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useMemo, useState, useEffect } from 'react';
import { X, Loader2, Search, CheckCircle2, Youtube, Plus, MonitorPlay, ChevronLeft, ChevronRight, Film, Code, Zap } from 'lucide-react';

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

interface YouTubeVaultProps {
  onVideoToggle: (item: { url: string; name: string }) => void;
  selectedVideos: { url: string; name: string }[];
}

const InternalYouTubeVault = ({ onVideoToggle, selectedVideos }: YouTubeVaultProps) => {
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

      if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
        toast.error('Invalid YouTube source detected');
        return;
      }

      const newMedia = {
        name: `YT_ASSET_${Date.now()}`,
        url: url,
        status: 'active',
        contentType: 'video',
        uploaderPlace: 'youtube',
      };

      const result = await addMedia(newMedia).unwrap();
      toast.success('YouTube Asset Pipeline Integrated');
      onVideoToggle({ url: result.url, name: result.name });
      setIframeCode('');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to link YouTube asset');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-[90vh] md:h-[85vh] backdrop-blur-3xl rounded-sm overflow-hidden bg-black/40 border border-white/10 shadow-2xl">
      <DialogHeader className="p-6 border-b border-white/5 bg-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isRefetching ? 'text-indigo-500 animate-pulse' : 'text-white/20'}`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="SEARCH YOUTUBE ARCHIVE..."
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
                  className="w-16 h-16 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full"
                />
                <Zap className="absolute inset-0 m-auto w-6 h-6 text-indigo-500/40" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 animate-pulse">Syncing Vault...</span>
            </div>
          ) : availableVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {availableVideos.map((item, idx) => {
                  const isSelected = selectedVideos.some(v => v.url === item.url);
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => onVideoToggle({ url: item.url, name: item.name })}
                      className={`group relative aspect-video rounded-sm border cursor-pointer transition-all duration-500 ${
                        isSelected ? 'border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.2)]' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="absolute inset-0 bg-neutral-900/80 flex items-center justify-center overflow-hidden">
                        <iframe src={item.url} className="w-full h-full pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                          <Youtube className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-white/40'}`} />
                          <span className="text-[9px] font-bold text-white/60 truncate max-w-[120px] uppercase tracking-tighter">{item.name}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute inset-0 bg-indigo-500/10 backdrop-blur-[2px] flex items-center justify-center">
                          <CheckCircle2 className="w-8 h-8 text-indigo-500" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 opacity-20">
              <Film className="w-16 h-16 mb-4 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-widest">No Assets Indexed</p>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="p-6 border-t border-white/10 bg-black/40 space-y-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Code className="w-3.5 h-3.5 text-indigo-400" />
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Import YouTube Node</label>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <textarea
              value={iframeCode}
              onChange={e => setIframeCode(e.target.value)}
              placeholder="Paste <iframe> code here..."
              className="flex-1 bg-white/5 border border-white/10 rounded-sm p-3 text-[11px] font-mono text-indigo-300 focus:outline-none focus:border-indigo-500/50 min-h-[60px] transition-all resize-none"
            />
            <Button
              onClick={handleProcessImport}
              disabled={isProcessing}
              variant="outlineGlassy"
              className="h-auto py-4 px-8 bg-indigo-500/10 border-indigo-500/30 hover:bg-indigo-500/20 text-indigo-400"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              <span className="text-[10px] font-black uppercase tracking-widest">Process & Import</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Button
              variant="outlineGlassy"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isFetching}
              className="px-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-sm text-[10px] font-bold text-white/60">
              {currentPage} / {totalPages}
            </div>
            <Button
              variant="outlineGlassy"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || isFetching}
              className="px-2"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[9px] font-black uppercase tracking-widest text-white/30">YT-API Signal: Stable</p>
        </div>
      </div>
    </div>
  );
};

export default function YouTubeVideoUploadManager({
  value,
  onChange,
  label = 'YouTube Assets',
}: {
  value: { url: string; name: string }[];
  onChange: (val: { url: string; name: string }[]) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleVideo = (item: { url: string; name: string }) => {
    const exists = value.some(v => v.url === item.url);
    if (exists) {
      onChange(value.filter(v => v.url !== item.url));
    } else {
      onChange([...value, item]);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-white/90">
            <Youtube className="w-4 h-4 text-red-500" />
            <label className="text-[11px] font-black uppercase tracking-[0.2em]">{label}</label>
          </div>
          <span className="text-[9px] font-bold text-white/40 tracking-widest uppercase">{value.length} Linked Nodes</span>
        </div>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {value.length > 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <Button variant="outlineFire" size="sm" onClick={() => onChange([])} className="min-w-1">
                  <X className="w-3 h-3" /> Clear All
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outlineGlassy" size="sm" className="min-w-1">
                <Plus className="w-3.5 h-3.5" /> Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl bg-transparent p-0 shadow-none border-white/40 border rounded-sm overflow-hidden mt-8 text-white">
              <InternalYouTubeVault selectedVideos={value} onVideoToggle={toggleVideo} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="min-h-[280px] rounded-sm p-6 border border-white/5 bg-white/2 backdrop-blur-xl relative overflow-hidden">
        <ScrollArea className="h-full w-full">
          {value.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {value.map((item, idx) => (
                  <motion.div
                    key={item.url}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group relative aspect-video rounded-sm overflow-hidden border border-white/10"
                  >
                    <iframe src={item.url} className="w-full h-full pointer-events-none" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/90 px-4 text-center truncate w-full">{item.name}</p>
                      <Button
                        variant="outlineFire"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => onChange(value.filter(v => v.url !== item.url))}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-6 opacity-30">
              <div className="flex gap-4">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                    className="w-12 h-12 rounded-sm border border-white/20 flex items-center justify-center bg-white/5"
                  >
                    <MonitorPlay className="w-6 h-6" />
                  </motion.div>
                ))}
              </div>
              <div className="text-center">
                <p className="text-xs font-black uppercase tracking-[0.3em]">No Content Selected</p>
                <p className="text-[9px] font-bold uppercase mt-1 tracking-widest">Interface Ready for Ingestion</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
