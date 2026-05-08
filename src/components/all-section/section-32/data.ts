/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface IFeatureCard {
  title: string;
  description: string;
  iconName: string;
  gradient: string;
}

export interface ISection32Data {
  cards: IFeatureCard[];
}

export interface Section32Props {
  data?: ISection32Data | string;
}

export const defaultDataSection32: ISection32Data = {
  cards: [
    {
      title: 'Reading Mastery',
      description: 'Advanced reading techniques and strategies to achieve Band 8+ scores with expert guidance.',
      iconName: 'BookOpen',
      gradient: 'from-red-500 to-pink-500',
    },
    {
      title: 'Listening Excellence',
      description: 'Expert listening skills development with comprehensive practice materials and techniques.',
      iconName: 'Play',
      gradient: 'from-green-500 to-teal-500',
    },
    {
      title: 'Writing Perfection',
      description: 'Task 1 & 2 writing strategies with high band score techniques and personalized feedback.',
      iconName: 'Award',
      gradient: 'from-blue-500 to-indigo-500',
    },
  ],
};
