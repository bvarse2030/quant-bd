/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { Video, Database, LayoutGrid, Upload, VideoIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { CustomLink } from '@/components/common/LinkButton';
import YouTubeVideoUploadManager from './components/YTVideoUploadManager';
import YouTubeVideoUploadManagerSingle from './components/YTVideoUploadManagerSingle';

interface VideoAsset {
  url: string;
  name: string;
}

export default function VideoManagementPage() {
  const [singleVideo, setSingleVideo] = useState<VideoAsset>({ url: '', name: '' });
  const [multipleVideos, setMultipleVideos] = useState<VideoAsset[]>([]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto relative z-10 px-4 py-8 md:py-12">
        <header className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 shadow-2xl flex flex-col lg:flex-row justify-between items-center mb-12 gap-6 transition-all hover:bg-white/15">
          <nav className="w-full lg:w-auto">
            <Button variant="outlineGlassy" size="sm" className="opacity-100 scale-[1.02] border-white/40">
              <VideoIcon className="w-4 h-4" />
              <span className="font-bold text-xs uppercase tracking-tight text-white">YT Video Pipeline</span>
            </Button>
          </nav>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <CustomLink href="/dashboard/media/example/uploadthings" variant="outlineGlassy">
              <Upload size={16} /> Uploadthings
            </CustomLink>
            <CustomLink href="/dashboard/media/example/imagebb" variant="outlineGlassy">
              <Database size={16} /> Image BB
            </CustomLink>
            <CustomLink href="/dashboard/media" variant="outlineGlassy">
              <LayoutGrid size={16} /> Media
            </CustomLink>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <Video className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-white via-white/80 to-white/30 bg-clip-text text-transparent italic tracking-tighter">
                Single Asset Deployment
              </h3>
            </div>

            <div className="backdrop-blur-xl bg-white/10 border border-white/40 p-8 rounded-xl shadow-2xl min-h-[460px] flex flex-col">
              <YouTubeVideoUploadManagerSingle label="Primary Stream" value={singleVideo} onChange={val => setSingleVideo(val)} />
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <LayoutGrid className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-white via-white/80 to-white/30 bg-clip-text text-transparent italic tracking-tighter">
                Batch Collection
              </h3>
            </div>

            <div className="backdrop-blur-xl bg-white/10 border border-white/40 p-8 rounded-xl shadow-2xl min-h-[460px] flex flex-col">
              <YouTubeVideoUploadManager label="Production Queue" value={multipleVideos} onChange={val => setMultipleVideos(val)} />
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
