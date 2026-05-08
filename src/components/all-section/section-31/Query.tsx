/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, BookOpen, Users, Award, TrendingUp, Play, Star, Zap } from 'lucide-react';

import { defaultDataSection31, ISection31Data, Section31Props } from './data';

const iconMap: { [key: string]: React.ReactNode } = {
  Users: <Users className="w-8 h-8" />,
  TrendingUp: <TrendingUp className="w-8 h-8" />,
  Award: <Award className="w-8 h-8" />,
  BookOpen: <BookOpen className="w-8 h-8" />,
  Star: <Star className="w-8 h-8" />,
  Zap: <Zap className="w-8 h-8" />,
};

interface StatCardProps {
  number: string;
  label: string;
  iconName: string;
}

const StatCard: React.FC<StatCardProps> = ({ number, label, iconName }) => {
  const icon = iconMap[iconName] || <Star className="w-8 h-8" />;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 border border-white/20 shadow-xl hover:shadow-2xl hover:bg-white/15">
      <div className="flex justify-center mb-4 text-white drop-shadow-lg">{icon}</div>
      <div className="text-3xl font-extrabold text-white mb-2 tracking-tight">{number}</div>
      <div className="text-white/70 text-sm font-medium uppercase tracking-wider">{label}</div>
    </div>
  );
};

const QuerySection31 = ({ data }: Section31Props) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  let sectionData = defaultDataSection31;
  if (data) {
    if (typeof data === 'string') {
      try {
        sectionData = JSON.parse(data) as ISection31Data;
      } catch (e) {
        console.error('Failed to parse section data', e);
      }
    } else {
      sectionData = data;
    }
  }

  const testimonials = sectionData.testimonials?.length ? sectionData.testimonials : defaultDataSection31.testimonials;
  const stats = sectionData.stats?.length ? sectionData.stats : defaultDataSection31.stats;

  useEffect(() => {
    setIsVisible(true);
    if (testimonials.length > 0) {
      const interval = setInterval(() => {
        setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  return (
    <main className="w-full">
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 relative overflow-hidden flex items-center justify-center py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className={`transform transition-all duration-1000 ease-out ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}>
              <div className="inline-flex items-center bg-white/5 backdrop-blur-md rounded-full px-5 py-2 mb-8 border border-white/10 shadow-lg hover:bg-white/10 transition-colors cursor-default">
                <Star className="w-4 h-4 text-yellow-400 mr-2.5 fill-yellow-400" />
                <span className="text-white/90 text-xs sm:text-sm font-semibold tracking-wide uppercase">{sectionData.badge}</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-[1.1]">
                {sectionData.headingPrefix} <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {sectionData.headingGradient}
                </span>{' '}
                {sectionData.headingSuffix}
              </h1>

              <p className="text-lg lg:text-xl text-indigo-100/80 mb-10 leading-relaxed max-w-xl">{sectionData.description}</p>

              <div className="flex flex-col sm:flex-row gap-5 mb-12">
                <button className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center group transition-all duration-300 shadow-xl shadow-purple-900/30">
                  <span className="relative z-10 flex items-center">
                    {sectionData.buttonPrimary}
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>

                <button className="relative px-8 py-4 rounded-2xl font-bold text-white overflow-hidden group">
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/20 group-hover:bg-white/10 transition-colors" />
                  <span className="relative z-10 flex items-center justify-center">
                    <Play className="w-5 h-5 mr-3 fill-white" />
                    {sectionData.buttonSecondary}
                  </span>
                </button>
              </div>

              {testimonials.length > 0 && (
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 max-w-md shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-pink-500" />
                  <div className="flex items-center space-x-5 transition-opacity duration-500">
                    <div className="w-16 h-16 shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner border border-white/20">
                      {testimonials[currentTestimonial].score.replace(/[^0-9.]/g, '')}
                    </div>
                    <div>
                      <p className="text-white font-medium text-lg leading-snug mb-1">&ldquo;{testimonials[currentTestimonial].text}&rdquo;</p>
                      <div className="flex items-center gap-2">
                        <div className="h-px w-8 bg-white/30" />
                        <p className="text-indigo-200 text-sm font-medium tracking-wide">{testimonials[currentTestimonial].name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div
              className={`transform transition-all duration-1000 delay-300 ease-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}
            >
              <div className="grid grid-cols-2 gap-6 lg:gap-8">
                {stats.map((stat, idx) => (
                  <StatCard key={idx} number={stat.number} label={stat.label} iconName={stat.iconName} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default QuerySection31;
