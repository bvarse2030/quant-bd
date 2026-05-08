/*
|-----------------------------------------
| setting up QueryFooter for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useState } from 'react';
import { HiOutlineMail } from 'react-icons/hi';
import { motion, Variants } from 'framer-motion';
import { BsTwitter, BsGithub } from 'react-icons/bs';
import { BiLogoFacebookCircle, BiLogoLinkedin, BiLogoInstagram, BiLogoYoutube, BiWorld, BiRightArrowAlt } from 'react-icons/bi';

interface ISocialLink {
  id: number;
  platform: string;
  link: string;
}

interface IQuickLink {
  id: number;
  title: string;
  link: string;
}

interface IContactInfo {
  address?: string;
  phone?: string;
  email?: string;
}

export interface IFooter1Data {
  logoUrl?: string;
  logoWidth?: number;
  brandName: string;
  tagline: string;
  copyrightText: string;
  designerName: string;
  socialLinks: ISocialLink[];
  quickLinks: IQuickLink[];
  contactInfo: IContactInfo;
}

const defaultDataFooter1: IFooter1Data = {
  brandName: 'NEXUS',
  tagline: 'Architecting the digital future with precision, elegance, and cutting-edge technology.',
  copyrightText: 'Nexus Inc',
  designerName: 'Toufiquer',
  logoUrl: 'https://placehold.co/100x100/3b82f6/white?text=N',
  logoWidth: 50,
  quickLinks: [
    { id: 1, title: 'Services', link: '#' },
    { id: 2, title: 'Case Studies', link: '#' },
    { id: 3, title: 'Our Team', link: '#' },
    { id: 4, title: 'Careers', link: '#' },
  ],
  socialLinks: [
    { id: 1, platform: 'facebook', link: '#' },
    { id: 2, platform: 'twitter', link: '#' },
    { id: 3, platform: 'linkedin', link: '#' },
    { id: 4, platform: 'github', link: '#' },
  ],
  contactInfo: {
    address: '123 Innovation Dr, Tech City, TC 90210',
    phone: '+1 (555) 000-1234',
    email: 'hello@nexus.dev',
  },
};

interface QueryFooter1Props {
  data?: string;
}

const QueryFooter1 = ({ data }: QueryFooter1Props) => {
  const parseInitData = data ? JSON.parse(data) : null;
  const [settings] = useState<IFooter1Data>(parseInitData || defaultDataFooter1);

  const getSocialIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('facebook')) return <BiLogoFacebookCircle size={22} />;
    if (p.includes('twitter') || p.includes('x')) return <BsTwitter size={20} />;
    if (p.includes('linkedin')) return <BiLogoLinkedin size={22} />;
    if (p.includes('instagram')) return <BiLogoInstagram size={22} />;
    if (p.includes('youtube')) return <BiLogoYoutube size={22} />;
    if (p.includes('github')) return <BsGithub size={20} />;
    return <BiWorld size={22} />;
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.215, 0.61, 0.355, 1],
      },
    },
  };

  return (
    <footer className="relative w-full bg-[#020617] text-slate-300 overflow-hidden font-sans border-t border-white/5">
      <div className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem]"
          style={{ maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)' }}
        />
      </div>

      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-block">
              <div className="flex items-center gap-3 group cursor-pointer">
                {settings.logoUrl && (
                  <div className="relative p-2.5 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/10 shadow-2xl group-hover:border-blue-500/50 transition-all duration-500">
                    <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Image
                      src={settings.logoUrl}
                      alt={`${settings.brandName} Logo`}
                      width={settings.logoWidth || 40}
                      height={40}
                      className="relative object-contain"
                      unoptimized
                    />
                  </div>
                )}
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-blue-400 tracking-tight">
                  {settings.brandName}
                </span>
              </div>
            </Link>
            <p className="text-slate-400 leading-relaxed text-sm max-w-sm">{settings.tagline}</p>
            <div className="pt-4">
              <div className="flex items-center gap-3">
                {settings.socialLinks.map(social => (
                  <motion.a
                    key={social.id}
                    href={social.link}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all duration-300"
                  >
                    {getSocialIcon(social.platform)}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-blue-500 rounded-full" />
              Company
            </h3>
            <ul className="space-y-3">
              {settings.quickLinks.map(link => (
                <li key={link.id}>
                  <Link href={link.link} className="text-sm text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-blue-400 transition-colors" />
                    <span className="relative overflow-hidden">
                      {link.title}
                      <span className="absolute bottom-0 left-0 w-full h-px bg-blue-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-3">
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-indigo-500 rounded-full" />
              Contact
            </h3>
            <ul className="space-y-4 text-sm">
              {settings.contactInfo.address && (
                <li className="flex items-start gap-3 text-slate-400">
                  <div className="mt-1 min-w-[20px] text-indigo-400">
                    <BiWorld size={18} />
                  </div>
                  <span>{settings.contactInfo.address}</span>
                </li>
              )}
              {settings.contactInfo.email && (
                <li className="flex items-center gap-3 text-slate-400">
                  <div className="min-w-[20px] text-indigo-400">
                    <HiOutlineMail size={18} />
                  </div>
                  <a href={`mailto:${settings.contactInfo.email}`} className="hover:text-white transition-colors">
                    {settings.contactInfo.email}
                  </a>
                </li>
              )}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-3">
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-purple-500 rounded-full" />
              Stay Updated
            </h3>
            <p className="text-sm text-slate-400 mb-4">Subscribe to our newsletter for the latest updates.</p>
            <div className="relative group">
              <input
                type="email"
                placeholder="Enter email address"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300 pr-12"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors shadow-lg shadow-blue-600/20">
                <BiRightArrowAlt size={18} />
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="pt-8 mt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500"
        >
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4">
            <p>
              &copy; {new Date().getFullYear()} {settings.copyrightText}. All rights reserved.
            </p>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-700" />
            <div className="flex gap-4">
              <Link href="#" className="hover:text-slate-300 transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-slate-300 transition-colors">
                Terms
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span>Designed by</span>
            <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-indigo-400 font-medium">{settings.designerName}</span>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default QueryFooter1;
