/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface QuickLink {
  id: number;
  title: string;
  link: string;
}

export interface SocialLink {
  id: number;
  platform: string;
  link: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
}

export interface IFooter1Data {
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

export const defaultDataFooter1: IFooter1Data = {
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
    address: 'English, 2nd Floor, Green Plaza, Dhanmondi, Dhaka – 1209',
    phone: '+880 1700-123456',
    email: 'info@english.com',
  },
  socialLinks: [
    { id: 1, platform: 'Facebook', link: '#' },
    { id: 2, platform: 'Twitter', link: '#' },
    { id: 3, platform: 'Linkedin', link: '#' },
  ],
  copyrightText: `English . All rights reserved.`,
  designerName: 'Toufiquer',
};
