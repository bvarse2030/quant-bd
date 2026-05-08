/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface Section1Props {
  data?: ISection1Data | string;
}
export interface ISection1Data {
  sectionUid: string;
  title: string;
  image: string;
  heading: string;
  description: string;
  featuredLabel: string;
  buttonPrimary: string;
  buttonSecondary: string;
  studentCount: string;
  enrollmentText: string;
  usersImages: string[];
}

export const defaultDataSection1: ISection1Data = {
  sectionUid: 'section-uid-1',
  title: 'Most common Component',
  image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
  heading: 'Lecture 45',
  description:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio reprehenderit aliquid harum quae deserunt repudiandae assumenda, atque eos a ad placeat vel vitae.',
  featuredLabel: 'Featured Content',
  buttonPrimary: 'Learn More',
  buttonSecondary: 'View Details',
  studentCount: '2.5k+ Students',
  enrollmentText: 'Already enrolled',
  usersImages: ['https://i.ibb.co.com/TDKr13yj/avater.png', 'https://i.ibb.co.com/TDKr13yj/avater.png', 'https://i.ibb.co.com/TDKr13yj/avater.png'],
};
