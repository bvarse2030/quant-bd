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
import { Plus, X, UploadCloud } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/dialog';

interface InternalImageDialogProps {
  onImageSelect: (newImage: string) => void;
  selectedImages: string[];
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
}

const InternalImageDialog = ({ onImageSelect, selectedImages, maxSizeMB = 1, maxWidthOrHeight = 1920 }: InternalImageDialogProps) => {
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
        <Button asChild variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition mr-8">
          <label htmlFor="image-upload" className="cursor-pointer flex items-center gap-2 text-white/90">
            <UploadCloud className="w-4 h-4" />
            Upload
          </label>
        </Button>
        <Input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isLoading} />
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-48 text-white/70">Loading images...</div>
      ) : allAvailableImages.length > 0 ? (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {allAvailableImages.map(imageUrl => {
            const isSelected = selectedImages.includes(imageUrl);
            return (
              <DialogClose asChild key={imageUrl}>
                <div
                  onClick={() => !isSelected && onImageSelect(imageUrl)}
                  className={`
                    relative w-full aspect-square rounded-xl overflow-hidden
                    bg-white/10 backdrop-blur-sm
                    border border-white/10 shadow
                    transition-all duration-300
                    ${isSelected ? 'opacity-50 cursor-not-allowed ring-2 ring-emerald-400/70' : 'cursor-pointer hover:scale-[1.05] hover:shadow-xl'}
                  `}
                >
                  <Image src={imageUrl} fill alt="Media" className="object-cover" />
                </div>
              </DialogClose>
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
  value: string[];
  onChange: (newValues: string[]) => void;
  label?: string;
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
}

export default function ImageUploadManager({ value, onChange, label = 'Images', maxSizeMB = 1, maxWidthOrHeight = 1920 }: ImageUploadManagerProps) {
  const handleAddImage = (newImageUrl: string) => {
    if (!value.includes(newImageUrl)) {
      onChange([newImageUrl, ...value]);
    } else toast.info('Image already selected!');
  };

  const handleRemoveImage = (imageToRemove: string) => {
    onChange(value.filter(imageUrl => imageUrl !== imageToRemove));
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-white/90 font-semibold drop-shadow">{label}</h2>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outlineWater" size="sm" className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20 transition text-white/90">
              <Plus className="w-4 h-4" /> Add Image
            </Button>
          </DialogTrigger>

          <DialogContent
            className="
              max-w-3xl p-0 rounded-2xl
              bg-white/10 backdrop-blur-lg
              border border-white/20 shadow-2xl
              transition-all duration-300
            "
          >
            <InternalImageDialog onImageSelect={handleAddImage} selectedImages={value} maxSizeMB={maxSizeMB} maxWidthOrHeight={maxWidthOrHeight} />
          </DialogContent>
        </Dialog>
      </div>

      <div
        className="
          w-full min-h-[120px] rounded-xl p-4
          bg-white/5 backdrop-blur-md
          border border-white/20 shadow-inner
          flex items-center justify-center
          transition-all duration-300
        "
      >
        {value.length > 0 ? (
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {value.map(imageUrl => (
              <div
                key={imageUrl}
                className="
                  relative w-full aspect-square rounded-xl overflow-hidden
                  bg-white/10 border border-white/10 backdrop-blur-sm
                  shadow-lg hover:scale-[1.03] hover:shadow-2xl
                  transition-all duration-300 group
                "
              >
                <Image src={imageUrl} alt="Selected media" fill className="object-cover" />

                <button
                  onClick={() => handleRemoveImage(imageUrl)}
                  className="
                    absolute top-1 right-1 bg-red-600 text-white w-6 h-6
                    rounded-full flex items-center justify-center
                    opacity-0 group-hover:opacity-100 transition-opacity
                  "
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-white/60">
            <p>No images selected.</p>
            <p className="text-sm">Click &quot;Add Image&quot; to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
}
