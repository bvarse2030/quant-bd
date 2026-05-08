/*
|-----------------------------------------
| setting up BrandSettingsEditor for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import {
  Type,
  Check,
  Layers,
  Layout,
  Upload,
  Anchor,
  Trash2,
  Loader2,
  Palette,
  Activity,
  StarIcon,
  RotateCcw,
  Maximize2,
  GlassWater,
  UploadCloud,
  ChevronRight,
  MousePointer2,
  Crop as CropIcon,
} from 'lucide-react';
import Image from 'next/image';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop';
import { toast, ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import imageCompression from 'browser-image-compression';
import React, { useState, useEffect, useCallback } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type BrandFontSize = 'text-lg' | 'text-xl' | 'text-2xl' | 'text-3xl';
type BrandFontFamily = 'font-sans' | 'font-serif' | 'font-mono';

export interface BrandConfiguration {
  brandName: string;
  logoUrl: string | null;
  textColor: string;
  fontSize: BrandFontSize;
  fontFamily: BrandFontFamily;
  menuTextColor: string;
  menuFontSize: BrandFontSize;
  menuFontFamily: BrandFontFamily;
  menuBackgroundColor: string;
  backgroundTransparent: number;
  menuSticky: boolean;
}

const defaultBrandConfig: BrandConfiguration = {
  brandName: 'Aether Digital',
  logoUrl: null,
  textColor: '#ffffff',
  fontSize: 'text-2xl',
  fontFamily: 'font-sans',
  menuTextColor: '#cbd5e1',
  menuFontSize: 'text-lg',
  menuFontFamily: 'font-sans',
  menuBackgroundColor: 'rgba(15, 23, 42, 0.8)',
  backgroundTransparent: 100,
  menuSticky: true,
};

const fontOptions = [
  { label: 'Sans Serif', value: 'font-sans' },
  { label: 'Serif', value: 'font-serif' },
  { label: 'Monospace', value: 'font-mono' },
];

const sizeOptions = [
  { label: 'Small', value: 'text-lg' },
  { label: 'Medium', value: 'text-xl' },
  { label: 'Large', value: 'text-2xl' },
  { label: 'Extra Large', value: 'text-3xl' },
];

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new window.Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', error => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

async function getCroppedImg(imageSrc: string, pixelCrop: Area, rotation = 0): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const rotRad = getRadianAngle(rotation);
  const { width: bBoxWidth, height: bBoxHeight } = {
    width: Math.abs(Math.cos(rotRad) * image.width) + Math.abs(Math.sin(rotRad) * image.height),
    height: Math.abs(Math.sin(rotRad) * image.width) + Math.abs(Math.cos(rotRad) * image.height),
  };
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);
  const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.putImageData(data, 0, 0);
  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.95);
  });
}

const MediaLibrary = ({ onImageSelect, selectedImage }: { onImageSelect: (newImage: string) => void; selectedImage: string }) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCropping, setIsCropping] = useState(false);
  const [tempSrc, setTempSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(1);
  const [pixelCrop, setPixelCrop] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/media/v1');
      if (response.ok) {
        const data = await response.json();
        setImages(data?.data?.map((i: { url: string }) => i.url) || []);
      }
    } catch {
      toast.error('Library sync error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setTempSrc(reader.result?.toString() || '');
        setIsCropping(true);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const startCropFromLibrary = (url: string) => {
    setTempSrc(url);
    setIsCropping(true);
  };

  const handleSaveUploadImages = async () => {
    if (!tempSrc || !pixelCrop) return;
    setProcessing(true);
    try {
      const blob = await getCroppedImg(tempSrc, pixelCrop, rotation);
      if (!blob) throw new Error('Blob generation failed');

      const fileToCompress = new File([blob], 'brand-logo.jpg', { type: 'image/jpeg' });

      const compressed = await imageCompression(fileToCompress, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        fileType: 'image/jpeg',
      });

      const formData = new FormData();
      formData.append('image', compressed);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
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
        onImageSelect(newUrl);
        setIsCropping(false);
        fetchImages();
      }
    } catch (e) {
      console.error('Processing error:', e);
      toast.error('Processing failed. Please try a different image.');
    } finally {
      setProcessing(false);
    }
  };

  if (isCropping && tempSrc) {
    return (
      <div className="flex flex-col h-[80vh] bg-slate-950 rounded-lg overflow-hidden border border-white/10">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2">
            <CropIcon className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-bold uppercase tracking-widest text-white/80">Crop Studio</span>
          </div>
        </div>
        <div className="relative flex-1 bg-black">
          <Cropper
            image={tempSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={(_, p) => setPixelCrop(p)}
          />
        </div>
        <div className="p-6 bg-slate-900 border-t border-white/10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-white/40">Zoom</span>
              <Slider value={[zoom]} min={1} max={3} step={0.1} onValueChange={v => setZoom(v[0])} />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-white/40">Rotate</span>
              <Slider value={[rotation]} min={0} max={360} step={1} onValueChange={v => setRotation(v[0])} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Square', r: 1 },
              { label: '16:9', r: 16 / 9 },
              { label: 'Free', r: undefined },
            ].map(opt => (
              <Button
                key={opt.label}
                variant="ghost"
                size="sm"
                onClick={() => setAspect(opt.r)}
                className={`text-[10px] uppercase font-bold tracking-widest h-8 ${aspect === opt.r ? 'bg-indigo-600 text-white' : 'bg-white/5 text-white/40'}`}
              >
                {opt.label}
              </Button>
            ))}
          </div>
          <div className="flex justify-between items-center pt-2">
            <Button variant="ghost" className="text-white/40 hover:text-white" onClick={() => setIsCropping(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUploadImages} disabled={processing} className="bg-indigo-600 hover:bg-indigo-700 text-white border-none min-w-[120px]">
              {processing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
              Apply & Save
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-white rounded-lg border border-white/10 shadow-2xl">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div className="space-y-1">
          <h3 className="text-xl font-bold italic tracking-tighter">Media Assets</h3>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Select an existing image or upload new</p>
        </div>
        <Button asChild className="bg-indigo-600 border-none hover:bg-indigo-700 h-10 shadow-lg shadow-indigo-500/20">
          <label className="cursor-pointer">
            <UploadCloud className="w-4 h-4 mr-2" /> Upload New <Input type="file" className="hidden" onChange={handleFile} />
          </label>
        </Button>
      </div>
      <ScrollArea className="h-[50vh]">
        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
            {images.map(url => (
              <motion.div
                whileHover={{ scale: 1.02 }}
                key={url}
                onClick={() => startCropFromLibrary(url)}
                className={`group relative aspect-square rounded-lg cursor-pointer overflow-hidden border-2 transition-all ${selectedImage === url ? 'border-indigo-500 shadow-lg ring-2 ring-indigo-500/20' : 'border-white/5 hover:border-white/20'}`}
              >
                <Image src={url} alt="asset" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-2 rounded-full bg-white/10 backdrop-blur-md">
                      <Maximize2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/80">Crop & Select</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-xl text-white/20">
            <Layout className="w-10 h-10 mb-2 opacity-20" />
            <p className="text-xs font-bold uppercase tracking-widest">No assets found</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default function BrandSettingsEditor() {
  const [config, setConfig] = useState<BrandConfiguration>(defaultBrandConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('brand');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/brand-settings');
        if (res.ok) {
          const data = await res.json();
          if (data?.brandName) setConfig(p => ({ ...p, ...data }));
        }
      } catch {
        toast.error('Sync failed');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/brand-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      toast.success('Settings Synced Successfully');
    } catch {
      toast.error('Update failed');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-400 animate-spin opacity-50" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-[60vh] relative overflow-hidden bg-transparent border border-slate-100/40 rounded-sm text-white selection:bg-indigo-500/30">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-500/10 blur-[150px] rounded-full" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-500/10 blur-[150px] rounded-full" />
        </div>

        <div className="container mx-auto relative z-10 p-4 max-w-7xl">
          <ToastContainer position="bottom-right" theme="dark" hideProgressBar />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <header className="flex flex-col md:flex-row justify-between items-center gap-6 transition-all mb-8">
              <div className="backdrop-blur-xl bg-white/10 border border-white/40 p-1 rounded-sm shadow-2xl sticky top-8 w-full md:w-auto">
                <TabsList className="flex w-full h-auto bg-transparent gap-1 p-0">
                  <TabsTrigger
                    value="brand"
                    className="w-full justify-center gap-4 px-5 py-2 rounded-sm data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-white/40 text-white/40 hover:text-white/80 transition-all text-xs font-bold uppercase tracking-tight"
                  >
                    <StarIcon className="w-4 h-4" /> Branding
                  </TabsTrigger>
                  <TabsTrigger
                    value="menu"
                    className="w-full justify-center gap-4 px-5 py-2 rounded-sm data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-white/40 text-white/40 hover:text-white/80 transition-all text-xs font-bold uppercase tracking-tight"
                  >
                    <Layers className="w-4 h-4" /> Theme
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <Button size="sm" onClick={() => setConfig(defaultBrandConfig)} variant="outlineGlassy">
                  <RotateCcw className="w-3.5 h-3.5 mr-2" /> Reset
                </Button>
                <Button onClick={handleSave} disabled={isSaving} variant="outlineGlassy">
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" /> Update
                    </>
                  )}
                </Button>
              </div>
            </header>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: 'circOut' }}
              >
                <TabsContent value="brand" className="m-0 focus-visible:ring-0">
                  <div className="backdrop-blur-xl bg-white/10 border border-white/60 p-4 rounded-sm shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="space-y-8">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 flex items-center gap-2">
                              <Layout className="w-3.5 h-3.5" /> Logo
                            </label>
                            {config.logoUrl && (
                              <Button variant="outlineFire" size="sm" onClick={() => setConfig(p => ({ ...p, logoUrl: null }))}>
                                <Trash2 className="w-3 h-3 mr-1" /> Remove
                              </Button>
                            )}
                          </div>
                          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                              <div className="group relative h-80 rounded-sm bg-white/5 border-2 border-dashed border-white/40 hover:border-white/80 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-4">
                                {config.logoUrl ? (
                                  <>
                                    <Image
                                      src={config.logoUrl}
                                      alt="logo"
                                      fill
                                      className="object-contain p-12 group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <div className="bg-white text-black px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                                        <UploadCloud className="w-3 h-3" /> Change logo
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-center group">
                                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10 group-hover:border-white transition-all">
                                      <UploadCloud className="w-10 h-10 text-white/20 group-hover:text-white" />
                                    </div>
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] group-hover:text-white transition-colors">
                                      Select Brand Logo
                                    </p>
                                  </div>
                                )}
                              </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl bg-transparent border-none p-0 shadow-none overflow-visible">
                              <DialogHeader className="sr-only">
                                <DialogTitle>Media Library</DialogTitle>
                              </DialogHeader>
                              <MediaLibrary
                                selectedImage={config.logoUrl || ''}
                                onImageSelect={u => {
                                  setConfig(p => ({ ...p, logoUrl: u }));
                                  setIsDialogOpen(false);
                                }}
                              />
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>

                      <div className="space-y-10">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 flex items-center gap-2">Brand Name</label>
                          <Input
                            value={config.brandName}
                            onChange={e => setConfig(p => ({ ...p, brandName: e.target.value }))}
                            className="h-14 bg-white/5 border-white/20 rounded-sm text-lg font-bold placeholder:text-white/5 focus:ring-white/20 focus:border-white/40"
                            placeholder="Untitled Branding"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Text Color</label>
                            <div className="relative group">
                              <div className="h-14 bg-white/5 rounded-sm border border-white/20 flex items-center px-4 gap-4 cursor-pointer hover:bg-white/10 transition-all">
                                <div
                                  className="w-6 h-6 rounded-full shadow-inner border border-white/30 group-hover:scale-110 transition-transform"
                                  style={{ backgroundColor: config.textColor }}
                                />
                                <span className="text-xs font-mono font-black text-white/60 uppercase">{config.textColor}</span>
                              </div>
                              <input
                                type="color"
                                value={config.textColor}
                                onChange={e => setConfig(p => ({ ...p, textColor: e.target.value }))}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                              />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Font Size</label>
                            <div className="relative">
                              <select
                                value={config.fontSize}
                                onChange={e => setConfig(p => ({ ...p, fontSize: e.target.value as BrandFontSize }))}
                                className="w-full h-14 bg-white/5 rounded-sm border border-white/20 px-4 appearance-none text-xs font-black text-white/70 focus:outline-none"
                              >
                                {sizeOptions.map(o => (
                                  <option key={o.value} value={o.value} className="bg-slate-900">
                                    {o.label}
                                  </option>
                                ))}
                              </select>
                              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 text-white/70 pointer-events-none" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 flex items-center gap-2">
                            <StarIcon className="w-3.5 h-3.5" /> Branding Typography
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            {fontOptions.map(opt => (
                              <button
                                key={opt.value}
                                onClick={() => setConfig(p => ({ ...p, fontFamily: opt.value as BrandFontFamily }))}
                                className={`h-24 rounded-sm border transition-all flex flex-col items-center justify-center gap-2 group relative overflow-hidden ${config.fontFamily === opt.value ? 'bg-white/20 border-white text-white shadow-xl' : 'bg-white/5 border-white/10 text-white/20 hover:bg-white/10 hover:text-white/40'}`}
                              >
                                <span className={`text-2xl font-black italic ${opt.value}`}>Aa</span>
                                <span className="text-[8px] font-black uppercase tracking-widest">{opt.label}</span>
                                {config.fontFamily === opt.value && (
                                  <motion.div layoutId="brand-font-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="menu" className="m-0 focus-visible:ring-0">
                  <div className="flex flex-col gap-8 backdrop-blur-xl bg-white/10 border border-white/60 p-6 md:p-10 rounded-sm shadow-2xl">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-8 rounded-sm bg-white/5 border border-white/10 group hover:border-white/40 transition-all gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-sm bg-white/10 flex items-center justify-center border border-white/10">
                          <Anchor className="w-6 h-6 text-white/80" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-white font-black italic tracking-tight text-lg uppercase leading-tight">Persistent Theme</h4>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Anchor the navbar to the top</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest transition-colors ${config.menuSticky ? 'text-white' : 'text-white/80'}`}
                        >
                          {config.menuSticky ? 'Enabled' : 'Disabled'}
                        </span>
                        <Switch
                          checked={config.menuSticky}
                          onCheckedChange={v => setConfig(p => ({ ...p, menuSticky: v }))}
                          className="data-[state=checked]:bg-green/20 data-[state=unchecked]:bg-white/10 scale-125 border border-white/50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4 flex flex-col p-8 rounded-sm bg-white/5 border border-white/10 hover:border-white/40 transition-all">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 flex items-center gap-2">
                          <Palette className="w-3 h-3" /> Menu Background Colour
                        </label>
                        <div className="relative group flex-1">
                          <div className="h-20 bg-black/40 rounded-sm border border-white/20 flex items-center justify-between px-6 cursor-pointer hover:bg-white/5 transition-all">
                            <div className="flex items-center gap-4">
                              <div
                                className="w-10 h-10 rounded-sm border border-white/40 shadow-2xl group-hover:rotate-6 transition-transform"
                                style={{ backgroundColor: config.menuBackgroundColor }}
                              />
                              <div className="flex flex-col">
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Hex Code</span>
                                <span className="text-sm font-mono font-bold text-white uppercase">{config.menuBackgroundColor}</span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-white/20" />
                          </div>
                          <input
                            type="color"
                            value={config.menuBackgroundColor}
                            onChange={e => setConfig(p => ({ ...p, menuBackgroundColor: e.target.value }))}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                        </div>
                      </div>

                      <div className="space-y-4 flex flex-col p-8 rounded-sm bg-white/5 border border-white/10 hover:border-white/40 transition-all">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 flex items-center gap-2">
                          <Palette className="w-3 h-3" /> text Colour
                        </label>
                        <div className="relative group flex-1">
                          <div className="h-20 bg-black/40 rounded-sm border border-white/20 flex items-center justify-between px-6 cursor-pointer hover:bg-white/5 transition-all">
                            <div className="flex items-center gap-4">
                              <div
                                className="w-10 h-10 rounded-sm border border-white/40 shadow-2xl group-hover:rotate-6 transition-transform"
                                style={{ backgroundColor: config.menuTextColor }}
                              />
                              <div className="flex flex-col">
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Ink Value</span>
                                <span className="text-sm font-mono font-bold text-white uppercase">{config.menuTextColor}</span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-white/20" />
                          </div>
                          <input
                            type="color"
                            value={config.menuTextColor}
                            onChange={e => setConfig(p => ({ ...p, menuTextColor: e.target.value }))}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-8 rounded-sm bg-white/5 border border-white/10 flex flex-col gap-10 hover:border-white/40 transition-all">
                      <div className="space-y-8">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 flex items-center gap-2">
                            <GlassWater className="w-3.5 h-3.5" /> Background Transparency
                          </label>
                          <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                            <Activity className="w-3 h-3 text-indigo-400" />
                            <span className="text-[10px] font-black text-white">{config.backgroundTransparent}%</span>
                          </div>
                        </div>

                        <div className="relative pt-4 pb-2 px-1">
                          <Slider
                            value={[config.backgroundTransparent]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={v => setConfig(p => ({ ...p, backgroundTransparent: v[0] }))}
                            className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-indigo-500 [&_[role=slider]]:w-5 [&_[role=slider]]:h-5"
                          />
                          <div className="flex justify-between mt-4">
                            {[0, 25, 50, 75, 100].map(tick => (
                              <button
                                key={tick}
                                onClick={() => setConfig(p => ({ ...p, backgroundTransparent: tick }))}
                                className={`text-sm font-black text-white/60`}
                              >
                                {tick}%
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="h-12 w-full rounded-sm relative overflow-hidden border border-white/10 bg-white/5">
                          <div className="absolute inset-0 grid grid-cols-12 opacity-10">
                            {Array.from({ length: 24 }).map((_, i) => (
                              <div key={i} className="border-r border-b border-white" />
                            ))}
                          </div>
                          <motion.div
                            initial={false}
                            animate={{ opacity: config.backgroundTransparent / 100 }}
                            className="absolute inset-0 flex items-center justify-center font-black text-[10px] uppercase tracking-[0.5em]"
                            style={{ backgroundColor: config.menuBackgroundColor, color: config.menuTextColor }}
                          >
                            Visual Preview
                          </motion.div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row justify-between md:items-end gap-8">
                        <div className="flex-1 space-y-6">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 flex items-center gap-2">
                            <Type className="w-3.5 h-3.5" /> Interaction Geometry
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.15em]">Sizing Hierarchy</span>
                              <div className="relative">
                                <select
                                  value={config.menuFontSize}
                                  onChange={e => setConfig(p => ({ ...p, menuFontSize: e.target.value as BrandFontSize }))}
                                  className="w-full h-14 bg-white/5 rounded-sm border border-white/20 px-4 text-xs font-black text-white appearance-none focus:outline-none focus:border-white transition-colors"
                                >
                                  {sizeOptions.map(o => (
                                    <option key={o.value} value={o.value} className="bg-slate-900">
                                      {o.label}
                                    </option>
                                  ))}
                                </select>
                                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 text-white/30 pointer-events-none" />
                              </div>
                            </div>
                            <div className="flex items-center gap-6 pt-6">
                              <div className="flex-1 h-px bg-white/10" />
                              <div className={`${config.menuFontSize} ${config.menuFontFamily} italic font-black text-white/60 tracking-tight`}>
                                Preview Text
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 flex items-center gap-2">
                          <MousePointer2 className="w-3.5 h-3.5" /> Theme Typeface
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {fontOptions.map(opt => (
                            <button
                              key={opt.value}
                              onClick={() => setConfig(p => ({ ...p, menuFontFamily: opt.value as BrandFontFamily }))}
                              className={`h-28 rounded-sm border transition-all flex flex-col items-center justify-center gap-2 group relative overflow-hidden ${config.menuFontFamily === opt.value ? 'bg-white/20 border-white text-white shadow-2xl' : 'bg-white/5 border-white/10 text-white/20 hover:bg-white/10 hover:text-white/40'}`}
                            >
                              <span className={`text-3xl font-black italic ${opt.value}`}>Aa</span>
                              <span className="text-[9px] font-black uppercase tracking-widest">{opt.label}</span>
                              {config.menuFontFamily === opt.value && (
                                <motion.div layoutId="menu-font-active" className="absolute top-0 left-0 right-0 h-0.5 bg-white" />
                              )}
                              <div
                                className={`absolute bottom-2 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-bold uppercase tracking-widest ${config.menuFontFamily === opt.value ? 'opacity-100 text-white/60' : 'text-white/20'}`}
                              >
                                Select Style
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
}
