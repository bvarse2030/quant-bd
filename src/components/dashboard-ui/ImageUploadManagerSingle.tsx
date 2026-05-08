/*
|-----------------------------------------
| setting up ImageUploadManagerSingle for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import Image from 'next/image';
import { toast } from 'react-toastify';
import { useEffect, useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import { Plus, X, UploadCloud, RefreshCw, Image as ImageIcon } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface InternalImageDialogProps {
  onImageSelect: (newImage: string) => void;
  selectedImage: string;
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
}

const InternalImageDialog = ({ onImageSelect, selectedImage, maxSizeMB = 1, maxWidthOrHeight = 1920 }: InternalImageDialogProps) => {
  const [allAvailableImages, setAllAvailableImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/media');
      if (!response.ok) throw new Error('Failed to fetch images.');
      const data = await response.json();

      if (!data?.data || !Array.isArray(data.data)) {
        setAllAvailableImages([]);
        return;
      }

      const imageUrls: string[] = data.data.map((i: { url: string }) => i.url);
      setAllAvailableImages(imageUrls);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not fetch images.');
      setAllAvailableImages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const options = {
        maxSizeMB,
        maxWidthOrHeight,
        useWebWorker: true,
        fileType: 'image/jpeg' as const,
      };

      const compressedFile = await imageCompression(file, options);

      const formData = new FormData();
      formData.append('image', compressedFile);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        const newImageUrl = data.data.url;
        await fetch('/api/media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            delete_url: data.data.delete_url,
            url: newImageUrl,
            display_url: data.data.display_url,
          }),
        });
        toast.success('Image uploaded successfully!');
        onImageSelect(newImageUrl);
        setAllAvailableImages(prev => [newImageUrl, ...prev]);
      } else {
        throw new Error(data.error.message || 'Image upload failed.');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Cannot upload the image.');
    } finally {
      setIsLoading(false);
      e.target.value = '';
    }
  };

  return (
    <ScrollArea className="w-full h-[60vh] p-4 bg-white/5 backdrop-blur-md rounded-xl">
      <header className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
        <h2 className="text-white/90 font-semibold">Select an Image</h2>
        <Button asChild variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition mr-8 text-white/90">
          <label htmlFor="single-image-upload" className="cursor-pointer flex items-center gap-2">
            <UploadCloud className="w-4 h-4" />
            Upload
          </label>
        </Button>
        <Input id="single-image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isLoading} />
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-48 text-white/70">Loading images...</div>
      ) : allAvailableImages.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {allAvailableImages.map(imageUrl => {
            const isSelected = selectedImage === imageUrl;
            return (
              <div
                key={imageUrl}
                onClick={() => onImageSelect(imageUrl)}
                className={`
                  relative w-full aspect-square rounded-xl overflow-hidden
                  bg-white/10 backdrop-blur-sm
                  border border-white/10 shadow
                  transition-all duration-300
                  ${isSelected ? 'ring-2 ring-emerald-400/70 scale-[0.98]' : 'cursor-pointer hover:scale-[1.05] hover:shadow-xl'}
                `}
              >
                <Image src={imageUrl} fill alt="Media" className="object-cover" />
                {isSelected && (
                  <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                    <div className="bg-emerald-500 text-white rounded-full p-1 shadow-lg">
                      <Plus className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-white/60 py-10">No images found.</div>
      )}
    </ScrollArea>
  );
};

interface ImageUploadManagerProps {
  value: string;
  onChange: (newValue: string) => void;
  label?: string;
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
}

export default function ImageUploadManagerSingle({ value, onChange, label = 'Image', maxSizeMB = 1, maxWidthOrHeight = 1920 }: ImageUploadManagerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleImageSelect = (newImageUrl: string) => {
    onChange(newImageUrl);
    setIsOpen(false);
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-white/90 font-semibold drop-shadow">{label}</h2>

        {value && (
          <Button variant="ghost" size="sm" onClick={() => onChange('')} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 transition h-8">
            Clear Selection
          </Button>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div
            className={`
              group relative w-full min-h-[220px] rounded-xl overflow-hidden
              bg-white/5 backdrop-blur-md
              border border-white/20 shadow-inner
              flex items-center justify-center
              transition-all duration-300 cursor-pointer
              ${!value ? 'hover:bg-white/10 hover:border-white/30' : ''}
            `}
          >
            {value ? (
              <>
                {value && (
                  <div
                    className="
              relative w-full max-w-sm aspect-square rounded-xl overflow-hidden
              bg-white/10 border border-white/10 backdrop-blur-sm
              shadow-lg
              transition-all duration-300 group
            "
                  >
                    <Image src={value} alt="Selected image" fill className="object-cover" />

                    <button
                      onClick={handleRemoveImage}
                      className="
                absolute top-2 right-2 bg-red-600 text-white w-8 h-8
                rounded-full flex items-center justify-center
                opacity-0 group-hover:opacity-100 transition-opacity
                shadow-lg hover:bg-red-700
              "
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="bg-white/90 text-black hover:bg-white">
                      <RefreshCw className="w-4 h-4 mr-2" /> Change
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleRemoveImage}>
                      <X className="w-4 h-4 mr-2" /> Remove
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 text-white/50 group-hover:text-white/80 transition-colors">
                <div className="p-4 rounded-full bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Click to select an image</p>
                  <p className="text-xs opacity-70">Supports JPG, PNG, WEBP</p>
                </div>
              </div>
            )}
          </div>
        </DialogTrigger>

        <DialogContent
          className="
            max-w-3xl p-0 rounded-2xl
            bg-white/10 backdrop-blur-lg
            border border-white/20 shadow-2xl
            transition-all duration-300
          "
        >
          <InternalImageDialog onImageSelect={handleImageSelect} selectedImage={value} maxSizeMB={maxSizeMB} maxWidthOrHeight={maxWidthOrHeight} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
