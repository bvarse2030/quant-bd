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
  Eye,
  Send,
  Play,
  Plus,
  Code,
  Video,
  Music,
  Cloud,
  Ghost,
  Trash2,
  Upload,
  Search,
  Volume2,
  Loader2,
  Youtube,
  FileText,
  FileCode,
  Database,
  RefreshCw,
  ImageIcon,
  VideoIcon,
  LayoutGrid,
  Headphones,
  ChevronLeft,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import imageCompression from 'browser-image-compression';
import React, { useState, useMemo, useEffect } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UploadButton } from '@/lib/uploadthing';
import { CustomLink } from '@/components/common/LinkButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useGetMediasQuery, useAddMediaMutation, useUpdateMediaMutation, useDeleteMediaMutation } from '@/redux/features/media/mediaSlice';

import { Tabs, TabsList, TabsTrigger } from './components/tabs';

type MediaType = 'all' | 'video' | 'image' | 'pdf' | 'docx' | 'audio';
type MediaStatus = 'active' | 'trash';

interface MediaItem {
  _id: string;
  url: string;
  name?: string;
  contentType: MediaType;
  status: MediaStatus;
  uploaderPlace?: string;
  createdAt: string;
}

export default function MediaDashboard() {
  const [activeTab, setActiveTab] = useState<MediaType>('all');
  const [activeStatus, setActiveStatus] = useState<MediaStatus>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isYTMode, setIsYTMode] = useState(false);
  const [ytInput, setYtInput] = useState('');

  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
  const [mediaToDelete, setMediaToDelete] = useState<MediaItem | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetMediasQuery({
    page: currentPage,
    limit: pageSize,
    q: debouncedSearch,
    contentType: activeTab,
    status: activeStatus,
  });

  const [addMedia] = useAddMediaMutation();
  const [updateMedia] = useUpdateMediaMutation();
  const [deleteMedia] = useDeleteMediaMutation();

  const items = useMemo(() => response?.data || [], [response]);
  const totalItems = response?.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const handleUpdateStatus = async (id: string, newStatus: MediaStatus) => {
    setProcessingId(id);
    try {
      await updateMedia({ id, status: newStatus }).unwrap();
      toast.success(`Moved to ${newStatus}`);
    } catch {
      toast.error('Sync failed');
    } finally {
      setProcessingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!mediaToDelete) return;
    setProcessingId(mediaToDelete._id);
    setIsDeleteDialogOpen(false);
    try {
      await deleteMedia({ id: mediaToDelete._id }).unwrap();
      toast.success('Asset purged');
    } catch {
      toast.error('Deletion failed');
    } finally {
      setProcessingId(null);
      setMediaToDelete(null);
    }
  };

  const handleYTImport = async () => {
    if (!ytInput.trim()) return;
    const match = ytInput.match(/src="([^"]+)"/);
    const url = match ? match[1] : ytInput.trim();

    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      toast.error('Invalid YouTube source');
      return;
    }

    try {
      await addMedia({
        name: `YT_STREAM_${Date.now()}`,
        url: url,
        status: 'active',
        contentType: 'video',
        uploaderPlace: 'youtube',
      }).unwrap();
      toast.success('YouTube node indexed');
      setIsAddDialogOpen(false);
      setIsYTMode(false);
      setYtInput('');
    } catch {
      toast.error('Failed to link stream');
    }
  };

  const handleImageBBStore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const toastId = toast.loading('Processing image stream...');
    try {
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
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
          status: 'active',
          uploaderPlace: 'imageBB',
        }).unwrap();
        toast.update(toastId, { render: 'Neural link established', type: 'success', isLoading: false, autoClose: 2000 });
        setIsAddDialogOpen(false);
      }
    } catch {
      toast.update(toastId, { render: 'Link failed', type: 'error', isLoading: false, autoClose: 2000 });
    }
  };

  return (
    <main className="min-h-screen p-2 bg-transparent text-white selection:bg-indigo-500/30 pb-20 -ml-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-6">
        <header className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-sm p-6 shadow-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h1 className="text-4xl font-black bg-gradient-to-r from-white via-white/80 to-white/30 bg-clip-text text-transparent italic tracking-tighter uppercase">
              Media
            </h1>
            <p className="text-[10px] text-indigo-400 font-mono uppercase tracking-[0.2em] flex items-center gap-2">
              <Cloud size={14} className="animate-pulse" /> Nodes: {totalItems}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <CustomLink href="/dashboard/media/example/yt-videos" variant="outlineGlassy" size="sm">
              <Youtube size={16} className="" /> YouTube
            </CustomLink>
            <CustomLink href="/dashboard/media/example/uploadthings" variant="outlineGlassy">
              <Upload size={16} /> Uploadthings
            </CustomLink>
            <CustomLink href="/dashboard/media/example/imagebb" variant="outlineGlassy">
              <Database size={16} /> Image BB
            </CustomLink>
            <Button size="sm" variant="outlineGlassy" onClick={() => refetch()} disabled={isFetching} className="min-w-1">
              <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)} variant="outlineGlassy" size="sm" className="bg-white/5 border-white/40 min-w-1">
              <Plus size={18} className="" /> Add
            </Button>
          </div>
        </header>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-sm p-3 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-4">
          <Tabs
            value={activeTab}
            onValueChange={v => {
              setActiveTab(v as MediaType);
              setCurrentPage(1);
            }}
          >
            <TabsList className="bg-transparent h-10 p-0 gap-2">
              {[
                { id: 'all', icon: LayoutGrid, l: 'All' },
                { id: 'image', icon: ImageIcon, l: 'Img' },
                { id: 'video', icon: Video, l: 'Video' },
                { id: 'audio', icon: Headphones, l: 'Audio' },
                { id: 'pdf', icon: FileText, l: 'PDF' },
              ].map(t => (
                <TabsTrigger key={t.id} value={t.id} className="h-8 px-4 text-[10px] uppercase font-black tracking-widest">
                  <t.icon size={12} className="" /> <span className="hidden md:flex">{t.l}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex gap-2">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-indigo-400" />
              <Input
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white/5 border-white/10 pl-10 h-8 text-xs w-48"
                placeholder="Search Archive..."
              />
            </div>
            <div className="flex bg-white/5 p-1 rounded-sm">
              {['active', 'trash'].map(s => (
                <Button
                  key={s}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setActiveStatus(s as MediaStatus);
                    setCurrentPage(1);
                  }}
                  className={`h-6 px-3 text-[9px] uppercase font-black tracking-widest ${activeStatus === s ? 'bg-white/10' : 'text-white/30'}`}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <section className="min-h-[60vh] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 content-start">
          <AnimatePresence>
            {isLoading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-40 gap-4 opacity-20">
                <Loader2 size={40} className="animate-spin" />
                <span className="text-[10px] font-mono tracking-[0.5em] uppercase">Synchronizing</span>
              </div>
            ) : items.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-40 gap-4 opacity-20 text-center">
                <Ghost size={40} className="animate-pulse" />
                <span className="text-[10px] font-mono tracking-[0.5em] uppercase">Nothing was found</span>
              </div>
            ) : (
              items.map((item: MediaItem, idx: number) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`group relative backdrop-blur-3xl bg-white/[0.03] border border-white/10 rounded-sm overflow-hidden flex flex-col hover:border-white/30 transition-all shadow-xl ${
                    processingId === item._id ? 'opacity-50 pointer-events-none scale-95' : ''
                  }`}
                >
                  <div className="relative aspect-video bg-black/60 overflow-hidden">
                    {item.contentType === 'image' && (
                      <Image
                        src={item.url}
                        alt=""
                        fill
                        className="object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000"
                        unoptimized
                      />
                    )}
                    {item.contentType === 'video' &&
                      (item.uploaderPlace === 'youtube' ? (
                        <div className="w-full h-full relative pointer-events-none">
                          <iframe
                            src={item.url}
                            className="w-full h-full border-none opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <Youtube size={40} className="text-red-500/80" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full relative">
                          <video src={item.url} className="w-full h-full object-cover opacity-60" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play size={24} className="text-white fill-white ml-1" />
                          </div>
                        </div>
                      ))}
                    <div className="absolute inset-0 bg-gradient-to-t from-black opacity-0 group-hover:opacity-100 transition-all flex items-end p-3 gap-2">
                      <Button
                        size="sm"
                        variant="outlineGlassy"
                        className="h-8 w-full text-[10px] uppercase font-black"
                        onClick={() => {
                          setPreviewMedia(item);
                          setIsPreviewDialogOpen(true);
                        }}
                      >
                        <Eye size={12} className="mr-2" /> View
                      </Button>
                      <Button
                        size="sm"
                        variant="outlineFire"
                        className="h-8 px-2"
                        disabled={processingId === item._id}
                        onClick={() =>
                          activeStatus === 'active' ? handleUpdateStatus(item._id, 'trash') : (setMediaToDelete(item), setIsDeleteDialogOpen(true))
                        }
                      >
                        {processingId === item._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 flex-1 space-y-1 bg-white/[0.02] border-t border-white/5">
                    <div className="flex items-center gap-2">
                      {item.uploaderPlace === 'youtube' ? <Youtube size={12} className="text-red-500" /> : <Cloud size={12} className="text-indigo-400" />}
                      <p className="text-[10px] font-black truncate tracking-widest uppercase text-white/80">{item.name || 'Untitled'}</p>
                    </div>
                    <div className="flex justify-between text-[8px] font-mono text-white/20 uppercase">
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      <span className="text-indigo-400/50">{item.contentType}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </section>

        {totalItems > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col lg:flex-row justify-between items-center gap-4 mt-8 p-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-sm shadow-xl"
          >
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
              Tracking <span className="text-indigo-50/50">{(currentPage - 1) * pageSize + 1}</span> -{' '}
              <span className="text-indigo-50/50">{Math.min(currentPage * pageSize, totalItems)}</span> of <span className="text-white">{totalItems}</span>{' '}
              Nodes
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-2 lg:border-r border-white/10 lg:pr-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">Size:</span>
                <div className="flex bg-black/20 p-1 rounded-sm border border-white/5">
                  {[10, 20, 50, 100].map(size => (
                    <button
                      key={size}
                      onClick={() => {
                        setPageSize(size);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1 text-[9px] font-black tracking-widest rounded-sm transition-all uppercase ${
                        pageSize === size ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60 hover:bg-white/5'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outlineGlassy"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || isFetching}
                  className="h-8 px-4 text-[10px] uppercase font-black tracking-widest disabled:opacity-30 bg-white/5 border-white/10 hover:bg-white/10"
                >
                  <ChevronLeft size={14} className="mr-2" /> Prev
                </Button>

                <div className="px-4 py-2 bg-black/20 border border-white/5 rounded-sm text-[10px] font-black tracking-widest uppercase text-white/60">
                  Page <span className="text-indigo-400">{currentPage}</span> / {totalPages}
                </div>

                <Button
                  variant="outlineGlassy"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || isFetching || totalPages === 0}
                  className="h-8 px-4 text-[10px] uppercase font-black tracking-widest disabled:opacity-30 bg-white/5 border-white/10 hover:bg-white/10"
                >
                  Next <ChevronRight size={14} className="ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      <Dialog
        open={isAddDialogOpen}
        onOpenChange={open => {
          setIsAddDialogOpen(open);
          if (!open) setIsYTMode(false);
        }}
      >
        <DialogContent className="backdrop-blur-3xl bg-black/90 border-white/20 shadow-2xl max-w-2xl p-0 overflow-hidden text-white mt-12">
          <DialogHeader className="p-8 pb-4">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-4xl font-black italic tracking-tighter uppercase bg-gradient-to-r from-white to-white/30 bg-clip-text text-transparent">
                {isYTMode ? 'Link YouTube' : 'Ingest Asset'}
              </DialogTitle>
              {isYTMode && (
                <Button variant="ghost" size="sm" onClick={() => setIsYTMode(false)}>
                  <X size={16} />
                </Button>
              )}
            </div>
            <DialogDescription className="text-[10px] font-mono uppercase tracking-[0.2em] text-indigo-400">
              Initialize data transfer sequence
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {!isYTMode ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-8 grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                <label className="group flex flex-col items-center justify-center p-6 border border-white/10 bg-white/5 rounded-sm hover:bg-white/10 hover:border-indigo-500/50 transition-all cursor-pointer aspect-square">
                  <ImageIcon className="w-8 h-8 text-white/20 group-hover:text-indigo-400 mb-2 transition-colors" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Img (BB)</span>
                  <input type="file" className="hidden" onChange={handleImageBBStore} accept="image/*" />
                </label>

                <button
                  onClick={() => setIsYTMode(true)}
                  className="group flex flex-col items-center justify-center p-6 border border-white/10 bg-white/5 rounded-sm hover:bg-white/10 hover:border-red-500/50 transition-all aspect-square"
                >
                  <Youtube className="w-8 h-8 text-white/20 group-hover:text-red-500 mb-2 transition-colors" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/40">YouTube</span>
                </button>

                {['imageUploader', 'videoUploader', 'audioUploader', 'pdfUploader', 'documentUploader'].map(endpoint => {
                  const icons: Record<string, React.ElementType> = {
                    imageUploader: ImageIcon,
                    videoUploader: VideoIcon,
                    audioUploader: Music,
                    pdfUploader: FileText,
                    documentUploader: FileCode,
                  };
                  const Icon = icons[endpoint];
                  return (
                    <div
                      key={endpoint}
                      className="group relative flex flex-col items-center justify-center p-4 border border-white/10 bg-white/5 rounded-sm hover:border-indigo-500/50 transition-all aspect-square"
                    >
                      <Icon className="w-8 h-8 text-white/20 group-hover:text-indigo-400 mb-2 transition-colors" />
                      <UploadButton
                        endpoint={endpoint as 'imageUploader' | 'videoUploader' | 'audioUploader' | 'pdfUploader' | 'documentUploader'}
                        onClientUploadComplete={res => {
                          if (res?.[0]) {
                            addMedia({
                              url: res[0].url,
                              name: res[0].name,
                              contentType: endpoint.replace('Uploader', '').replace('document', 'docx') as MediaType,
                              status: 'active',
                            }).unwrap();
                            setIsAddDialogOpen(false);
                            toast.success('Sync complete');
                          }
                        }}
                        appearance={{
                          button: 'w-full h-7 bg-white/5 hover:bg-indigo-500/20 text-[8px] font-black uppercase border border-white/10',
                          allowedContent: 'hidden',
                        }}
                        content={{ button: endpoint.replace('Uploader', '').toUpperCase() }}
                      />
                    </div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-red-500">
                    <Code size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Iframe Embed / URL</span>
                  </div>
                  <textarea
                    value={ytInput}
                    onChange={e => setYtInput(e.target.value)}
                    placeholder='Paste <iframe src="..."> here...'
                    className="w-full h-32 bg-white/5 border border-white/10 rounded-sm p-4 text-xs font-mono text-indigo-300 focus:outline-none focus:border-red-500/50 resize-none transition-all"
                  />
                </div>
                <Button
                  onClick={handleYTImport}
                  className="w-full bg-red-500/10 border border-red-500/30 hover:bg-red-500 text-white font-black uppercase text-[10px] tracking-[0.2em] h-12"
                >
                  <Send size={14} className="mr-2" /> Initialize YouTube Deployment
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-5xl bg-black/95 border-white/20 backdrop-blur-3xl text-white p-0 overflow-hidden shadow-2xl mt-4">
          <DialogTitle className="sr-only">Viewer</DialogTitle>
          <div className="aspect-video w-full bg-black flex items-center justify-center">
            {previewMedia?.contentType === 'image' && <Image src={previewMedia.url} alt="preview Image" fill className="object-contain" unoptimized />}
            {previewMedia?.contentType === 'video' &&
              (previewMedia.uploaderPlace === 'youtube' ? (
                <iframe src={previewMedia.url} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
              ) : (
                <video src={previewMedia.url} controls autoPlay className="max-h-full max-w-full" />
              ))}
            {previewMedia?.contentType === 'audio' && (
              <div className="flex flex-col items-center gap-6">
                <Volume2 size={80} className="text-indigo-500 animate-pulse" />
                <audio src={previewMedia.url} controls className="w-80 invert opacity-60" />
              </div>
            )}
            {(previewMedia?.contentType === 'pdf' || previewMedia?.contentType === 'docx') && <iframe src={previewMedia.url} className="w-full h-full" />}
          </div>
          <div className="p-6 bg-white/5 border-t border-white/10 flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="text-xl font-black tracking-tighter uppercase italic">{previewMedia?.name}</h3>
              <p className="text-[9px] font-mono text-white/20 truncate uppercase">{previewMedia?.url}</p>
            </div>
            <Button asChild variant="outlineGlassy" size="sm">
              <Link href={previewMedia?.url || '#'} target="_blank" className="text-[10px] font-black uppercase tracking-widest">
                <ExternalLink size={14} className="mr-2" /> External Link
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-black/95 border-rose-500/20 backdrop-blur-3xl text-white max-w-md mt-12">
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={32} className="text-rose-500 animate-pulse" />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic text-rose-500">Purge Confirmation</DialogTitle>
              <DialogDescription className="text-white/40 text-[10px] font-mono uppercase tracking-widest">
                Node destruction: <span className="text-white">&ldquo;{mediaToDelete?.name}&ldquo;</span>
              </DialogDescription>
            </div>
          </div>
          <DialogFooter className="flex gap-2 p-4 bg-white/5 border-t border-white/10">
            <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} className="uppercase text-[10px] tracking-widest font-black text-white/40">
              Abort
            </Button>
            <Button variant="outlineFire" onClick={handleConfirmDelete} className="uppercase text-[10px] tracking-widest font-black">
              Purge Node
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
