/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface IDefaultDataSection29 {
  height: string;
  width: string;
  background: string;
  display: string;
}

export interface IDefaultDataSection29Props {
  data?: IDefaultDataSection29 | string;
  onSubmit?: (values: IDefaultDataSection29) => void;
}

export const defaultDataSection29: IDefaultDataSection29 = {
  height: 'h-4',
  width: 'w-full',
  background: 'transparent',
  display: 'block',
};
