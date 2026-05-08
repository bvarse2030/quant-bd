/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import Image from 'next/image';
import { Users, MessageSquare, Rocket } from 'lucide-react';

import { defaultDataSection6, ISection6Data, Section6Props } from './data';

const ClientSection6 = ({ data }: Section6Props) => {
  let sectionData = defaultDataSection6;
  if (data && typeof data === 'string') {
    sectionData = JSON.parse(data) as ISection6Data;
  }

  const icons = [MessageSquare, Users, Rocket];

  return (
    <div className="relative overflow-hidden  bg-gradient-to-br from-violet-950 via-fuchsia-950 to-violet-950 border border-violet-500/20 shadow-2xl">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_50%)]" />
      </div>

      <div className="relative p-8 lg:p-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 mb-4">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500" />
            </div>
            <span className="text-violet-300 text-sm font-semibold uppercase tracking-wider">{sectionData.heading}</span>
          </div>

          <p className="text-fuchsia-400 text-xs font-bold uppercase tracking-widest mb-3">{sectionData.featuredLabel}</p>

          <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent mb-4 leading-tight">
            {sectionData.title}
          </h1>

          <p className="text-2xl text-violet-200 font-semibold mb-6">{sectionData.subtitle}</p>

          <div className="max-w-3xl mx-auto space-y-3">
            <p className="text-gray-300 text-lg leading-relaxed">{sectionData.description}</p>
            <p className="text-gray-400 leading-relaxed">{sectionData.additionalDescription}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          <div className="relative h-72 rounded-2xl overflow-hidden shadow-2xl group">
            <Image
              src={sectionData.image || '/section-6.png'}
              alt={sectionData.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-violet-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white text-xl font-bold">Collaborative Learning</p>
            </div>
          </div>

          <div className="relative h-72 rounded-2xl overflow-hidden shadow-2xl group">
            <Image
              src={sectionData.secondaryImage || '/section-6.png'}
              alt="Community Discussion"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white text-xl font-bold">Global Networking</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          {sectionData.highlights &&
            sectionData.highlights.length > 0 &&
            sectionData.highlights.map((highlight, index) => {
              const Icon = icons[index % icons.length];
              return (
                <div
                  key={index}
                  className="group p-6 rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 hover:border-violet-500/40 transition-all duration-300 hover:scale-105"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-white font-semibold text-lg">{highlight}</p>
                </div>
              );
            })}
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-10 py-4 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-lg font-bold hover:scale-105 transition-all duration-300 shadow-lg shadow-violet-500/30">
              {sectionData.buttonPrimary}
            </button>
            <button className="px-10 py-4 rounded-xl bg-white/5 border-2 border-violet-500/30 text-white text-lg font-bold hover:bg-white/10 transition-all duration-300">
              {sectionData.buttonSecondary}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 p-8 rounded-2xl bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/30 backdrop-blur-sm">
            <div className="text-center sm:text-left">
              <p className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">{sectionData.studentCount}</p>
              <p className="text-gray-400 text-sm">{sectionData.enrollmentText}</p>
            </div>
            <div className="h-12 w-px bg-white/20 hidden sm:block" />
            <p className="text-violet-300 font-semibold text-center sm:text-left">{sectionData.ctaText}</p>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default ClientSection6;
