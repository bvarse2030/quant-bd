/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface Section6Props {
  data?: ISection6Data | string;
}
export interface ISection6Data {
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

export const defaultDataSection6: ISection6Data = {
  sectionUid: 'section-uid-6',
  id: 'community_section_005',
  title: 'Join the Developer Community',
  image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
  heading: 'Growing Fast',
  description:
    'Connect with thousands of developers worldwide. Share knowledge, collaborate on projects, get mentorship, and grow your career in a supportive environment.',
  featuredLabel: 'Global Network',
  buttonPrimary: 'Join Community',
  buttonSecondary: 'Explore Features',
  studentCount: '50k+ Members',
  enrollmentText: 'Active developers',
  secondaryImage: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
  subtitle: 'Learn. Build. Connect. Grow.',
  additionalDescription:
    'Our thriving community offers daily discussions, weekly webinars, monthly hackathons, and year-round mentorship programs. Whether you are just starting or are an experienced professional, you will find value.',
  ctaText: 'Free forever - Premium features available',
  highlights: ['Weekly webinars', 'Career resources', 'Open source projects'],
};
