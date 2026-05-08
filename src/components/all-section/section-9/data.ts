/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface ISection9Data {
  id: string;
  title: string;
  subTitle: string;
  buttonText: string;
  buttonUrl: string;
}

export interface Section9Props {
  data?: ISection9Data | string;
}

export const defaultDataSection9: ISection9Data = {
  id: 'Section 9 Button Text',
  title: 'Be The Next Story',
  subTitle: 'Your future begins here. Join a community of innovators and leaders shaping the world of tomorrow.',
  buttonText: 'Apply Now',
  buttonUrl: '#',
};
