/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface Section3Props {
  data?: ISection3Data | string;
}
export interface ISection3Data {
  sectionUid: string;
  id: string;
  title: string;
  image: string;
  heading: string;
  description: string;
  featuredLabel: string;
  buttonPrimary: string;
  buttonSecondary: string;
  studentCount: string;
  enrollmentText: string;
  secondaryImage: string;
  subtitle: string;
  additionalDescription: string;
  ctaText: string;
  highlights: string[];
}

export const defaultDataSection3: ISection3Data = {
  sectionUid: 'section-uid-3',
  id: 'prod_section_002',
  title: 'Revolutionary AI-Powered Analytics',
  image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
  heading: 'New Release',
  description:
    'Transform your business intelligence with our state-of-the-art analytics platform. Get real-time insights, predictive forecasting, and actionable recommendations.',
  featuredLabel: 'Enterprise Solution',
  buttonPrimary: 'Start Free Trial',
  buttonSecondary: 'See Demo',
  studentCount: '1,200+ Companies',
  enrollmentText: 'Trust our platform',
  secondaryImage: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
  subtitle: 'Data-Driven Decision Making',
  additionalDescription: 'Our platform integrates seamlessly with your existing tools and provides customizable dashboards that deliver insights in real-time.',
  ctaText: 'No credit card required for 30-day trial',
  highlights: ['99.9% uptime SLA', '24/7 support', 'SOC 2 compliant'],
};
