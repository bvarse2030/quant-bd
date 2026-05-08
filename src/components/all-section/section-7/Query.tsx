/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Award, Users, BookOpen, GraduationCap, CheckCircle2, ArrowRight, Globe, CalendarDays, Sparkles } from 'lucide-react';

import { defaultDataSection7, ISection7Data } from './data';

export interface Section7Props {
  data?: ISection7Data | string;
}

const ClientSection7: React.FC<Section7Props> = ({ data }) => {
  let sectionData: ISection7Data = defaultDataSection7;
  if (data) {
    try {
      sectionData = typeof data === 'string' ? JSON.parse(data) : data;
    } catch (e) {
      console.error('Failed to parse section data', e);
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const imageVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <section className="relative w-full overflow-hidden bg-white py-24 lg:py-32 font-sans text-slate-900">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-gradient-to-b from-blue-50 to-indigo-50/20 blur-3xl opacity-60 rounded-bl-[200px]" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-gradient-to-t from-emerald-50 to-teal-50/20 blur-3xl opacity-60 rounded-tr-[200px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center"
        >
          <div className="lg:col-span-7 space-y-10">
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold tracking-wide shadow-lg shadow-blue-500/20">
                <Award size={12} />
                {sectionData.accreditation}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                <CalendarDays size={12} />
                Est. {sectionData.established}
              </span>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.05] tracking-tight">{sectionData.universityName}</h1>
              <div className="flex items-center gap-2 text-lg text-slate-500 font-medium">
                <MapPin className="text-blue-500" size={20} />
                {sectionData.location}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="prose prose-lg text-slate-600 leading-relaxed max-w-2xl">
              {sectionData.description}
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sectionData.features &&
                sectionData.features.map((feature, idx) => (
                  <div key={idx} className="group flex items-center gap-3 p-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <CheckCircle2 size={16} />
                    </div>
                    <span className="text-slate-700 font-medium group-hover:text-blue-700 transition-colors">{feature}</span>
                  </div>
                ))}
            </motion.div>

            <motion.div variants={itemVariants} className="border-t border-slate-100 pt-8 space-y-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <GraduationCap size={16} />
                <span>Programs Available</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sectionData.programs &&
                  sectionData.programs.map((program, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl shadow-sm hover:border-blue-400 hover:text-blue-600 hover:shadow-md transition-all cursor-default select-none"
                    >
                      {program}
                    </span>
                  ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href={sectionData.buttonUrl || '#'}
                className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white text-lg font-bold rounded-2xl hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-600/20 transform hover:-translate-y-1 transition-all duration-300"
              >
                {sectionData.applyText}
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
              <a
                href={sectionData.websiteUrl || '#'}
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-700 text-lg font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 group"
              >
                <Globe className="mr-2 w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                {sectionData.buttonText || 'Visit Website'}
              </a>
            </motion.div>
          </div>

          <div className="lg:col-span-5 relative perspective-1000">
            <motion.div variants={imageVariants} className="relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-900 group">
              <div className="relative h-[600px] w-full">
                <Image
                  src={sectionData.bannerImage || '/placeholder.jpg'}
                  alt={sectionData.universityName}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
              </div>

              <div className="absolute top-6 right-6">
                <div className="bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-xl shadow-black/20 w-24 h-24 flex items-center justify-center transform transition-transform hover:scale-110 duration-300">
                  <div className="relative w-full h-full">
                    <Image src={sectionData.logoUrl || '/placeholder-logo.png'} alt="Logo" fill className="object-contain" />
                  </div>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl hover:bg-white/20 transition-colors">
                    <div className="flex items-center gap-2 text-blue-300 mb-2">
                      <Users size={20} />
                      <span className="text-xs font-bold uppercase tracking-wider">Students</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{sectionData.totalStudents}</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl hover:bg-white/20 transition-colors">
                    <div className="flex items-center gap-2 text-yellow-300 mb-2">
                      <Sparkles size={20} />
                      <span className="text-xs font-bold uppercase tracking-wider">Rating</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <p className="text-3xl font-bold text-white">{sectionData.rating}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-600/90 to-indigo-600/90 backdrop-blur-xl p-6 rounded-2xl border border-blue-400/30 shadow-xl">
                  <p className="text-blue-100 text-sm font-semibold mb-1 uppercase tracking-wider">Tuition Fee</p>
                  <p className="text-4xl font-extrabold text-white tracking-tight">{sectionData.tuitionFee}</p>
                  <p className="text-blue-200 text-xs mt-2 font-medium">Per academic year • Financial aid available</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="absolute -bottom-6 -left-6 -right-6 z-[-1] flex flex-wrap justify-center gap-3 opacity-50 blur-sm scale-95 pointer-events-none"
            >
              {sectionData.subjects &&
                sectionData.subjects.map((subject, idx) => (
                  <span key={idx} className="px-3 py-1 bg-slate-200 rounded-full text-xs">
                    {subject}
                  </span>
                ))}
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8 flex flex-wrap justify-center lg:justify-start gap-2">
              {sectionData.subjects &&
                sectionData.subjects.map((subject, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500 flex items-center gap-1.5 shadow-sm hover:scale-105 transition-transform cursor-default"
                  >
                    <BookOpen size={14} className="text-indigo-500" />
                    {subject}
                  </span>
                ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ClientSection7;
