/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface IServiceFeature {
  title: string;
  description: string;
  iconName: string;
}

export interface ISection41Data {
  badgeText: string;
  headingPrefix: string;
  headingHighlight: string;
  headingSuffix: string;
  features: IServiceFeature[];
  ctaText: string;
  rightCardBadge: string;
  locationLabel: string;
  destinationLabel: string;
}

export interface Section41Props {
  data?: ISection41Data | string;
}

export const defaultDataSection41: ISection41Data = {
  badgeText: '★ We Are Also Providing',
  headingPrefix: 'The Best',
  headingHighlight: 'Study Abroad',
  headingSuffix: 'Services',
  features: [
    {
      title: 'Expert Guidance',
      description: 'Get personalized support from experienced counselors who understand your goals and help you achieve them.',
      iconName: 'Users',
    },
    {
      title: 'High Success Rate',
      description: 'From applications to visas, our proven process ensures a smooth and successful journey.',
      iconName: 'Award',
    },
    {
      title: 'Tailored Solutions',
      description: 'We provide customized advice based on your needs, budget, and career aspirations.',
      iconName: 'BookOpen',
    },
  ],
  ctaText: 'Book Free Consultation',
  rightCardBadge: '★ Where dreams come true',
  locationLabel: 'Your Location',
  destinationLabel: 'Dream Destination',
};
