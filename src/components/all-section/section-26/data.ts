/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface TagSliderProps {
  data?: ITagSliderData | string;
}

export interface ITagItem {
  id: string;
  text: string;
  link?: string;
}

export type NavPosition = 'middle-outside' | 'bottom-outside' | 'hidden';
export type TagStyle = 'glassy' | 'solid' | 'outline' | 'minimal';
export type ItemsPerSlide = 1 | 2 | 3 | 4 | 5 | 6;

export interface ITagSliderData {
  tags: ITagItem[];

  autoplaySpeed: number;
  isAutoplay: boolean;
  infiniteLoop: boolean;
  pauseOnHover: boolean;

  itemsPerSlide: ItemsPerSlide;
  navPosition: NavPosition;

  tagStyle: TagStyle;
  gap: 'sm' | 'md' | 'lg';
}

export const defaultDataSection26: ITagSliderData = {
  tags: [
    { id: '1', text: 'Technology', link: '#' },
    { id: '2', text: 'Design', link: '#' },
    { id: '3', text: 'Artificial Intelligence', link: '#' },
    { id: '4', text: 'Development', link: '#' },
    { id: '5', text: 'UI/UX', link: '#' },
    { id: '6', text: 'Business', link: '#' },
    { id: '7', text: 'Marketing', link: '#' },
  ],
  autoplaySpeed: 2500,
  isAutoplay: true,
  infiniteLoop: true,
  pauseOnHover: true,
  itemsPerSlide: 4,
  navPosition: 'middle-outside',
  tagStyle: 'glassy',
  gap: 'md',
};

export const STYLE_PRESETS: Record<TagStyle, string> = {
  glassy: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20',
  solid: 'bg-blue-600 border border-blue-600 text-white hover:bg-blue-500',
  outline: 'bg-transparent border border-zinc-600 text-zinc-300 hover:border-zinc-400 hover:text-white',
  minimal: 'bg-zinc-900/50 border border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800',
};

export interface TagSliderFormProps {
  data?: ITagSliderData;
  onSubmit: (values: ITagSliderData) => void;
}
