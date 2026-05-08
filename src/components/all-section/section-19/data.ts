/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface Button1Props {
  data?: IButton1Data | string;
}

export interface Button1FormProps {
  data?: IButton1Data;
  onSubmit: (values: IButton1Data) => void;
}

export interface IButton1Data {
  buttonName: string;
  buttonIcon: string;
  buttonPath: string;
  isNewTab: boolean;
}

export const defaultDataSection19: IButton1Data = {
  buttonName: 'View Guidelines',
  buttonIcon: 'doc-icon',
  buttonPath: '/guidelines/student-guidenes',
  isNewTab: true,
};
