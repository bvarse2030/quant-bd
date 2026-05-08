/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import React from 'react';
import { Calendar, PlayCircle } from 'lucide-react';

import { defaultDataSection40, ISection40Data, Section40Props } from './data';

const QuerySection40 = ({ data }: Section40Props) => {
  let sectionData = defaultDataSection40;
  if (data) {
    if (typeof data === 'string') {
      try {
        sectionData = JSON.parse(data) as ISection40Data;
      } catch (e) {
        console.error('Failed to parse section data', e);
      }
    } else {
      sectionData = data;
    }
  }

  return (
    <div className="w-full bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 py-16 px-4">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 rounded-[2.5rem] p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_40%)] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_40%)] pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight drop-shadow-sm">{sectionData.title}</h2>
            <p className="text-lg md:text-xl mb-10 opacity-95 font-medium max-w-2xl mx-auto leading-relaxed">{sectionData.subtitle}</p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-10">
              <button className="bg-white text-red-600 hover:bg-slate-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 active:scale-95 flex items-center group min-w-[200px] justify-center">
                {sectionData.buttonPrimaryText}
                <Calendar className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform text-red-500" />
              </button>

              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold text-lg border border-white/40 transition-all duration-300 flex items-center group hover:-translate-y-1 active:translate-y-0 active:scale-95 min-w-[200px] justify-center shadow-lg">
                <PlayCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                {sectionData.buttonSecondaryText}
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-white/20 inline-block px-8">
              <p className="opacity-90 mb-2 text-sm md:text-base font-medium uppercase tracking-wide">{sectionData.contactLabel}</p>
              <div className="text-2xl md:text-3xl font-extrabold tracking-tight">{sectionData.contactNumber}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuerySection40;
