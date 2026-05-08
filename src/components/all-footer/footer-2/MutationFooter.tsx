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
  Grid,
  Type,
  Globe,
  Trash2,
  Upload,
  MapPin,
  Search,
  Square,
  Loader2,
  Smartphone,
  RefreshCw,
  LayoutTemplate,
  RectangleHorizontal,
} from 'lucide-react';
import Image from 'next/image';
import Cropper from 'react-easy-crop';
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

export interface IFooter2Data {
  brandName: string;
  tagline: string;
  logoUrl: string | null;
  logoWidth: number;
  contactInfo: ContactInfo;
  quickLinks: QuickLink[];
  socialLinks: SocialLink[];
  copyrightText: string;
}

const defaultDataFooter2: IFooter2Data = {
  brandName: '',
  tagline: '',
  logoUrl: null,
  logoWidth: 150,
  contactInfo: { address: '', phone: '', email: '' },
  quickLinks: [],
  socialLinks: [],
  copyrightText: '© 2025 All Rights Reserved.',
};

const ASPECT_RATIOS = [
  { label: 'Square', value: 1, icon: Square },
  { label: '16:9', value: 16 / 9, icon: RectangleHorizontal },
  { label: '4:3', value: 4 / 3, icon: LayoutTemplate },
  { label: 'Wide', value: 3 / 1, icon: RectangleHorizontal },
];

interface MutationFooterProps {
  data?: string;
  onSave?: (settings: IFooter2Data) => Promise<void> | void;
}

