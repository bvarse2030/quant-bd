/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface ISection34Data {
  badgeText: string;
  headingLine1: string;
  headingHighlight: string;
  headingLine2: string;
  headingGradient: string;
  subtitle: string;
  features: string[];
}

export interface Section34Props {
  data?: ISection34Data | string;
}

export const defaultDataSection34: ISection34Data = {
  badgeText: "Bangladesh's #1 IELTS Preparation Platform",
  headingLine1: 'Free Online',
  headingHighlight: 'IELTS',
  headingLine2: 'Real Mock Tests With',
  headingGradient: 'Explanations',
  subtitle:
    'Master your IELTS with authentic practice tests, instant results, and detailed explanations. Join thousands of successful students who achieved their target band scores.',
  features: ['Real Test Format', 'Instant Results', 'Detailed Explanations', 'Expert Guidance'],
};
