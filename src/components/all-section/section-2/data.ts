/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface Section2Props {
  data?: ISection2Data | string;
}
export interface ISection2Data {
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

export const defaultDataSection2: ISection2Data = {
  sectionUid: 'section-uid-2',
  id: 'edu_section_001',
  title: 'Master Modern Web Development',
  image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
  heading: 'Advanced Course',
  description: 'Dive deep into cutting-edge web technologies with hands-on projects. Learn React, Next.js, TypeScript, and modern deployment strategies.',
  featuredLabel: 'Premium Course',
  buttonPrimary: 'Enroll Now',
  buttonSecondary: 'View Curriculum',
  studentCount: '5.2k+ Students',
  enrollmentText: 'Active learners',
  secondaryImage: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
  subtitle: 'From Beginner to Professional',
  additionalDescription: 'This comprehensive program covers everything from fundamental concepts to advanced architectural patterns.',
  ctaText: 'Limited seats available - Join today!',
  highlights: ['Live coding sessions', 'Industry mentorship', 'Certificate of completion'],
};
