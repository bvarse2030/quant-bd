/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import React from 'react';
import { Users, BookOpen, Award, Star, Zap, CheckCircle, Shield, HelpCircle } from 'lucide-react';

import { defaultDataSection39, ISection39Data, Section39Props } from './data';

const iconMap: { [key: string]: React.ElementType } = {
  Users,
  BookOpen,
  Award,
  Star,
  Zap,
  CheckCircle,
  Shield,
};

const QuerySection39 = ({ data }: Section39Props) => {
  let sectionData = defaultDataSection39;
  if (data) {
    if (typeof data === 'string') {
      try {
        sectionData = JSON.parse(data) as ISection39Data;
      } catch (e) {
        console.error('Failed to parse section data', e);
      }
    } else {
      sectionData = data;
    }
  }

  const features = sectionData.features?.length ? sectionData.features : defaultDataSection39.features;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 py-16 md:py-24 px-4 sm:px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-2xl border border-white/60 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-orange-100/30 to-transparent rounded-bl-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-red-100/30 to-transparent rounded-tr-full pointer-events-none" />

          <div className="text-center mb-16 relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">{sectionData.title}</h2>
            <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed">{sectionData.subtitle}</p>
            <div className="mt-6 mx-auto w-24 h-1.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 relative z-10">
            {features.map((feature, idx) => {
              const Icon = iconMap[feature.iconName] || HelpCircle;
              return (
                <div key={idx} className="text-center group relative p-4 rounded-xl hover:bg-slate-50 transition-colors duration-300">
                  <div
                    className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${feature.gradient} rounded-[2rem] flex items-center justify-center transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 shadow-lg shadow-gray-200`}
                  >
                    <Icon className="w-9 h-9 text-white" />
                  </div>

                  <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-red-600 transition-colors">{feature.title}</h3>

                  <p className="text-gray-500 text-base leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuerySection39;
