/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface DescriptionProps {
  data?: IDescriptionData | string;
}

export type DescSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
export type DescAlign = 'left' | 'center' | 'right' | 'justify';
export type DescPadding = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface IDescriptionData {
  content: string;
  textSize: DescSize;
  textAlign: DescAlign;
  isGlobalUnderline: boolean;
  padding: DescPadding;
}

export const defaultDataSection22: IDescriptionData = {
  content: '<p>This is a <b>rich text</b> description. You can edit this content, add <i>styles</i>, and lists.</p>',
  textSize: 'base',
  textAlign: 'left',
  isGlobalUnderline: false,
  padding: 'md',
};

export interface IDescriptionData {
  content: string;
  textSize: DescSize;
  textAlign: DescAlign;
  padding: DescPadding;
  isGlobalUnderline: boolean;
}

export const defaultDataDescription: IDescriptionData = {
  content: '<p>Experience the next generation of <b>content editing</b>.</p>',
  textSize: 'base',
  textAlign: 'left',
  padding: 'md',
  isGlobalUnderline: false,
};

export const SIZE_MAP: Record<DescSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
};

export const PADDING_MAP: Record<DescPadding, string> = {
  none: 'p-0',
  xs: 'p-2',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-12',
};

export const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
};

export const paddingClasses = {
  none: 'p-0',
  xs: 'p-2',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-12',
};

export const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
};

export interface DescriptionFormProps {
  data?: IDescriptionData;
  onSubmit: (values: IDescriptionData) => void;
}
