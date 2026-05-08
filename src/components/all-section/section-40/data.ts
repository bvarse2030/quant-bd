/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface ISection40Data {
  title: string;
  subtitle: string;
  buttonPrimaryText: string;
  buttonSecondaryText: string;
  contactLabel: string;
  contactNumber: string;
}

export interface Section40Props {
  data?: ISection40Data | string;
}

export const defaultDataSection40: ISection40Data = {
  title: 'Ready to Start Your IELTS Journey?',
  subtitle: 'Join thousands of successful students who achieved their target band scores',
  buttonPrimaryText: 'Book Free Consultation',
  buttonSecondaryText: 'Watch Class Demo',
  contactLabel: 'Call us now for immediate enrollment',
  contactNumber: '📞 +880 1XXX-XXXXXX',
};
