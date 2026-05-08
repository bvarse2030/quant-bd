/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon, Database, LayoutGrid, Upload, VideoIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { CustomLink } from '@/components/common/LinkButton';

import ImageUploadManager from './components/ImageUploadManager';
import ImageUploadManagerSingle from './components/ImageUploadManagerSingle';

type TabType = 'image';

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ElementType;
}

const tabs: TabConfig[] = [{ id: 'image', label: 'Image', icon: ImageIcon }];

export default function AssetManagementPage() {
  const [activeTab, setActiveTab] = useState<TabType>('image');

  const [singleImage, setSingleImage] = useState<{ url: string; name: string }>({ url: '', name: '' });
  const [multipleImages, setMultipleImages] = useState<{ url: string; name: string }[]>([]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto relative z-10 px-4 py-8 md:py-12">
        <header className="backdrop-blur-xl bg-white/10 border border-white/40 rounded-xl p-4 shadow-2xl flex flex-col lg:flex-row justify-between items-center mb-12 gap-6 transition-all ">
          <nav className="w-full lg:w-auto overflow-x-auto">
            <div className="flex items-center gap-2 p-1 bg-transparent h-12 rounded-lg">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <Button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    variant="outlineGlassy"
                    size="sm"
                    className={`
                      ${isActive ? 'opacity-100  scale-[1.02] ' : 'opacity-40 hover:opacity-100 hover:border-white/50'}
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-bold text-xs uppercase tracking-tight">{tab.label}</span>
                  </Button>
                );
              })}
            </div>
          </nav>
          <div className=" flex items-end justify-end gap-2">
            <CustomLink href="/dashboard/media/example/uploadthings" variant="outlineGlassy">
              <Upload size={16} className="" />
              Uploadthings
            </CustomLink>
            <CustomLink href="/dashboard/media/example/yt-videos" variant="outlineGlassy">
              <VideoIcon size={16} className="" />
              YT Video
            </CustomLink>
            <CustomLink href="/dashboard/media" variant="outlineGlassy">
              <LayoutGrid size={16} className="mr-2" />
              MEDIA
            </CustomLink>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <section className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <Database className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-white via-white/80 to-white/30 bg-clip-text text-transparent italic tracking-tighter">
                    Single Asset
                  </h3>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/10 border border-white/60 p-8 rounded-xl shadow-2xl transition-all duration-500 hover:bg-white/15 min-h-[340px]">
                {activeTab === 'image' && (
                  <ImageUploadManagerSingle
                    value={singleImage}
                    onChange={val => {
                      setSingleImage({ url: val.url, name: val.name });
                    }}
                  />
                )}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <LayoutGrid className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-white via-white/80 to-white/30 bg-clip-text text-transparent italic tracking-tighter">
                    Multiple Asset
                  </h3>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/10 border border-white/60 p-8 rounded-xl shadow-2xl transition-all duration-500 hover:bg-white/15 min-h-[340px]">
                {activeTab === 'image' && (
                  <ImageUploadManager
                    value={multipleImages}
                    onChange={val => {
                      setMultipleImages([...val]);
                    }}
                  />
                )}
              </div>
            </section>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
