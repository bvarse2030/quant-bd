/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface IDefaultDataSection30 {
  iconName: string;
}

export interface IDefaultDataSection30Props {
  data?: IDefaultDataSection30 | string;
  onSubmit?: (values: IDefaultDataSection30) => void;
}

export const defaultDataSection30: IDefaultDataSection30 = {
  iconName: '',
};
/*

*/
