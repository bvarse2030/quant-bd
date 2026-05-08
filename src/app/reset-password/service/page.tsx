/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, MessageCircle, GraduationCap, Award, Users, BookOpen, Briefcase, Target, MessageSquare, Globe2, Headphones } from 'lucide-react';

import MainFooter from '@/components/common/MainFooter';

const Service = () => {
  interface IServiceData {
    id: number;
    name: string;
    path: string;
    icon: React.JSX.Element;
    childData?: {
      id: number;
      name: string;
      path: string;
      icon: React.JSX.Element;
      description: string;
    }[];
    description?: string;
  }

  const serviceData: IServiceData[] = [
    {
      id: 1,
      name: 'Language Training',
      path: '/services/language-training',
      icon: <GraduationCap />,
      childData: [
        {
          id: 11,
          name: 'IELTS Preparation',
          path: '/services/language-training/ielts',
          icon: <Award />,
          description:
            'Intensive IELTS courses designed to build mastery across Listening, Reading, Writing, and Speaking modules to achieve your target band score.',
        },
        {
          id: 12,
          name: 'Spoken English',
          path: '/services/language-training/spoken-english',
          icon: <Users />,
          description:
            'Practical communication sessions that develop fluency, pronunciation, and confidence for everyday conversations and professional settings.',
        },
        {
          id: 13,
          name: 'Academic English (School Level)',
          path: '/services/language-training/academic-english',
          icon: <BookOpen />,
          description: 'Tailored courses for students from Class 1 to 10 — focusing on grammar, comprehension, writing, and vocabulary enhancement.',
        },
      ],
    },
    {
      id: 2,
      name: 'Professional English',
      path: '/services/professional-english',
      icon: <Briefcase />,
      childData: [
        {
          id: 21,
          name: 'Corporate English Training',
          path: '/services/professional-english/corporate',
          icon: <Users />,
          description: 'Customized English programs for professionals to enhance business communication, presentation, and negotiation skills.',
        },
        {
          id: 22,
          name: 'Interview & CV Preparation',
          path: '/services/professional-english/interview',
          icon: <Target />,
          description: 'Learn to present yourself effectively through confident speaking and compelling resume writing for job interviews and promotions.',
        },
        {
          id: 23,
          name: 'Email & Report Writing',
          path: '/services/professional-english/email-writing',
          icon: <MessageSquare />,
          description: 'Master the art of professional writing — clear, polite, and effective emails and reports that reflect a high level of professionalism.',
        },
      ],
    },
    {
      id: 3,
      name: 'Online Learning Programs',
      path: '/services/online-learning',
      icon: <Globe2 />,
      description:
        'Access flexible, high-quality English learning from anywhere in the world. Join live interactive classes, practice tests, and feedback sessions online.',
    },
    {
      id: 4,
      name: 'One-on-One Mentoring',
      path: '/services/mentoring',
      icon: <Headphones />,
      description: 'Personalized coaching sessions designed to focus on your individual learning goals, weaknesses, and exam strategies with expert mentors.',
    },
    {
      id: 5,
      name: 'Workshops & Events',
      path: '/services/workshops',
      icon: <Award />,
      description: 'Interactive workshops, mock tests, and events that strengthen communication, leadership, and teamwork — essential for real-world success.',
    },
    {
      id: 6,
      name: 'Why Choose Our Services',
      path: '/services/why-choose-us',
      icon: <Target />,
      description: 'We combine modern learning tools, experienced instructors, and real-world practice to help every learner reach their full potential.',
    },
  ];

  return (
    <>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mt-12">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-400 to-purple-400 mb-3">Our Services</h1>
        <p className="text-gray-400 text-base max-w-2xl mx-auto leading-relaxed">
          Explore our comprehensive English learning programs designed to help you achieve your personal and professional goals.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto mt-8">
        {serviceData.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group bg-gradient-to-br from-slate-800/70 via-slate-900/80 to-black/80 border border-slate-700 rounded-2xl shadow-xl p-6 hover:shadow-2xl hover:border-indigo-400 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-indigo-400 text-2xl group-hover:text-indigo-300 transition-colors duration-300">{item.icon}</span>
              <h2 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors duration-300">{item.name}</h2>
            </div>
            {item.description && <p className="text-sm text-gray-400 leading-relaxed mb-2">{item.description}</p>}
            {item.childData && (
              <ul className="mt-3 space-y-2">
                {item.childData.map(child => (
                  <li key={child.id}>
                    <Link href={child.path} className="text-sm text-gray-400 hover:text-indigo-300 transition-colors duration-200 flex items-center gap-1">
                      <span>•</span> {child.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="w-full bg-slate-100 mt-10">
        <MainFooter />
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 w-full backdrop-blur-lg bg-slate-900/80 border-t border-slate-700 py-2 flex justify-around text-white shadow-xl">
        <Link href="/" className="flex flex-col items-center text-xs hover:text-indigo-400 transition-colors">
          <Home className="w-5 h-5 mb-1" />
          Home
        </Link>

        <a
          href="https://wa.me/8801XXXXXXXXX"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center text-xs text-green-400 hover:text-green-300 transition-colors"
        >
          <MessageCircle className="w-5 h-5 mb-1" />
          WhatsApp
        </a>

        <Link href="/services" className="flex flex-col items-center text-xs hover:text-indigo-400 transition-colors">
          <GraduationCap className="w-5 h-5 mb-1" />
          Services
        </Link>
      </div>
    </>
  );
};

export default Service;
