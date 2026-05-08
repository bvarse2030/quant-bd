/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import React from 'react';
import Image from 'next/image';

import { defaultDataSection33, ISection33Data, Section33Props } from './data';

const QuerySection33 = ({ data }: Section33Props) => {
  let sectionData = defaultDataSection33;
  if (data) {
    if (typeof data === 'string') {
      try {
        sectionData = JSON.parse(data) as ISection33Data;
      } catch (e) {
        console.error('Failed to parse section data', e);
      }
    } else {
      sectionData = data;
    }
  }

  const images = sectionData.avatarUrls || defaultDataSection33.avatarUrls;

  return (
    <div className="w-full bg-slate-900 py-12 flex justify-center items-center">
      <div className="relative text-center p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl max-w-2xl mx-auto overflow-hidden group">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -z-10 group-hover:bg-indigo-500/30 transition-all duration-700" />

        <p className="text-indigo-200/80 mb-6 text-sm font-medium tracking-wide uppercase">{sectionData.subTitle}</p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8">
          <div className="flex -space-x-4 hover:space-x-1 transition-all duration-300 p-2">
            {images.map((url, i) => (
              <div
                key={i}
                className="relative w-12 h-12 rounded-full border-[3px] border-slate-900 shadow-lg transform hover:-translate-y-2 hover:scale-110 hover:z-10 transition-all duration-300 bg-slate-800"
              >
                <Image src={url} alt={`Student ${i + 1}`} fill className="object-cover rounded-full" />
              </div>
            ))}
            <div className="relative w-12 h-12 rounded-full border-[3px] border-slate-900 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg z-0">
              <span className="animate-pulse">+</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
            <span className="text-white font-bold text-lg tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              {sectionData.countText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuerySection33;
