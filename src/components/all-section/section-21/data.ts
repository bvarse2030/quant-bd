/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface TitleProps {
  data?: ITitleData | string;
}

export type TitleSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';

export type TitleAlign = 'left' | 'center' | 'right' | 'justify';

export type TitlePadding = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ITitleData {
  text: string;
  textSize: TitleSize;
  textAlign: TitleAlign;
  isUnderline: boolean;
  padding: TitlePadding;
  isLink: boolean;
  url: string;
  isNewTab: boolean;
}

export const defaultDataSection21: ITitleData = {
  text: 'Create Something Stunning',
  textSize: '5xl',
  textAlign: 'center',
  isUnderline: false,
  padding: 'md',
  isLink: false,
  url: '/',
  isNewTab: false,
};
export const SIZES: TitleSize[] = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'];
export const PADDINGS: Record<TitlePadding, string> = {
  none: 'p-0',
  xs: 'p-2',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-12',
  '2xl': 'p-16',
};

export const sizeMap: Record<string, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl md:text-5xl',
  '5xl': 'text-5xl md:text-6xl',
  '6xl': 'text-6xl md:text-7xl',
  '7xl': 'text-7xl md:text-8xl',
  '8xl': 'text-8xl md:text-9xl',
  '9xl': 'text-9xl',
};

export const alignMap: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
};

export const paddingMap: Record<string, string> = {
  none: 'p-0',
  xs: 'p-2',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-12',
  '2xl': 'p-16',
};

export interface TitleFormProps {
  data?: ITitleData;
  onSubmit: (values: ITitleData) => void;
}
