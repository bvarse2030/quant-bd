/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import React from 'react';
import { defaultDataSection42, ISection42Data, Section42Props } from './data';

const QuerySection42 = ({ data }: Section42Props) => {
  let sectionData = defaultDataSection42;
  if (data) {
    if (typeof data === 'string') {
      try {
        sectionData = JSON.parse(data) as ISection42Data;
      } catch (e) {
        console.error('Failed to parse section data', e);
      }
    } else {
      sectionData = data;
    }
  }

  const stats = sectionData.stats?.length ? sectionData.stats : defaultDataSection42.stats;

  return (
    <section className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 py-20 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-20 relative">
          <div className="inline-flex items-center bg-white rounded-full px-6 py-2 shadow-sm mb-8 border border-red-50 animate-fade-in-up">
            <span className="text-red-500 font-bold text-sm uppercase tracking-wider">{sectionData.badgeText}</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
            {sectionData.headingPrefix}{' '}
            <span className="text-red-500 relative inline-block">
              {sectionData.headingHighlight}
              <div className="absolute -bottom-2 left-0 right-0 h-1.5 bg-red-500 rounded-full opacity-40"></div>
            </span>{' '}
            {sectionData.headingSuffix}
          </h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative p-6 bg-white/40 backdrop-blur-sm rounded-3xl border border-white/50 shadow-sm hover:shadow-xl hover:bg-white hover:-translate-y-1 transition-all duration-300 text-center group"
            >
              <div className="text-4xl md:text-5xl font-extrabold text-red-500 mb-2 drop-shadow-sm group-hover:scale-110 transition-transform duration-300 ease-out">
                {stat.number}
              </div>
              <div className="text-gray-600 font-semibold uppercase tracking-wide text-sm md:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuerySection42;
