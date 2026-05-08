/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import Image from 'next/image';
import { Shield, Clock, Award } from 'lucide-react';

import { defaultDataSection3, ISection3Data, Section3Props } from './data';

const QuerySection3 = ({ data }: Section3Props) => {
  let sectionData = defaultDataSection3;
  if (data && typeof data === 'string') {
    sectionData = JSON.parse(data) as ISection3Data;
  }

  const icons = [Shield, Clock, Award];

  return (
    <div className="relative overflow-hidden  bg-gradient-to-br from-blue-950 via-indigo-950 to-blue-950 border border-blue-500/20 shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.1),transparent_50%)]" />

      <div className="relative p-8 lg:p-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-blue-300 text-sm font-semibold uppercase tracking-wider">{sectionData.heading}</span>
              </div>

              <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">{sectionData.featuredLabel}</h2>

              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">{sectionData.title}</h1>

              <p className="text-xl text-blue-200 font-medium">{sectionData.subtitle}</p>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300 text-lg leading-relaxed">{sectionData.description}</p>
              <p className="text-gray-400 leading-relaxed">{sectionData.additionalDescription}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sectionData.highlights &&
                sectionData.highlights.length > 0 &&
                sectionData.highlights.map((highlight, index) => {
                  const Icon = icons[index % icons.length];
                  return (
                    <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                      <Icon className="w-6 h-6 text-blue-400 mb-2" />
                      <p className="text-white text-sm font-medium">{highlight}</p>
                    </div>
                  );
                })}
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-500/30">
                {sectionData.buttonPrimary}
              </button>
              <button className="px-8 py-4 rounded-xl bg-white/5 border-2 border-blue-500/30 text-white font-semibold hover:bg-white/10 transition-all duration-300">
                {sectionData.buttonSecondary}
              </button>
            </div>

            <div className="flex items-center gap-6 pt-6 border-t border-white/10">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{sectionData.studentCount}</p>
                <p className="text-gray-400 text-sm">{sectionData.enrollmentText}</p>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <p className="text-blue-300 text-sm font-medium">{sectionData.ctaText}</p>
            </div>
          </div>

          <div className="relative">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
              <Image src={sectionData.image || '/section-3.png'} alt={sectionData.title} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-6 -right-6 w-64 h-64 rounded-2xl overflow-hidden shadow-xl border-4 border-blue-950">
              <Image src={sectionData.image || '/section-3.png'} alt={sectionData.title} fill className="object-cover" priority />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default QuerySection3;
