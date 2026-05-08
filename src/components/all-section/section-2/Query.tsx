/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

import { defaultDataSection2, ISection2Data, Section2Props } from './data';

const QuerySection2 = ({ data }: Section2Props) => {
  let sectionData = defaultDataSection2;
  if (data && typeof data === 'string') {
    sectionData = JSON.parse(data) as ISection2Data;
  }
  return (
    <div className="relative overflow-hidden  bg-gradient-to-br from-slate-900/90 via-purple-900/90 to-slate-900/90 backdrop-blur-xl border border-white/20 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5" />

      <div className="relative grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
        <div className="space-y-6">
          <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
            <span className="text-purple-300 text-sm font-semibold">{sectionData.featuredLabel}</span>
          </div>

          <div className="space-y-3">
            <div className="inline-block px-3 py-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
              <span className="text-white text-xs font-bold uppercase tracking-wider">{sectionData.heading}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-tight">
              {sectionData.title}
            </h1>
            <p className="text-xl text-purple-300 font-medium">{sectionData.subtitle}</p>
          </div>

          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed">{sectionData.description}</p>
            <p className="text-gray-400 text-sm leading-relaxed">{sectionData.additionalDescription}</p>
          </div>

          <div className="space-y-3">
            {sectionData.highlights &&
              sectionData.highlights.length > 0 &&
              sectionData.highlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <span className="text-gray-300">{highlight}</span>
                </div>
              ))}
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <div className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/30">
              {sectionData.buttonPrimary}
            </div>
            <div className="px-8 py-3 rounded-xl bg-white/5 border border-white/20 text-white font-semibold hover:bg-white/10 transition-all duration-300">
              {sectionData.buttonSecondary}
            </div>
          </div>

          <div className="flex items-center gap-4 pt-6 border-t border-white/10">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-slate-900 flex items-center justify-center text-white text-sm font-semibold"
                >
                  {i}
                </div>
              ))}
            </div>
            <div>
              <p className="text-white font-bold">{sectionData.studentCount}</p>
              <p className="text-gray-400 text-sm">{sectionData.enrollmentText}</p>
            </div>
          </div>

          <div className="pt-4">
            <p className="text-purple-300 text-sm font-medium">{sectionData.ctaText}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl">
            <Image src={sectionData.image || '/section-2.png'} alt={sectionData.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
          </div>
          <div className="relative h-60 rounded-2xl overflow-hidden shadow-xl">
            <Image src={sectionData.secondaryImage || '/section-2.png'} alt={sectionData.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
          </div>
        </div>
      </div>

      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default QuerySection2;
