/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import Image from 'next/image';
import { Calendar, Users } from 'lucide-react';

import { defaultDataSection4, ISection4Data, Section4Props } from './data';

const QuerySection4 = ({ data }: Section4Props) => {
  let sectionData = defaultDataSection4;
  if (data && typeof data === 'string') {
    sectionData = JSON.parse(data) as ISection4Data;
  }

  return (
    <div className="relative overflow-hidden  bg-gradient-to-br from-orange-950 via-red-950 to-orange-950 border border-orange-500/20 shadow-2xl">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative p-8 lg:p-12">
        <div className="mb-8 text-center">
          <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 mb-4">
            <span className="text-orange-300 text-sm font-bold uppercase tracking-widest">{sectionData.featuredLabel}</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent mb-4">
            {sectionData.title}
          </h1>

          <p className="text-2xl text-orange-200 font-medium mb-2">{sectionData.subtitle}</p>

          <div className="flex items-center justify-center gap-2 text-white">
            <Calendar className="w-5 h-5 text-orange-400" />
            <span className="text-xl font-semibold">{sectionData.heading}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl group">
            <Image src={sectionData.image || '/section-4.png'} alt={sectionData.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-orange-950/80 to-transparent" />
          </div>

          <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl group">
            <Image src={sectionData.secondaryImage || '/section-4.png'} alt={sectionData.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-red-950/80 to-transparent" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6 mb-8">
          <p className="text-gray-300 text-lg text-center leading-relaxed">{sectionData.description}</p>
          <p className="text-gray-400 text-center leading-relaxed">{sectionData.additionalDescription}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
          {sectionData.highlights &&
            sectionData.highlights.length > 0 &&
            sectionData.highlights.map((highlight, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm text-center hover:bg-white/10 transition-colors duration-300"
              >
                <p className="text-white font-semibold text-lg">{highlight}</p>
              </div>
            ))}
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-10 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg font-bold hover:scale-105 transition-all duration-300 shadow-lg shadow-orange-500/30">
              {sectionData.buttonPrimary}
            </button>
            <button className="px-10 py-4 rounded-xl bg-white/5 border-2 border-orange-500/30 text-white text-lg font-bold hover:bg-white/10 transition-all duration-300">
              {sectionData.buttonSecondary}
            </button>
          </div>

          <div className="flex items-center gap-8 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-orange-400" />
              <div>
                <p className="text-2xl font-bold text-white">{sectionData.studentCount}</p>
                <p className="text-gray-400 text-sm">{sectionData.enrollmentText}</p>
              </div>
            </div>
            <div className="h-12 w-px bg-white/20" />
            <p className="text-orange-300 font-semibold">{sectionData.ctaText}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuerySection4;
