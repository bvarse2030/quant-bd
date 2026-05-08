/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface ITestimonial {
  name: string;
  score: string;
  text: string;
}

export interface IStatItem {
  number: string;
  label: string;
  iconName: string;
}

export interface ISection31Data {
  badge: string;
  headingPrefix: string;
  headingGradient: string;
  headingSuffix: string;
  description: string;
  buttonPrimary: string;
  buttonSecondary: string;
  testimonials: ITestimonial[];
  stats: IStatItem[];
}

export interface Section31Props {
  data?: ISection31Data | string;
}

export const defaultDataSection31: ISection31Data = {
  badge: "Bangladesh's Top Test Prep Platform",
  headingPrefix: 'Master Your',
  headingGradient: 'IELTS',
  headingSuffix: 'Journey',
  description:
    'Join thousands of successful students who achieved their dream scores with our expert guidance, comprehensive materials, and proven strategies.',
  buttonPrimary: 'Start Free Trial',
  buttonSecondary: 'Watch Demo',
  testimonials: [
    { name: 'Sarah Ahmed', score: 'Band 8.5', text: 'Achieved my dream IELTS score!' },
    { name: 'Mohammad Rahman', score: 'Band 7.5', text: 'Excellent preparation materials and guidance.' },
    { name: 'Fatima Khan', score: 'Band 8.0', text: 'The best test prep experience I have had.' },
  ],
  stats: [
    { number: '50K+', label: 'Successful Students', iconName: 'Users' },
    { number: '8.5', label: 'Average Band Score', iconName: 'TrendingUp' },
    { number: '95%', label: 'Success Rate', iconName: 'Award' },
    { number: '24/7', label: 'Expert Support', iconName: 'BookOpen' },
  ],
};
