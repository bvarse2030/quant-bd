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

export interface IFooter2Data {
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

export const defaultDataFooter2: IFooter2Data = {
  brandName: 'Nexus',
  logoUrl: 'https://i.ibb.co.com/2mc3j65/l.jpg',
  logoWidth: 50,
  tagline: 'Crafting digital experiences that inspire and innovate. We build the future, one pixel at a time.',
  quickLinks: [
    { id: 1, title: 'Company', link: '/company' },
    { id: 2, title: 'Services', link: '/services' },
    { id: 3, title: 'Case Studies', link: '/work' },
    { id: 4, title: 'Careers', link: '/careers' },
    { id: 5, title: 'Privacy', link: '/privacy' },
  ],
  contactInfo: {
    address: '101 Innovation Blvd, Tech City, CA 94000',
    phone: '+1 (555) 012-3456',
    email: 'hello@nexus.dev',
  },
  socialLinks: [
    { id: 1, platform: 'Twitter', link: '#' },
    { id: 2, platform: 'Github', link: '#' },
    { id: 3, platform: 'Linkedin', link: '#' },
    { id: 4, platform: 'Instagram', link: '#' },
  ],
  copyrightText: 'Nexus Inc. All rights reserved.',
  designerName: 'Toufiquer',
};
