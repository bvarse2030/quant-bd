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

import { Button } from '@/components/ui/button';
import { CustomLink } from '@/components/common/LinkButton';
import { Video, ImageIcon, FileText, FileCode, Music, Database, LayoutGrid, VideoIcon } from 'lucide-react';


import PdfUploadManager from '../uploadthings/components/PdfUploadManager';
import DocxUploadManager from '../uploadthings/components/DocxUploadManager';
import VideoUploadManger from '../uploadthings/components/VideoUploadManger';
import ImageUploadManager from '../uploadthings/components/ImageUploadManger';
import AudioUploadManager from '../uploadthings/components/AudioUploadManager';
import PdfUploadManagerSingle from '../uploadthings/components/PdfUploadManagerSingle';
import VideoUploadMangerSingle from '../uploadthings/components/VideoUploadMangerSingle';
import DocxUploadManagerSingle from '../uploadthings/components/DocxUploadManagerSingle';
import ImageUploadManagerSingle from '../uploadthings/components/ImageUploadMangerSingle';
import AudioUploadManagerSingle from '../uploadthings/components/AudioUploadManagerSingle';

type TabType = 'image' | 'video' | 'pdf' | 'docx' | 'audio';

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ElementType;
}

const tabs: TabConfig[] = [
  { id: 'image', label: 'Image', icon: ImageIcon },
  { id: 'video', label: 'Video', icon: Video },
  { id: 'pdf', label: 'PDF', icon: FileText },
  { id: 'docx', label: 'DOCX', icon: FileCode },
  { id: 'audio', label: 'Audio', icon: Music },
];

export default function AssetManagementPage() {
  const [activeTab, setActiveTab] = useState<TabType>('image');

  const [singleImage, setSingleImage] = useState<{ url: string; name: string }>({ url: '', name: '' });
  const [multipleImages, setMultipleImages] = useState<{ url: string; name: string }[]>([]);

  const [singleVideo, setSingleVideo] = useState<{ url: string; name: string }>({ url: '', name: '' });
  const [multipleVideos, setMultipleVideos] = useState<{ url: string; name: string }[]>([]);

  const [singlePdf, setSinglePdf] = useState<{ url: string; name: string }>({ url: '', name: '' });
  const [multiplePdfs, setMultiplePdfs] = useState<{ url: string; name: string }[]>([]);

  const [singleDocx, setSingleDocx] = useState<{ url: string; name: string }>({ url: '', name: '' });
  const [multipleDocxs, setMultipleDocxs] = useState<{ url: string; name: string }[]>([]);

  const [singleAudio, setSingleAudio] = useState<{ url: string; name: string }>({ url: '', name: '' });
  const [multipleAudios, setMultipleAudios] = useState<{ url: string; name: string }[]>([]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[400px] md:w-[800px] h-[800px] bg-indigo-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] md:w-[800px] h-[800px] bg-blue-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto relative z-10 px-4 py-8 md:py-12">
        <header className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 shadow-2xl flex flex-col lg:flex-row justify-between items-center mb-12 gap-6 transition-all hover:bg-white/15">
          <nav className="w-full lg:w-auto">
            <div className="flex items-center gap-2 p-1 bg-transparent h-12 rounded-lg flex-wrap">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <Button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      px-4 rounded-md flex items-center gap-2 transition-all duration-300 border backdrop-blur-xl whitespace-nowrap
                      ${
                        isActive
                          ? 'opacity-100 bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-white/50 shadow-xl shadow-purple-500/30 scale-[1.02] text-white'
                          : 'opacity-40 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-white/30 text-white hover:opacity-100 hover:border-white/50'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-bold text-xs uppercase tracking-tight">{tab.label}</span>
                  </Button>
                );
              })}
            </div>
          </nav>
          <div className="mt-8 md:mt-0 flex items-end justify-end gap-2">
            <CustomLink href="/dashboard/media/example/imagebb" variant="outlineGlassy">
              <ImageIcon size={16} className="" />
              Image BB
            </CustomLink>
            <CustomLink href="/dashboard/media/example/yt-videos" variant="outlineGlassy">
              <VideoIcon size={16} className="" />
              YT Video
            </CustomLink>
            <CustomLink href="/dashboard/media" variant="outlineGlassy">
              <LayoutGrid size={16} className="" />
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

              <div className="backdrop-blur-xl bg-white/10 border border-white/60 p-8 rounded-xl shadow-2xl transition-all duration-500 hover:bg-white/15 min-h-[380px]">
                {activeTab === 'image' && (
                  <ImageUploadManagerSingle
                    value={singleImage}
                    onChange={val => {
                      setSingleImage(val);
                    }}
                  />
                )}
                {activeTab === 'video' && (
                  <VideoUploadMangerSingle
                    value={singleVideo}
                    onChange={val => {
                      setSingleVideo(val);
                    }}
                  />
                )}
                {activeTab === 'pdf' && (
                  <PdfUploadManagerSingle
                    value={singlePdf}
                    onChange={val => {
                      setSinglePdf(val);
                    }}
                  />
                )}
                {activeTab === 'docx' && (
                  <DocxUploadManagerSingle
                    value={singleDocx}
                    onChange={val => {
                      setSingleDocx(val);
                    }}
                  />
                )}
                {activeTab === 'audio' && (
                  <AudioUploadManagerSingle
                    value={singleAudio}
                    onChange={val => {
                      setSingleAudio(val);
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

              <div className="backdrop-blur-xl bg-white/10 border border-white/60 p-8 rounded-xl shadow-2xl transition-all duration-500 hover:bg-white/15 min-h-[380px]">
                {activeTab === 'image' && (
                  <ImageUploadManager
                    value={multipleImages}
                    onChange={val => {
                      setMultipleImages([...val]);
                    }}
                  />
                )}
                {activeTab === 'video' && (
                  <VideoUploadManger
                    value={multipleVideos}
                    onChange={val => {
                      setMultipleVideos(val);
                    }}
                  />
                )}
                {activeTab === 'pdf' && (
                  <PdfUploadManager
                    value={multiplePdfs}
                    onChange={val => {
                      setMultiplePdfs(val);
                    }}
                  />
                )}
                {activeTab === 'docx' && (
                  <DocxUploadManager
                    value={multipleDocxs}
                    onChange={val => {
                      setMultipleDocxs(val);
                    }}
                  />
                )}
                {activeTab === 'audio' && (
                  <AudioUploadManager
                    value={multipleAudios}
                    onChange={val => {
                      setMultipleAudios(val);
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
