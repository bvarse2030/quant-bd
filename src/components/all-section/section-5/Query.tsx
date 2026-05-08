/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import Image from 'next/image';
import { TrendingUp, Award, Zap } from 'lucide-react';

import { defaultDataSection5, ISection5Data, Section5Props } from './data';

const QuerySection5 = ({ data }: Section5Props) => {
  let sectionData = defaultDataSection5;
  if (data && typeof data === 'string') {
    sectionData = JSON.parse(data) as ISection5Data;
  }

  const icons = [TrendingUp, Award, Zap];

  return (
    <div className="relative overflow-hidden  bg-gradient-to-br from-emerald-950 via-teal-950 to-emerald-950 border border-emerald-500/20 shadow-2xl">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="relative p-8 lg:p-12">
        <div className="grid lg:grid-cols-5 gap-8 items-center">
          <div className="lg:col-span-3 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                <Award className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300 text-sm font-semibold">{sectionData.heading}</span>
              </div>

              <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest">{sectionData.featuredLabel}</p>

              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">{sectionData.title}</h1>

              <p className="text-xl text-emerald-300 font-medium">{sectionData.subtitle}</p>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300 text-lg leading-relaxed">{sectionData.description}</p>
              <p className="text-gray-400 leading-relaxed">{sectionData.additionalDescription}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {sectionData.highlights &&
                sectionData.highlights.length > 0 &&
                sectionData.highlights.map((highlight, index) => {
                  const Icon = icons[index % icons.length];
                  return (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 hover:bg-emerald-500/10 transition-colors duration-300"
                    >
                      <Icon className="w-6 h-6 text-emerald-400 mb-2" />
                      <p className="text-white font-semibold text-sm">{highlight}</p>
                    </div>
                  );
                })}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:scale-105 transition-all duration-300 shadow-lg shadow-emerald-500/30">
                {sectionData.buttonPrimary}
              </button>
              <button className="px-8 py-4 rounded-xl bg-white/5 border-2 border-emerald-500/30 text-white font-semibold hover:bg-white/10 transition-all duration-300">
                {sectionData.buttonSecondary}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-6 border-t border-white/10">
              <div>
                <p className="text-3xl font-bold text-white">{sectionData.studentCount}</p>
                <p className="text-gray-400">{sectionData.enrollmentText}</p>
              </div>
              <div className="h-12 w-px bg-white/10 hidden sm:block" />
              <p className="text-emerald-300 text-sm font-medium">{sectionData.ctaText}</p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image src={sectionData.image || '/section-5.png'} alt={sectionData.title} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 to-transparent" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-48 rounded-xl overflow-hidden shadow-xl">
                <Image src={sectionData.secondaryImage || '/section-5.png'} alt="Team Work" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-950/60 to-transparent" />
              </div>
              <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex flex-col justify-center items-center">
                <p className="text-4xl font-bold text-white mb-1">10+</p>
                <p className="text-emerald-300 text-sm font-medium text-center">Years Experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default QuerySection5;
