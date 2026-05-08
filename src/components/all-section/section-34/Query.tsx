/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { Star } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { defaultDataSection34, ISection34Data, Section34Props } from './data';

const QuerySection34 = ({ data }: Section34Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  let sectionData = defaultDataSection34;
  if (data) {
    if (typeof data === 'string') {
      try {
        sectionData = JSON.parse(data) as ISection34Data;
      } catch (e) {
        console.error('Failed to parse section data', e);
      }
    } else {
      sectionData = data;
    }
  }

  const features = sectionData.features?.length > 0 ? sectionData.features : defaultDataSection34.features;

  useEffect(() => {
    setIsVisible(true);
    if (features.length > 0) {
      const interval = setInterval(() => {
        setCurrentFeature(prev => (prev + 1) % features.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [features.length]);

  return (
    <div className="w-full bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 py-20 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-red-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          <div
            className={`inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-red-100 text-red-700 px-6 py-2.5 rounded-full text-sm font-semibold mb-10 shadow-sm hover:shadow-md transition-all duration-1000 ease-out transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span>{sectionData.badgeText}</span>
          </div>

          <h1
            className={`text-5xl md:text-7xl lg:text-8xl font-bold text-slate-900 mb-8 leading-[1.1] tracking-tight transform transition-all duration-1000 delay-200 ease-out ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`}
          >
            {sectionData.headingLine1}{' '}
            <span className="text-red-500 relative inline-block">
              {sectionData.headingHighlight}
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-red-200" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
            </span>
            <br />
            {sectionData.headingLine2}
            <br />
            <span className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">{sectionData.headingGradient}</span>
          </h1>

          <p
            className={`text-lg md:text-xl text-slate-600 mb-14 max-w-2xl mx-auto leading-relaxed transform transition-all duration-1000 delay-400 ease-out ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`}
          >
            {sectionData.subtitle}
          </p>

          <div
            className={`flex flex-wrap justify-center gap-4 transform transition-all duration-1000 delay-500 ease-out ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            {features.map((feature, index) => {
              const isActive = index === currentFeature;
              return (
                <div
                  key={index}
                  className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-500 border-2 cursor-default ${
                    isActive
                      ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/30 scale-105'
                      : 'bg-white/60 border-white/50 text-slate-500 hover:bg-white hover:text-slate-700 hover:border-red-200'
                  }`}
                >
                  {feature}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuerySection34;
