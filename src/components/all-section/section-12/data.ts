/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface IMilestone {
  label: string;
  value: string;
}

export interface IExperienceItem {
  id: string;
  year: string;
  companyName: string;
  role: string;
  description: string;
  lastAchievement: string;
  highlightMilestone: IMilestone;
  features: string[];
}

export interface ISection12Data {
  id: string;
  title: string;
  subTitle: string;
  description: string;
  experiences: IExperienceItem[];
}

export interface Section12Props {
  data?: ISection12Data | string;
}

export const defaultDataSection12: ISection12Data = {
  id: 'section-12-experience',
  title: 'Professional',
  subTitle: 'Journey',
  description: 'A timeline of dedication, innovation, and impactful contributions across the tech industry.',
  experiences: [
    {
      id: 'exp-001',
      year: '2022 - Present',
      companyName: 'TechFlow Systems',
      role: 'Senior Frontend Engineer',
      description: 'Leading the core UI team in rebuilding the legacy dashboard into a modern, high-performance React application.',
      lastAchievement: 'Reduced initial load time by 45% using server components.',
      highlightMilestone: {
        label: 'Users Impacted',
        value: '2M+',
      },
      features: ['Next.js 14', 'TypeScript', 'System Architecture', 'Team Leadership'],
    },
    {
      id: 'exp-002',
      year: '2020 - 2022',
      companyName: 'Creative Pulse',
      role: 'UI/UX Developer',
      description: 'Bridged the gap between design and engineering, creating interactive micro-sites and award-winning landing pages.',
      lastAchievement: 'Won the Awwwards Site of the Day for the 2021 Rebrand.',
      highlightMilestone: {
        label: 'Conversion Rate',
        value: '+150%',
      },
      features: ['Framer Motion', 'WebGL', 'Interactive Design', 'GSAP'],
    },
    {
      id: 'exp-003',
      year: '2018 - 2020',
      companyName: 'StartUp Inc.',
      role: 'Junior Web Developer',
      description: 'Collaborated with cross-functional teams to ship features rapidly in an agile environment.',
      lastAchievement: 'Successfully migrated the payment gateway without downtime.',
      highlightMilestone: {
        label: 'Features Shipped',
        value: '45+',
      },
      features: ['React', 'Redux', 'Stripe API', 'Agile/Scrum'],
    },
  ],
};
