/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface Section5Props {
  data?: ISection5Data | string;
}

export interface ISection5Data {
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

export const defaultDataSection5: ISection5Data = {
  sectionUid: 'section-uid-5',
  id: 'agency_section_004',
  title: 'Digital Excellence Delivered',
  image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
  heading: 'Award Winning',
  description:
    'We are a full-service digital agency specializing in brand strategy, web development, and digital marketing. Our passionate team transforms ambitious ideas into exceptional digital experiences.',
  featuredLabel: 'Top Rated Agency',
  buttonPrimary: 'Start Project',
  buttonSecondary: 'Our Portfolio',
  studentCount: '200+ Projects',
  enrollmentText: 'Successfully delivered',
  secondaryImage: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
  subtitle: 'Strategy. Design. Development.',
  additionalDescription:
    'With over a decade of experience, we have partnered with startups, scale-ups, and established brands to create digital solutions that perform exceptionally.',
  ctaText: "Free consultation available - Let's discuss your vision",
  highlights: ['95% client retention', 'Average 3x ROI', 'Agile methodology'],
};
