/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import React from 'react';
import { FileText, Target, BookOpen, Star, Zap, Shield, Award, HelpCircle } from 'lucide-react';

import { defaultDataSection36, ISection36Data, Section36Props } from './data';

const iconMap: { [key: string]: React.ElementType } = {
  FileText,
  Target,
  BookOpen,
  Star,
  Zap,
  Shield,
  Award,
};

const QuerySection36 = ({ data }: Section36Props) => {
  let sectionData = defaultDataSection36;
  if (data) {
    if (typeof data === 'string') {
      try {
        sectionData = JSON.parse(data) as ISection36Data;
      } catch (e) {
        console.error('Failed to parse section data', e);
      }
    } else {
      sectionData = data;
    }
  }

  const cards = sectionData.cards?.length ? sectionData.cards : defaultDataSection36.cards;

  return (
    <div className="w-full bg-gradient-to-br from-red-50 to-orange-50 py-16 px-4 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {cards.map((card, idx) => {
            const Icon = iconMap[card.iconName] || HelpCircle;

            return (
              <div
                key={idx}
                className="bg-white rounded-[2rem] p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-white/60 group relative overflow-hidden"
              >
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.gradient} opacity-[0.03] rounded-bl-[4rem] group-hover:opacity-[0.08] transition-opacity`}
                />

                <div
                  className={`w-16 h-16 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 text-white`}
                >
                  <Icon className="w-8 h-8" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 transition-all">
                  {card.title}
                </h3>

                <p className="text-slate-600 leading-relaxed text-sm md:text-base">{card.description}</p>

                <div className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${card.gradient} group-hover:w-full transition-all duration-500 ease-out`} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuerySection36;
