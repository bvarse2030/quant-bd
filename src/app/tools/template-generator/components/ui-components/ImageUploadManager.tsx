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
import { Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const InternalImageDialog = ({ handleAddImages }: { handleAddImages: (newImage: string) => void }) => {
  const [allAvailableImages, setAllAvailableImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectImg, setSelectImg] = useState('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        const saveResponse = await fetch('/api/media', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            delete_url: data.data.delete_url,
            url: data.data.url,
            display_url: data.data.display_url,
          }),
        });

        if (!saveResponse.ok) {
          throw new Error('Error! Cannot save the image.');
        }
        setAllAvailableImages([data?.data?.url, ...allAvailableImages]);
        toast.success('Image uploaded successfully!');
        setShowUploadModal(false);
      } else {
        toast.error('Error! Cannot upload the image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error! Cannot upload the image');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/media');
        const data = await response.json();

        if (!data?.data || !Array.isArray(data.data)) {
          setAllAvailableImages([]);
          return;
        }

        const lstImage: string[] = data.data.map((i: { url: string }) => i.url);
        setAllAvailableImages(lstImage);
      } catch (error) {
        console.error('Error fetching images:', error);
        setAllAvailableImages([]);
      }
    };
    fetchImages();
  }, []);

  const handleSelect = (id: string) => {
    if (selectImg === id) {
      setSelectImg('');
    } else {
      handleAddImages(id);
      setSelectImg(id);
    }
  };

  return (
    <ScrollArea className="w-full h-[60vh] p-1 pr-2 border-1 border-slate-500">
      <main className="w-full min-h-[60vh] flex flex-col">
        <div className="flex justify-between items-center border-b border-slate-200 mb-2">
          <h1 className="text-xl w-full">Not here! Upload a new one</h1>
          <Button className="border-slate-500 hover:border-slate-600 border-1 cursor-pointer" onClick={() => setShowUploadModal(true)}>
            Upload
          </Button>
        </div>
        {showUploadModal ? (
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg w-96">
              <h3 className="text-lg font-semibold mb-4">Upload</h3>
              <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={loading} />
              {loading && <p className="mt-2">Uploading...</p>}
              <div className="flex justify-end gap-2 mt-4">
                <Button className="cursor-pointer" variant="outline" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {allAvailableImages.length > 0 ? (
              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-1">
                {allAvailableImages.map((i, index) => (
                  <div
                    onClick={() => handleSelect(i)}
                    key={index + i}
                    className={`relative w-full h-[150px] border-1 shadow-xl hover:shadow-2xl cursor-pointer hover:border-slate-600 flex items-center justify-center rounded-lg overflow-hidden ${
                      selectImg === i ? 'border-blue-500' : 'border-slate-300'
                    }`}
                  >
                    <Image src={i} fill alt="Media" objectFit="cover" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col w-full items-center justify-center mt-3">
                <p>Ops! there is no Image</p>
              </div>
            )}
          </div>
        )}
      </main>
    </ScrollArea>
  );
};

export default function ImageUploadManager() {
  const [allMyImages, setAllMyImages] = useState<string[]>([]);

  const handleAddImages = (newSelectImage: string) => {
    if (!allMyImages.includes(newSelectImage)) {
      setAllMyImages(prevImages => [newSelectImage, ...prevImages]);
    } else {
      toast.info('Image already added!');
    }
  };

  const handleRemoveImages = (imageToRemove: string) => {
    setAllMyImages(prevImages => prevImages.filter(i => i !== imageToRemove));
  };

  const UploadButton = () => {
    return (
      <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="border-slate-500 text-slate-600 hover:border-slate-600 border-1 cursor-pointer flex items-center justify-center px-2 rounded-lg text-sm py-1">
              <Plus className="w-4 h-4 mr-1" /> Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[80vw] md:max-w-[600px] h-[70vh] p-0">
            <DialogHeader className="p-4 pb-0">
              <DialogTitle>Please Select an Image</DialogTitle>
            </DialogHeader>
            <InternalImageDialog handleAddImages={handleAddImages} />
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full flex items-center justify-between">
        <h2>Images</h2>
        <UploadButton />
      </div>
      <div className="w-full min-h-[10vh] rounded-lg flex items-center justify-center p-2 border border-dashed border-gray-300">
        {allMyImages.length > 0 ? (
          <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {allMyImages.map((i, index) => (
              <div
                key={index + i}
                className={`relative w-full h-[150px] border-1 border-slate-300 shadow-xl hover:shadow-2xl flex items-center justify-center rounded-lg overflow-hidden`}
              >
                <Image src={i} alt="Media" objectFit="cover" fill />
                <div
                  onClick={() => handleRemoveImages(i)}
                  className="absolute top-1 right-1 bg-rose-500 w-6 h-6 flex items-center justify-center rounded-full cursor-pointer z-10"
                >
                  <X className="text-white h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col w-full items-center justify-center h-full text-gray-500">
            <p>No images selected yet. Click &quot;Add Image&quot; to begin!</p>
          </div>
        )}
      </div>
    </div>
  );
}
