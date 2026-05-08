/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface IStatItem {
  value: string;
  label: string;
  iconName: string;
}

export interface ISection37Data {
  title: string;
  buttonText: string;
  stats: IStatItem[];
}

export interface Section37Props {
  data?: ISection37Data | string;
}

export const defaultDataSection37: ISection37Data = {
  title: 'Join Our Success Community',
  buttonText: 'Start Your Journey Today',
  stats: [
    { value: '50K+', label: 'Students Helped', iconName: 'Users' },
    { value: '8.5', label: 'Average Band Score', iconName: 'TrendingUp' },
    { value: '95%', label: 'Success Rate', iconName: 'Award' },
    { value: '24/7', label: 'Expert Support', iconName: 'CheckCircle' },
  ],
};
