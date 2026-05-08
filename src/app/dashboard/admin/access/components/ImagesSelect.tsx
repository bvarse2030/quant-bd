/*
|-----------------------------------------
| setting up ImagesSelect for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import Image from 'next/image';
import { Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import ImageDialog from './ImageDialog';

interface ImagesSelectProps {
  newImages: string[];
  setNewImages: (payload: string[]) => void;
}

export default function ImagesSelect({ newImages, setNewImages }: ImagesSelectProps) {
  const handleAddImages = (newSelectImage: string) => {
    if (!newImages.includes(newSelectImage)) {
      setNewImages([newSelectImage, ...newImages]);
    }
  };

  const handleRemoveImages = (imageToRemove: string) => {
    const updatedImages = newImages.filter(i => i !== imageToRemove);
    setNewImages(updatedImages);
  };

  const UploadButton = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-2" /> Add Image
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[80vw] md:max-w-[60vw] lg:max-w-[50vw]">
        <DialogHeader>
          <DialogTitle>Please Select an Image</DialogTitle>
        </DialogHeader>
        <ImageDialog handleAddImages={handleAddImages} />
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="w-full flex flex-col gap-2 p-2 border rounded-md">
      <div className="w-full flex items-center justify-between">
        <h2 className="font-semibold text-sm">Selected Images</h2>
        <UploadButton />
      </div>
      <div className="w-full min-h-[150px] p-2 bg-slate-50 rounded-lg flex items-center justify-center">
        {newImages && newImages.length > 0 ? (
          <div className="w-full grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {newImages.map((imageUrl, index) => (
              <div key={index + imageUrl} className="relative w-full aspect-square border border-slate-200 rounded-lg overflow-hidden group">
                <Image src={imageUrl} alt="Selected Media" layout="fill" objectFit="cover" />
                <div
                  onClick={() => handleRemoveImages(imageUrl)}
                  className="absolute top-1 right-1 bg-rose-500 hover:bg-rose-600 w-6 h-6 flex items-center justify-center rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="text-white h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col w-full items-center justify-center text-slate-500 text-sm">
            <p>No images selected.</p>
          </div>
        )}
      </div>
    </div>
  );
}