const MutationFooter2 = ({ data, onSave }: MutationFooterProps) => {
  const [settings, setSettings] = useState<IFooter2Data>(defaultDataFooter2);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspectRatio, setAspectRatio] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaImages, setMediaImages] = useState<string[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  useEffect(() => {
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setSettings({ ...defaultDataFooter2, ...parsed });
      } catch (e) {
        console.error('Failed to parse footer data', e);
      }
    }
  }, [data]);

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
      if (onSave) {
        await onSave(settings);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      toast.success('Footer settings updated successfully!');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to update settings');
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
  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
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
        toast.success('Logo uploaded and optimized!');
      } else {
        throw new Error('Upload to storage failed');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || 'Error processing image');
    } finally {
      setIsUploading(false);
    }
  };

  const updateContact = (field: keyof ContactInfo, value: string) => {
    setSettings(prev => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, [field]: value },
    }));
  };

  const handleArrayChange = (arrayName: 'quickLinks' | 'socialLinks', id: number, field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [arrayName]: prev[arrayName].map((item: any) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const removeItem = (arrayName: 'quickLinks' | 'socialLinks', id: number) => {
    setSettings(prev => ({
      ...prev,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [arrayName]: prev[arrayName].filter((item: any) => item.id !== id),
    }));
  };

  const addItem = (arrayName: 'quickLinks' | 'socialLinks') => {
    const newItem = arrayName === 'quickLinks' ? { id: Date.now(), title: '', link: '' } : { id: Date.now(), platform: '', link: '' };
    setSettings(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], newItem],
    }));
  };

  const glassCardClass = 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl overflow-hidden';
  const glassHeaderClass = 'bg-white/5 px-6 py-4 border-b border-white/10 flex justify-between items-center';
  const glassInputClass =
    'w-full mt-1 px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all text-white placeholder:text-slate-500';
  const labelClass = 'text-xs font-bold text-indigo-300 uppercase tracking-wider';

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-slate-950 to-black pb-20 text-slate-200">
      <ToastContainer position="bottom-right" theme="dark" toastClassName="bg-slate-900 border border-white/10 text-slate-200" />

      <div className="sticky top-0 z-40 bg-slate-950/70 backdrop-blur-lg border-b border-white/10 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 border border-indigo-500/30">
              <LayoutTemplate size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Footer Builder (V2)</h1>
              <p className="text-xs text-slate-400">Manage global footer content</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving || isUploading}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium rounded-lg shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-70 transform hover:scale-105 active:scale-95"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isSaving ? 'Saving...' : 'Publish Changes'}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <div className="lg:col-span-2 space-y-6">
          <div className={glassCardClass}>
            <div className={glassHeaderClass}>
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Type size={18} className="text-indigo-400" /> Brand Information
              </h2>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className={labelClass}>Brand Name</label>
                <input
                  type="text"
                  value={settings.brandName}
                  onChange={e => setSettings({ ...settings, brandName: e.target.value })}
                  className={glassInputClass}
                  placeholder="Company Name"
                />
              </div>
              <div>
                <label className={labelClass}>Tagline</label>
                <textarea
                  rows={3}
                  value={settings.tagline}
                  onChange={e => setSettings({ ...settings, tagline: e.target.value })}
                  className={`${glassInputClass} resize-none`}
                  placeholder="Short description..."
                />
              </div>
            </div>
          </div>

          <div className={glassCardClass}>
            <div className={glassHeaderClass}>
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Globe size={18} className="text-indigo-400" /> Quick Links
              </h2>
              <button
                onClick={() => addItem('quickLinks')}
                className="text-xs flex items-center gap-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg hover:bg-indigo-500/30 transition-colors"
              >
                <Plus size={14} /> Add Link
              </button>
            </div>
            <div className="p-6 space-y-3">
              {settings.quickLinks.map(item => (
                <div key={item.id} className="flex gap-3 items-start group">
                  <input
                    placeholder="Title"
                    value={item.title}
                    onChange={e => handleArrayChange('quickLinks', item.id, 'title', e.target.value)}
                    className={`${glassInputClass} mt-0`}
                  />
                  <input
                    placeholder="/link"
                    value={item.link}
                    onChange={e => handleArrayChange('quickLinks', item.id, 'link', e.target.value)}
                    className={`${glassInputClass} mt-0 font-mono text-slate-400`}
                  />
                  <button
                    onClick={() => removeItem('quickLinks', item.id)}
                    className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className={glassCardClass}>
            <div className="p-6">
              <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Logo</h3>
              <div className="flex flex-col items-center p-6 border-2 border-dashed border-white/10 rounded-xl bg-black/20 mb-4 min-h-[120px] justify-center group/preview relative overflow-hidden">
                {settings.logoUrl ? (
                  <div className="relative group/overlay">
                    <Image
                      src={settings.logoUrl}
                      width={settings.logoWidth}
                      height={settings.logoWidth}
                      alt="Logo"
                      className="object-contain drop-shadow-lg"
                      style={{ width: `${settings.logoWidth}px` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/overlay:opacity-100 bg-black/50 backdrop-blur-sm transition-all rounded-lg gap-2">
                      <button onClick={() => setShowMediaModal(true)} className="p-2 bg-indigo-600 rounded-full hover:bg-indigo-500 text-white shadow-lg">
                        <RefreshCw size={14} />
                      </button>
                      <button
                        onClick={() => setSettings(prev => ({ ...prev, logoUrl: null }))}
                        className="p-2 bg-red-600 rounded-full hover:bg-red-500 text-white shadow-lg"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <span className="text-slate-500 text-sm flex flex-col items-center gap-2">
                    <Upload size={20} className="opacity-50" />
                    No Logo
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowMediaModal(true)}
                className="cursor-pointer w-full text-center py-2.5 border border-white/10 bg-white/5 rounded-lg hover:bg-white/10 text-sm font-medium text-slate-300 transition-colors flex items-center justify-center gap-2"
              >
                <Grid size={16} /> {settings.logoUrl ? 'Change Logo' : 'Select Media'}
              </button>

              <div className="mt-5">
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>Size</span>
                  <span>{settings.logoWidth}px</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="300"
                  value={settings.logoWidth}
                  onChange={e => setSettings({ ...settings, logoWidth: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className={`${glassCardClass} p-6 space-y-5`}>
            <h3 className="text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider">Contact Details</h3>
            <div className="relative">
              <MapPin className="absolute top-3 left-3 text-indigo-400" size={16} />
              <input
                value={settings.contactInfo.address}
                onChange={e => updateContact('address', e.target.value)}
                className={`${glassInputClass} mt-0 pl-10`}
                placeholder="Address"
              />
            </div>
            <div className="relative">
              <Smartphone className="absolute top-3 left-3 text-indigo-400" size={16} />
              <input
                value={settings.contactInfo.phone}
                onChange={e => updateContact('phone', e.target.value)}
                className={`${glassInputClass} mt-0 pl-10`}
                placeholder="Phone"
              />
            </div>
            <div className="relative">
              <Mail className="absolute top-3 left-3 text-indigo-400" size={16} />
              <input
                value={settings.contactInfo.email}
                onChange={e => updateContact('email', e.target.value)}
                className={`${glassInputClass} mt-0 pl-10`}
                placeholder="Email"
              />
            </div>
          </div>

          <div className={`${glassCardClass} p-6`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Social Links</h3>
              <button onClick={() => addItem('socialLinks')} className="p-1.5 bg-white/10 text-slate-300 rounded hover:bg-white/20 transition-colors">
                <Plus size={14} />
              </button>
            </div>
            <div className="space-y-3 mb-6">
              {settings.socialLinks.map(item => (
                <div key={item.id} className="flex gap-2">
                  <input
                    value={item.platform}
                    onChange={e => handleArrayChange('socialLinks', item.id, 'platform', e.target.value)}
                    className="w-1/3 px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-xs text-white outline-none focus:border-indigo-500/50"
                    placeholder="Platform"
                  />
                  <input
                    value={item.link}
                    onChange={e => handleArrayChange('socialLinks', item.id, 'link', e.target.value)}
                    className="flex-1 px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-xs text-slate-300 outline-none focus:border-indigo-500/50 font-mono"
                    placeholder="URL"
                  />
                  <button onClick={() => removeItem('socialLinks', item.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-5 border-t border-white/10">
              <label className={labelClass}>Copyright</label>
              <input value={settings.copyrightText} onChange={e => setSettings({ ...settings, copyrightText: e.target.value })} className={glassInputClass} />
            </div>
          </div>
        </div>
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
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-900/50 backdrop-blur-md">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <RefreshCw size={18} className="text-indigo-400" />
                  Adjust Image
                </h3>
                <button
                  onClick={() => {
                    setShowCropper(false);
                    setImageSrc(null);
                  }}
                  className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="relative flex-1 min-h-[300px] bg-black">
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
                    cropAreaClassName: 'border-2 border-indigo-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.8)]',
                  }}
                />
              </div>

              <div className="p-6 bg-slate-900 space-y-6 border-t border-white/10">
                <div className="space-y-3">
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Crop Shape</div>
                  <div className="grid grid-cols-4 gap-2">
                    {ASPECT_RATIOS.map(ratio => (
                      <button
                        key={ratio.label}
                        onClick={() => setAspectRatio(ratio.value)}
                        className={`flex flex-col items-center justify-center gap-2 py-3 rounded-lg border transition-all duration-200 ${
                          Math.abs(aspectRatio - ratio.value) < 0.01
                            ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <ratio.icon size={18} />
                        <span className="text-[10px] font-medium">{ratio.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-medium text-slate-400 uppercase tracking-wider">
                    <span>Zoom Level</span>
                    <span>{Math.round(zoom * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={e => setZoom(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowCropper(false);
                      setImageSrc(null);
                    }}
                    disabled={isUploading}
                    className="flex-1 px-4 py-3 border border-white/10 text-slate-300 rounded-xl hover:bg-white/5 font-medium transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCropAndUpload}
                    disabled={isUploading}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl hover:from-indigo-500 hover:to-indigo-400 font-medium shadow-lg shadow-indigo-500/30 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                    {isUploading ? 'Processing...' : 'Apply & Upload'}
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

export default MutationFooter2;
