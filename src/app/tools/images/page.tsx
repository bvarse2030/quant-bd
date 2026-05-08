/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import NextImage from 'next/image';
import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [generatedImages, setGeneratedImages] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [maintainAspect, setMaintainAspect] = useState(true);
  const [useSmartBackground, setUseSmartBackground] = useState(false);

  const [targetSizes, setTargetSizes] = useState([
    { width: 144, height: 144 },
    { width: 192, height: 192 },
    { width: 412, height: 412 },
    { width: 412, height: 915 },
    { width: 512, height: 512 },
    { width: 1280, height: 720 },
  ]);

  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleAddSize = () => {
    const w = parseInt(customWidth);
    const h = parseInt(customHeight);
    if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
      setTargetSizes([...targetSizes, { width: w, height: h }]);
      setCustomWidth('');
      setCustomHeight('');
    }
  };

  useEffect(() => {
    if (!selectedImage) return;

    const processImages = async () => {
      const img = new Image();
      img.src = selectedImage;
      await new Promise(resolve => {
        img.onload = resolve;
      });

      let detectedBgColor = 'rgba(0,0,0,0)';
      if (useSmartBackground) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.drawImage(img, 0, 0);
          const p = tempCtx.getImageData(0, 0, 1, 1).data;
          detectedBgColor = p[3] === 0 ? 'rgba(0,0,0,0)' : `rgba(${p[0]}, ${p[1]}, ${p[2]}, ${p[3] / 255})`;
        }
      }

      const newImages = targetSizes
        .map(size => {
          const canvas = document.createElement('canvas');
          canvas.width = size.width;
          canvas.height = size.height;
          const ctx = canvas.getContext('2d');

          if (ctx) {
            if (useSmartBackground) {
              ctx.fillStyle = detectedBgColor;
              ctx.fillRect(0, 0, size.width, size.height);
            } else {
              ctx.clearRect(0, 0, size.width, size.height);  
            }

            if (maintainAspect) {
              const scale = Math.min(size.width / img.width, size.height / img.height);
              const x = size.width / 2 - (img.width * scale) / 2;
              const y = size.height / 2 - (img.height * scale) / 2;

              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';

              ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
            } else {
              ctx.drawImage(img, 0, 0, size.width, size.height);
            }

            const dataUrl = canvas.toDataURL('image/png');

            const sizeInBytes = Math.round((dataUrl.length * 3) / 4);
            const sizeInKb = (sizeInBytes / 1024).toFixed(2);

            return {
              width: size.width,
              height: size.height,
              url: dataUrl,
              fileSize: `${sizeInKb} KB`,
            };
          }
          return null;
        })
        .filter(Boolean);

      setGeneratedImages(newImages);
    };

    processImages();
  }, [selectedImage, targetSizes, maintainAspect, useSmartBackground]);

  const triggerDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = (url: string, width: number, height: number) => {
    triggerDownload(url, `icon-${width}x${height}.png`);
  };

  const handleDownloadAll = () => {
    if (generatedImages.length === 0) return;
    generatedImages.forEach((img, index) => {
      setTimeout(() => {
        triggerDownload(img.url, `icon-${img.width}x${img.height}.png`);
      }, index * 200);
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8 pt-[80px]">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 mt-[-65px] pt-20 border-b border-gray-800 pb-6 gap-4">
        <h1 className="text-3xl font-bold text-white tracking-tight">Image Resizer</h1>

        <div className="flex flex-wrap gap-3 justify-end">
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />

          {generatedImages.length > 0 && (
            <button
              onClick={handleDownloadAll}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-6 rounded-lg shadow-lg shadow-indigo-900/20 transition-all flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download All
            </button>
          )}

          <button
            onClick={triggerUpload}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg shadow-lg shadow-blue-900/20 transition-all"
          >
            {selectedImage ? 'Change Image' : 'Upload Image'}
          </button>
        </div>
      </div>

      {selectedImage ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-200">Add Custom Size</h3>
              <div className="flex items-end gap-4 flex-wrap">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Width</label>
                  <input
                    type="number"
                    value={customWidth}
                    onChange={e => setCustomWidth(e.target.value)}
                    className="bg-gray-800 border border-gray-700 text-white rounded px-3 py-2 w-24 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Height</label>
                  <input
                    type="number"
                    value={customHeight}
                    onChange={e => setCustomHeight(e.target.value)}
                    className="bg-gray-800 border border-gray-700 text-white rounded px-3 py-2 w-24 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handleAddSize}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 px-4 rounded transition-colors h-[42px]"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-200">Resizing Options</h3>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={maintainAspect}
                    onChange={e => setMaintainAspect(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded border-gray-700 bg-gray-800 focus:ring-blue-600 focus:ring-offset-gray-900"
                  />
                  <span className="text-gray-300 group-hover:text-white transition-colors">Maintain Aspect Ratio (Prevent Distortion)</span>
                </label>

                <label
                  className={`flex items-center gap-3 cursor-pointer group transition-opacity ${!maintainAspect ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
                >
                  <input
                    type="checkbox"
                    checked={useSmartBackground}
                    onChange={e => setUseSmartBackground(e.target.checked)}
                    disabled={!maintainAspect}
                    className="w-5 h-5 text-blue-600 rounded border-gray-700 bg-gray-800 focus:ring-blue-600 focus:ring-offset-gray-900"
                  />
                  <span className="text-gray-300 group-hover:text-white transition-colors">Auto-Extend Background Color</span>
                </label>
                <p className="text-xs text-gray-500 ml-8">
                  {useSmartBackground
                    ? "Detects the logo's corner color and fills the empty space."
                    : 'Leaves empty space transparent (Recommended for PNG icons).'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {generatedImages.map((img, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-xl border border-gray-800 shadow-xl overflow-hidden flex flex-col group hover:border-gray-700 transition-all"
              >
                <div className="p-4 bg-gray-800/50 flex justify-center items-center h-48 relative">
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '10px 10px' }}
                  ></div>

                  <NextImage
                    width={200}
                    height={200}
                    src={img.url}
                    alt={`${img.width}x${img.height}`}
                    className="max-h-full max-w-full object-contain relative z-10 shadow-md"
                    unoptimized={true}
                  />
                </div>
                <div className="p-4 flex flex-col gap-3 flex-grow">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                    <span className="font-bold text-gray-200">
                      {img.width} x {img.height}
                    </span>
                    <span className="text-xs bg-gray-800 text-gray-400 border border-gray-700 px-2 py-1 rounded-full">{img.fileSize}</span>
                  </div>

                  <button
                    onClick={() => handleDownload(img.url, img.width, img.height)}
                    className="mt-auto w-full bg-gray-800 hover:bg-gray-700 text-blue-400 hover:text-blue-300 border border-gray-700 text-sm font-medium py-2 rounded transition-colors flex items-center justify-center gap-2 group-hover:border-blue-500/50"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] border-2 border-dashed border-gray-800 rounded-xl bg-gray-900/50">
          <div className="bg-gray-800 p-4 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-gray-400 text-lg mb-4">No image selected</p>
          <button onClick={triggerUpload} className="text-blue-400 hover:text-blue-300 font-medium hover:underline">
            Click here to upload an image
          </button>
        </div>
      )}
    </div>
  );
}
