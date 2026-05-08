/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import React from 'react';
import { BookOpen, Award, Play, Zap, Star, Globe, Monitor, HelpCircle } from 'lucide-react';

import { defaultDataSection32, ISection32Data, Section32Props } from './data';

const iconMap: { [key: string]: React.ReactNode } = {
  BookOpen: <BookOpen className="w-6 h-6 text-white" />,
  Award: <Award className="w-6 h-6 text-white" />,
  Play: <Play className="w-6 h-6 text-white" />,
  Zap: <Zap className="w-6 h-6 text-white" />,
  Star: <Star className="w-6 h-6 text-white" />,
  Globe: <Globe className="w-6 h-6 text-white" />,
  Monitor: <Monitor className="w-6 h-6 text-white" />,
};

const QuerySection32 = ({ data }: Section32Props) => {
  let sectionData = defaultDataSection32;
  if (data) {
    if (typeof data === 'string') {
      try {
        sectionData = JSON.parse(data) as ISection32Data;
      } catch (e) {
        console.error('Failed to parse section data', e);
      }
    } else {
      sectionData = data;
    }
  }

  const cards = sectionData.cards || defaultDataSection32.cards;

  return (
    <div className="w-full bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, idx) => {
            const Icon = iconMap[card.iconName] || <HelpCircle className="w-6 h-6 text-white" />;

            return (
              <div
                key={idx}
                className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                >
                  {Icon}
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 transition-colors">
                  {card.title}
                </h3>

                <p className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-600">{card.description}</p>

                <div
                  className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r ${card.gradient} group-hover:w-full transition-all duration-500 ease-in-out`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuerySection32;
