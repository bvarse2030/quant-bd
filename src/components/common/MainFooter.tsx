/*
|-----------------------------------------
| setting up MainFooter for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BsTwitter } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { BiLogoFacebookCircle, BiLogoLinkedin } from 'react-icons/bi';

interface QuickLink {
  id: number;
  title: string;
  link: string;
}

interface SocialLink {
  id: number;
  platform: string;
  link: string;
}

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
}

interface FooterSettings {
  brandName: string;
  logoUrl: string;
  logoWidth: number;
  tagline: string;
  quickLinks: QuickLink[];
  contactInfo: ContactInfo;
  socialLinks: SocialLink[];
  copyrightText: string;
  designerName: string;
}

const MainFooter = () => {
  const [settings, setSettings] = useState<FooterSettings>({
    brandName: 'English',
    logoUrl: 'https://i.ibb.co.com/2mc3j65/l.jpg',
    logoWidth: 40,
    tagline: 'Empowering learners with strong English communication skills for global success. Our commitment is to excellence, growth, and confidence.',
    quickLinks: [
      { id: 1, title: 'About Us', link: '/about' },
      { id: 2, title: 'Our Services', link: '/service' },
      { id: 3, title: 'Contact', link: '/contact' },
      { id: 4, title: 'FAQ', link: '/faq' },
      { id: 5, title: 'Privacy Policy', link: '/privacy-and-policy' },
      { id: 6, title: 'Terms & Conditions', link: '/terms-and-condition' },
    ],
    contactInfo: {
      address: 'English, 2nd Floor, Green Plaza, Dhanmondi, Dhaka  1209',
      phone: '+880 1700-123456',
      email: 'info@english.com',
    },
    socialLinks: [
      { id: 1, platform: 'Facebook', link: '#' },
      { id: 2, platform: 'Twitter', link: '#' },
      { id: 3, platform: 'LinkedIn', link: '#' },
    ],
    copyrightText: 'English. All rights reserved.',
    designerName: 'Toufiquer',
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch('/api/footer-settings');
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setSettings(data.settings);
          }
        }
      } catch (error) {
        console.error('Error loading footer settings:', error);
      }
    };

    loadSettings();
  }, []);

  const getSocialIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes('facebook')) {
      return <BiLogoFacebookCircle size={22} />;
    } else if (platformLower.includes('twitter')) {
      return <BsTwitter size={20} />;
    } else if (platformLower.includes('linkedin')) {
      return <BiLogoLinkedin size={22} />;
    }
    return <BiLogoFacebookCircle size={22} />;
  };

  return (
    <footer className="relative mt-16 bg-gradient-to-br from-blue-100/40 via-purple-100/40 to-white/30 backdrop-blur-2xl border-t border-white/40 text-gray-700 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-6 py-12"
      >
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={settings.logoUrl}
                alt={settings.brandName + ' Logo'}
                width={settings.logoWidth}
                height={settings.logoWidth}
                className="rounded-lg shadow-sm"
              />
              <span className="text-xl font-semibold text-blue-700">{settings.brandName}</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">{settings.tagline}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-blue-700 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              {settings.quickLinks.map(link => (
                <motion.li key={link.id} whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 200 }}>
                  <Link href={link.link} className="text-gray-700 hover:text-blue-600 transition-colors text-sm">
                    {link.title}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-blue-700 mb-3">Contact Info</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li> {settings.contactInfo.address}</li>
              <li> {settings.contactInfo.phone}</li>
              <li> {settings.contactInfo.email}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-blue-700 mb-3">Follow Us</h3>
            <div className="flex items-center gap-4">
              {settings.socialLinks.map(social => (
                <Link
                  key={social.id}
                  href={social.link}
                  target="_blank"
                  className="p-2 rounded-full bg-white/40 backdrop-blur-md border border-white/30 hover:bg-blue-100 transition"
                  aria-label={social.platform}
                >
                  {getSocialIcon(social.platform)}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="my-10 border-t border-white/40" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} {settings.copyrightText}
          </p>
          <p className="text-gray-500">
            Designed with by <span className="text-blue-600 font-semibold">{settings.designerName}</span>
          </p>
        </div>
      </motion.div>

      <div className="absolute top-0 left-0 w-40 h-40 bg-blue-300/20 blur-3xl rounded-full animate-pulse" />
      <div className="absolute bottom-0 right-0 w-56 h-56 bg-purple-300/20 blur-3xl rounded-full animate-pulse" />
    </footer>
  );
};

export default MainFooter;
