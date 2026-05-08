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
import { motion, Variants } from 'framer-motion';
import { BsTwitterX, BsGithub } from 'react-icons/bs';
import { Mail, MapPin, Phone, ArrowRight } from 'lucide-react';
import { BiLogoFacebookCircle, BiLogoLinkedin, BiLogoInstagram, BiLogoYoutube, BiWorld } from 'react-icons/bi';

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

export interface IFooter2Data {
  logoUrl?: string;
  logoWidth?: number;
  brandName: string;
  tagline: string;
  copyrightText: string;
  designerName?: string;
  socialLinks: ISocialLink[];
  quickLinks: IQuickLink[];
  contactInfo: IContactInfo;
}

const defaultDataFooter2: IFooter2Data = {
  brandName: 'NEXUS',
  tagline: 'Innovating the future, one pixel at a time.',
  copyrightText: 'Nexus Inc',
  designerName: 'AppGenerator',
  logoUrl: 'https://placehold.co/100x100/4f46e5/white?text=N',
  logoWidth: 60,
  quickLinks: [
    { id: 1, title: 'About Us', link: '#' },
    { id: 2, title: 'Services', link: '#' },
    { id: 3, title: 'Blog', link: '#' },
    { id: 4, title: 'Contact', link: '#' },
  ],
  socialLinks: [
    { id: 1, platform: 'facebook', link: '#' },
    { id: 2, platform: 'twitter', link: '#' },
    { id: 3, platform: 'instagram', link: '#' },
  ],
  contactInfo: {
    address: '123 Tech Avenue, Silicon Valley, CA',
    phone: '+1 (555) 123-4567',
    email: 'contact@nexus.dev',
  },
};

interface QueryFooterProps {
  data?: string;
}

const QueryFooter2 = ({ data }: QueryFooterProps) => {
  const parseInitData = data ? JSON.parse(data) : null;
  const [settings] = useState<IFooter2Data>(parseInitData || defaultDataFooter2);

  const getSocialIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('facebook')) return <BiLogoFacebookCircle size={22} />;
    if (p.includes('twitter') || p.includes('x')) return <BsTwitterX size={18} />;
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
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <footer className="relative pt-20 pb-10 overflow-hidden bg-slate-950 font-sans border-t border-white/5">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-2xl z-0" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none z-0 mix-blend-screen" />
      <div className="absolute bottom-0 left-1/3 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent z-10" />

      <motion.div
        className="max-w-7xl mx-auto px-6 relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          <motion.div variants={itemVariants} className="lg:col-span-5 space-y-8">
            <Link href="/" className="inline-flex items-center gap-3 group">
              {settings.logoUrl && (
                <div className="relative p-2 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm group-hover:border-indigo-500/50 transition-all duration-300">
                  <Image
                    src={settings.logoUrl}
                    alt={settings.brandName}
                    width={settings.logoWidth || 50}
                    height={50}
                    className="object-contain w-auto h-auto max-h-[50px]"
                    unoptimized
                  />
                </div>
              )}
              <span className="text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
                {settings.brandName}
              </span>
            </Link>

            <p className="text-slate-400 leading-relaxed max-w-md text-base font-light border-l-2 border-indigo-500/30 pl-4">{settings.tagline}</p>

            <div className="flex flex-wrap gap-3">
              {settings.socialLinks.map(social => (
                <Link
                  key={social.id}
                  href={social.link}
                  target="_blank"
                  className="w-11 h-11 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-indigo-500/25 group"
                >
                  <span className="group-hover:scale-110 transition-transform duration-300">{getSocialIcon(social.platform)}</span>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-3">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-8 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-indigo-500 rounded-full"></span>
              Explore
            </h3>
            <ul className="space-y-4">
              {settings.quickLinks.map(link => (
                <li key={link.id}>
                  <Link href={link.link} className="group flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
                    <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 text-indigo-400 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-8 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-purple-500 rounded-full"></span>
              Get in Touch
            </h3>
            <ul className="space-y-6">
              {settings.contactInfo.address && (
                <li className="flex items-start gap-4 group">
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-1 group-hover:text-indigo-300 transition-colors">
                      Address
                    </span>
                    <span className="text-slate-300 font-light leading-snug">{settings.contactInfo.address}</span>
                  </div>
                </li>
              )}

              {settings.contactInfo.phone && (
                <li className="flex items-center gap-4 group">
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                    <Phone size={20} />
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-1 group-hover:text-indigo-300 transition-colors">
                      Phone
                    </span>
                    <a href={`tel:${settings.contactInfo.phone}`} className="text-slate-300 hover:text-white transition-colors font-mono">
                      {settings.contactInfo.phone}
                    </a>
                  </div>
                </li>
              )}

              {settings.contactInfo.email && (
                <li className="flex items-center gap-4 group">
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                    <Mail size={20} />
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-1 group-hover:text-indigo-300 transition-colors">
                      Email
                    </span>
                    <a href={`mailto:${settings.contactInfo.email}`} className="text-slate-300 hover:text-white transition-colors">
                      {settings.contactInfo.email}
                    </a>
                  </div>
                </li>
              )}
            </ul>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="pt-8 mt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500"
        >
          <p className="font-light">
            &copy; {new Date().getFullYear()} <span className="text-slate-300 font-medium">{settings.copyrightText}</span>
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-indigo-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-indigo-400 transition-colors">
              Terms of Service
            </Link>
            <div className="hidden md:block w-px h-4 bg-white/10"></div>
            <p className="flex items-center gap-1">
              Designed by <span className="text-indigo-400 font-medium">{settings.designerName || 'AppGenerator'}</span>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default QueryFooter2;
