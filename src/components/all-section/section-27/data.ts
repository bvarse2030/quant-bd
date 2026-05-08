/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface LogoProps {
  data?: ILogoData | string;
}

export interface ILogoItem {
  id: string;
  image: string;
  alt: string;
  link?: string;
}

export type NavPosition = 'middle-outside' | 'bottom-outside' | 'hidden';

export interface ILogoData {
  logos: ILogoItem[];

  responsive: {
    mobile: number;
    tablet: number;
    desktop: number;
  };

  autoplaySpeed: number;
  isAutoplay: boolean;
  infiniteLoop: boolean;
  pauseOnHover: boolean;

  navPosition: NavPosition;
  gap: 'sm' | 'md' | 'lg' | 'xl';
  grayscale: boolean;
}

export const defaultDataSection27: ILogoData = {
  logos: [
    { id: '1', image: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', alt: 'Google' },
    { id: '2', image: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg', alt: 'Facebook' },
    { id: '3', image: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg', alt: 'Twitter' },
    { id: '4', image: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg', alt: 'Instagram' },
    { id: '5', image: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg', alt: 'Netflix' },
    { id: '6', image: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', alt: 'Amazon' },
  ],
  responsive: {
    mobile: 2,
    tablet: 3,
    desktop: 5,
  },
  autoplaySpeed: 3000,
  isAutoplay: true,
  infiniteLoop: true,
  pauseOnHover: true,
  navPosition: 'hidden',
  gap: 'lg',
  grayscale: true,
};

export interface LogoFormProps {
  data?: ILogoData;
  onSubmit: (values: ILogoData) => void;
}
