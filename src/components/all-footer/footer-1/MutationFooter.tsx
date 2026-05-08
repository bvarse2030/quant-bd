/*
|-----------------------------------------
| setting up MutationFooter for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import {
  X,
  Save,
  Plus,
  Mail,
  Type,
  Hash,
  Grid,
  Globe,
  Search,
  Upload,
  Trash2,
  MapPin,
  Square,
  Loader2,
  Sparkles,
  RefreshCw,
  Copyright,
  Smartphone,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  LayoutTemplate,
  Link as LinkIcon,
  Image as ImageIcon,
  RectangleHorizontal,
} from 'lucide-react';
import Image from 'next/image';
import Cropper from 'react-easy-crop';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import imageCompression from 'browser-image-compression';
import React, { useState, useCallback, useEffect } from 'react';

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
}

export interface QuickLink {
  id: number;
  title: string;
  link: string;
}

export interface SocialLink {
  id: number;
  platform: string;
  link: string;
}

export interface IFooter1Data {
  brandName: string;
  tagline: string;
  logoUrl: string | null;
  logoWidth: number;
  contactInfo: ContactInfo;
  quickLinks: QuickLink[];
  socialLinks: SocialLink[];
  copyrightText: string;
  designerName: string;
}

const defaultDataFooter1: IFooter1Data = {
  brandName: '',
  tagline: '',
  logoUrl: null,
  logoWidth: 150,
  contactInfo: { address: '', phone: '', email: '' },
  quickLinks: [],
  socialLinks: [],
  copyrightText: '© 2025 All Rights Reserved.',
  designerName: 'AppGenerator',
};

const ASPECT_RATIOS = [
  { label: 'Square', value: 1, icon: Square },
  { label: 'Landscape', value: 16 / 9, icon: RectangleHorizontal },
  { label: 'Portrait', value: 3 / 4, icon: LayoutTemplate },
  { label: 'Wide', value: 3 / 1, icon: RectangleHorizontal },
];

interface MutationFooter1Props {
  data?: string;
  onSave?: (settings: IFooter1Data) => Promise<void> | void;
}

const MutationFooter1 = ({ data, onSave }: MutationFooter1Props) => {
  const router = useRouter();

  const [settings, setSettings] = useState<IFooter1Data>(defaultDataFooter1);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaImages, setMediaImages] = useState<string[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  useEffect(() => {
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setSettings({ ...defaultDataFooter1, ...parsed });
      } catch (e) {
        console.error(e);
      }
    }
  }, [data]);

  const [showCropper, setShowCropper] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspectRatio, setAspectRatio] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchMediaImages = useCallback(async () => {
    setLoadingMedia(true);
    try {
      const response = await fetch('/api/media/v1');
      if (!response.ok) throw new Error('Failed to fetch media');
      const data = await response.json();
      if (data?.data && Array.isArray(data.data)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setMediaImages(data.data.map((i: any) => i.url));
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Could not load media library');
    } finally {
      setLoadingMedia(false);
    }
  }, []);

  useEffect(() => {
    if (showMediaModal) {
      fetchMediaImages();
    }
  }, [showMediaModal, fetchMediaImages]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onSave) await onSave(settings);
      toast.success('Footer configuration saved successfully!');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image (JPG, PNG, WEBP).');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setZoom(1);
        setAspectRatio(1);
        setShowMediaModal(false);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleLibrarySelect = (url: string) => {
    setImageSrc(url);
    setZoom(1);
    setAspectRatio(1);
    setShowMediaModal(false);
    setShowCropper(true);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new window.Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', error => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getCroppedImgBlob = async (imageSrc: string, pixelCrop: any): Promise<Blob | null> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);

    return new Promise(resolve => {
      canvas.toBlob(blob => resolve(blob), 'image/png', 1);
    });
  };

  const handleCropAndUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsUploading(true);
    try {
      const croppedBlob = await getCroppedImgBlob(imageSrc, croppedAreaPixels);
      if (!croppedBlob) throw new Error('Failed to crop image');

      const file = new File([croppedBlob], 'logo-optimized.png', { type: 'image/png' });

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1000,
        useWebWorker: true,
        fileType: 'image/png' as const,
      };
      const compressedFile = await imageCompression(file, options);

      const formData = new FormData();
      formData.append('image', compressedFile);

      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      if (!apiKey) throw new Error('ImgBB API Key missing');

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const newUrl = data.data.url;
        await fetch('/api/media/v1', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            delete_url: data.data.delete_url,
            url: newUrl,
            display_url: data.data.display_url,
          }),
        });

        setSettings(prev => ({ ...prev, logoUrl: newUrl }));
        setShowCropper(false);
        setImageSrc(null);
        toast.success('Logo processed and saved!');
      } else {
        throw new Error('Storage upload failed');
      } // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Error processing image');
    } finally {
      setIsUploading(false);
    }
  };

  const updateContact = (field: keyof ContactInfo, value: string) => {
    setSettings(prev => ({ ...prev, contactInfo: { ...prev.contactInfo, [field]: value } }));
  };

  const addQuickLink = () => {
    setSettings(prev => ({ ...prev, quickLinks: [...prev.quickLinks, { id: Date.now(), title: '', link: '' }] }));
  };
  const updateQuickLink = (id: number, field: keyof QuickLink, value: string) => {
    setSettings(prev => ({
      ...prev,
      quickLinks: prev.quickLinks.map(l => (l.id === id ? { ...l, [field]: value } : l)),
    }));
  };
  const removeQuickLink = (id: number) => {
    setSettings(prev => ({ ...prev, quickLinks: prev.quickLinks.filter(l => l.id !== id) }));
  };

  const addSocialLink = () => {
    setSettings(prev => ({ ...prev, socialLinks: [...prev.socialLinks, { id: Date.now(), platform: '', link: '' }] }));
  };
  const updateSocialLink = (id: number, field: keyof SocialLink, value: string) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map(l => (l.id === id ? { ...l, [field]: value } : l)),
    }));
  };
  const removeSocialLink = (id: number) => {
    setSettings(prev => ({ ...prev, socialLinks: prev.socialLinks.filter(l => l.id !== id) }));
  };

  const styles = {
    card: 'bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-md shadow-xl overflow-hidden relative group',
    input:
      'w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all text-slate-100 placeholder:text-slate-500 text-sm',
    label: 'flex items-center gap-2 text-xs font-bold text-indigo-200/60 uppercase tracking-widest mb-2',
    sectionHeader: 'flex items-center gap-2 text-indigo-400 uppercase text-xs font-bold tracking-widest mb-6',
    addButton:
      'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest hover:bg-indigo-500/20 transition-all',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 pb-32">
      <ToastContainer position="bottom-right" theme="dark" toastClassName="bg-slate-900 border border-white/10 text-slate-200" />

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => router.back()}
        className="fixed top-6 right-6 z-50 p-3 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-full text-slate-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/50 transition-all shadow-lg group"
      >
        <X size={24} className="group-hover:text-red-200" />
      </motion.button>

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-fuchsia-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8 relative z-10">
        <div className="mb-12 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest"
          >
            <Sparkles size={12} />
            <span>Site Configuration</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
            Footer Builder
          </h1>
          <p className="text-slate-400 max-w-2xl text-lg">
            Customize your global footer. Manage quick links, social connections, and brand identity in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={styles.card}>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className={styles.sectionHeader}>
                <Type size={14} />
                <span>Brand Identity</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                <div>
                  <label className={styles.label}>Brand Name</label>
                  <input
                    type="text"
                    value={settings.brandName}
                    onChange={e => setSettings({ ...settings, brandName: e.target.value })}
                    className={styles.input}
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <label className={styles.label}>Tagline</label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={e => setSettings({ ...settings, tagline: e.target.value })}
                    className={styles.input}
                    placeholder="Brief description..."
                  />
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={styles.card}>
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-2 text-indigo-400 uppercase text-xs font-bold tracking-widest">
                  <Globe size={14} />
                  <span>Quick Links</span>
                </div>
                <button onClick={addQuickLink} className={styles.addButton}>
                  <Plus size={14} /> Add Link
                </button>
              </div>

              <div className="space-y-4 relative z-10">
                <AnimatePresence>
                  {settings.quickLinks.map(link => (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: 'auto', scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      className="group/item bg-slate-950/30 border border-white/5 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center relative"
                    >
                      <div className="flex-1 w-full space-y-1">
                        <div className="relative">
                          <Type className="absolute top-3.5 left-3 text-slate-500" size={14} />
                          <input
                            placeholder="Display Name"
                            value={link.title}
                            onChange={e => updateQuickLink(link.id, 'title', e.target.value)}
                            className={`${styles.input} pl-9`}
                          />
                        </div>
                      </div>
                      <div className="hidden md:block text-slate-600">
                        <ChevronRight size={16} />
                      </div>
                      <div className="flex-1 w-full space-y-1">
                        <div className="relative">
                          <LinkIcon className="absolute top-3.5 left-3 text-slate-500" size={14} />
                          <input
                            placeholder="/destination-url"
                            value={link.link}
                            onChange={e => updateQuickLink(link.id, 'link', e.target.value)}
                            className={`${styles.input} pl-9 font-mono text-xs text-indigo-300`}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeQuickLink(link.id)}
                        className="absolute -top-2 -right-2 md:static p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all opacity-100 md:opacity-0 group-hover/item:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {settings.quickLinks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-500 border border-dashed border-white/5 rounded-xl bg-slate-950/20">
                    <Globe size={32} className="mb-3 opacity-20" />
                    <p className="text-sm">No quick links configured yet.</p>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={styles.card}>
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-2 text-indigo-400 uppercase text-xs font-bold tracking-widest">
                  <MessageCircle size={14} />
                  <span>Social Media</span>
                </div>
                <button onClick={addSocialLink} className={styles.addButton}>
                  <Plus size={14} /> Add Social
                </button>
              </div>

              <div className="space-y-4 relative z-10">
                <AnimatePresence>
                  {settings.socialLinks.map(link => (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="group/social relative flex flex-col sm:flex-row gap-3 p-3 bg-slate-950/30 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-all"
                    >
                      <div className="flex-1">
                        <div className="relative">
                          <Hash className="absolute top-3.5 left-3 text-slate-500" size={14} />
                          <input
                            value={link.platform}
                            onChange={e => updateSocialLink(link.id, 'platform', e.target.value)}
                            placeholder="Platform"
                            className={`${styles.input} pl-9`}
                          />
                        </div>
                      </div>
                      <div className="flex-[2]">
                        <div className="relative">
                          <ExternalLink className="absolute top-3.5 left-3 text-slate-500" size={14} />
                          <input
                            value={link.link}
                            onChange={e => updateSocialLink(link.id, 'link', e.target.value)}
                            placeholder="https://..."
                            className={`${styles.input} pl-9 font-mono text-xs text-indigo-300`}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeSocialLink(link.id)}
                        className="absolute top-2 right-2 sm:relative sm:top-auto sm:right-auto sm:self-center p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {settings.socialLinks.length === 0 && (
                  <div className="text-center py-6 text-slate-500 italic text-sm border border-dashed border-white/5 rounded-xl bg-slate-950/20">
                    Add your social media profiles here
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className={styles.card}>
              <div className={styles.sectionHeader}>
                <Copyright size={14} />
                <span>Legal & Credits</span>
              </div>
              <div className="grid md:grid-cols-2 gap-5 relative z-10">
                <div>
                  <label className={styles.label}>Copyright Text</label>
                  <input value={settings.copyrightText} onChange={e => setSettings({ ...settings, copyrightText: e.target.value })} className={styles.input} />
                </div>
                <div>
                  <label className={styles.label}>Designer / Credits</label>
                  <input value={settings.designerName} onChange={e => setSettings({ ...settings, designerName: e.target.value })} className={styles.input} />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-4 space-y-6 h-fit lg:sticky lg:top-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`${styles.card} border-indigo-500/20`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
              <div className={styles.sectionHeader}>
                <ImageIcon size={14} />
                <span>Logo Configuration</span>
              </div>

              <div className="relative z-10">
                <div className="relative w-full aspect-video bg-slate-950/50 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center mb-4 overflow-hidden group/preview">
                  {settings.logoUrl ? (
                    <>
                      <Image
                        src={settings.logoUrl}
                        alt="Footer Logo"
                        width={settings.logoWidth}
                        height={100}
                        className="object-contain"
                        style={{ width: `${settings.logoWidth}px` }}
                      />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowMediaModal(true)}
                            className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors"
                          >
                            <RefreshCw size={16} />
                          </button>
                          <button
                            onClick={() => setSettings(prev => ({ ...prev, logoUrl: null }))}
                            className="p-2 bg-red-500/20 rounded-full hover:bg-red-500/40 text-red-200 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                      <ImageIcon size={32} className="opacity-30" />
                      <span className="text-xs">No Logo Set</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => setShowMediaModal(true)}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/20 font-medium text-sm"
                  >
                    <Grid size={16} />
                    {settings.logoUrl ? 'Select / Upload New' : 'Select from Media'}
                  </button>

                  <div className="pt-2">
                    <div className="flex justify-between text-xs text-indigo-200/60 font-bold uppercase tracking-widest mb-2">
                      <span>Size</span>
                      <span>{settings.logoWidth}px</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="300"
                      value={settings.logoWidth}
                      onChange={e => setSettings({ ...settings, logoWidth: Number(e.target.value) })}
                      className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className={styles.card}>
              <div className={styles.sectionHeader}>
                <Smartphone size={14} />
                <span>Contact Details</span>
              </div>
              <div className="space-y-4 relative z-10">
                <div className="relative group">
                  <MapPin className="absolute top-3.5 left-3 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
                  <input
                    value={settings.contactInfo.address}
                    onChange={e => updateContact('address', e.target.value)}
                    placeholder="Physical Address"
                    className={`${styles.input} pl-10`}
                  />
                </div>
                <div className="relative group">
                  <Smartphone className="absolute top-3.5 left-3 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
                  <input
                    value={settings.contactInfo.phone}
                    onChange={e => updateContact('phone', e.target.value)}
                    placeholder="Phone Number"
                    className={`${styles.input} pl-10`}
                  />
                </div>
                <div className="relative group">
                  <Mail className="absolute top-3.5 left-3 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
                  <input
                    value={settings.contactInfo.email}
                    onChange={e => updateContact('email', e.target.value)}
                    placeholder="Email Address"
                    className={`${styles.input} pl-10`}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl shadow-black/50 pointer-events-auto flex items-center gap-4"
        >
          <div className="hidden md:flex flex-col px-4">
            <span className="text-sm font-bold text-white">Config Changes</span>
            <span className="text-xs text-slate-400">Review before saving</span>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-white text-slate-950 hover:bg-indigo-50 hover:text-indigo-900 px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
            <span>{isSaving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showMediaModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-4xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[80vh]"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">Media Library</h3>
                  <p className="text-slate-400 text-sm">Select an image or upload a new one.</p>
                </div>
                <button onClick={() => setShowMediaModal(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-slate-950/50">
                {loadingMedia ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-500">
                    <Loader2 className="animate-spin" size={32} />
                    <p>Loading library...</p>
                  </div>
                ) : mediaImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    <label className="cursor-pointer border-2 border-dashed border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10 hover:border-indigo-500/50 rounded-xl flex flex-col items-center justify-center gap-2 text-indigo-400 transition-all min-h-[160px]">
                      <Upload size={24} />
                      <span className="text-xs font-bold uppercase tracking-wide">Upload New</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                    {mediaImages.map((url, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleLibrarySelect(url)}
                        className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-slate-900 cursor-pointer hover:border-indigo-500/50 transition-all"
                      >
                        <Image src={url} alt="Media asset" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium text-white border border-white/20">
                            Select
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-500">
                    <Search size={48} className="opacity-20" />
                    <div className="text-center">
                      <p className="font-medium">No media found</p>
                      <p className="text-xs">Upload your first image to get started.</p>
                    </div>
                    <label className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors text-sm font-medium">
                      Upload Image
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCropper && imageSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl shadow-black/50 flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <RefreshCw size={18} className="text-indigo-400" /> Adjust & Crop
                </h3>
                <button onClick={() => setShowCropper(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="relative flex-1 bg-black min-h-[300px]">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspectRatio}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  classes={{
                    containerClassName: 'bg-transparent',
                    cropAreaClassName: 'border-2 border-indigo-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.85)]',
                  }}
                />
              </div>

              <div className="p-6 space-y-6 bg-slate-900 border-t border-white/5">
                <div className="grid grid-cols-4 gap-2">
                  {ASPECT_RATIOS.map(ratio => (
                    <button
                      key={ratio.label}
                      onClick={() => setAspectRatio(ratio.value)}
                      className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg border transition-all ${
                        aspectRatio === ratio.value
                          ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      <ratio.icon size={16} />
                      <span className="text-[10px] font-medium">{ratio.label}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-400 font-medium w-12">Zoom</span>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={e => setZoom(Number(e.target.value))}
                    className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowCropper(false)}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCropAndUpload}
                    disabled={isUploading}
                    className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                    {isUploading ? 'Processing...' : 'Save & Apply'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MutationFooter1;
