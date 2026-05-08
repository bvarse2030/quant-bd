/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface IPartner {
  id: string;
  name: string;
  logo: string;
}

export interface ICollabOption {
  id: string;
  title: string;
  description: string;
}

export interface ISection13Data {
  id: string;
  title: string;
  badge: string;
  subTitle: string;
  description: string;
  partners: IPartner[];
  collabOptions: ICollabOption[];
}

export interface Section13Props {
  data?: ISection13Data | string;
}

export const defaultDataSection13: ISection13Data = {
  id: 'section-13-collaboration',
  badge: 'Partnership Network',
  title: 'Building',
  subTitle: 'Together',
  description: 'We believe in the power of partnership. From startups to enterprises, we collaborate to create digital excellence.',
  partners: [
    {
      id: 'partner-1',
      name: 'Acme Corp',
      logo: 'https://i.ibb.co.com/KpGnqS3D/nature.jpg',
    },
    {
      id: 'partner-2',
      name: 'Global Tech',
      logo: 'https://i.ibb.co.com/KpGnqS3D/nature.jpg',
    },
    {
      id: 'partner-3',
      name: 'Nebula Inc',
      logo: 'https://i.ibb.co.com/KpGnqS3D/nature.jpg',
    },
    {
      id: 'partner-4',
      name: 'Starlight',
      logo: 'https://i.ibb.co.com/KpGnqS3D/nature.jpg',
    },
    {
      id: 'partner-5',
      name: 'Vercel',
      logo: 'https://i.ibb.co.com/KpGnqS3D/nature.jpg',
    },
  ],
  collabOptions: [
    {
      id: 'opt-1',
      title: 'Strategic Partnership',
      description: 'Long-term collaboration focusing on scalable growth, technical roadmap planning, and dedicated resource allocation.',
    },
    {
      id: 'opt-2',
      title: 'Staff Augmentation',
      description: 'Extend your existing team with our senior engineers. seamless integration into your agile workflow.',
    },
    {
      id: 'opt-3',
      title: 'Project Basis',
      description: 'End-to-end product development. From initial concept and design to deployment and maintenance.',
    },
  ],
};
