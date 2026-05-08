/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface Section4Props {
  data?: ISection4Data | string;
}
export interface ISection4Data {
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

export const defaultDataSection4: ISection4Data = {
  sectionUid: 'section-uid-4',
  id: 'event_section_003',
  title: 'Global Design Summit 2025',
  image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
  heading: 'March 15-17',
  description:
    'Join designers, innovators, and creative leaders from around the world for three days of inspiring talks, hands-on workshops, and networking opportunities.',
  featuredLabel: 'Annual Conference',
  buttonPrimary: 'Register Now',
  buttonSecondary: 'View Schedule',
  studentCount: '3,500+ Attendees',
  enrollmentText: 'Expected this year',
  secondaryImage: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
  subtitle: 'Where Creativity Meets Innovation',
  additionalDescription: 'Experience keynotes from industry pioneers, participate in interactive workshops covering the latest design tools and methodologies.',
  ctaText: 'Early bird pricing ends soon - Save 40%',
  highlights: ['50+ expert speakers', 'Hands-on workshops', 'Networking events'],
};
