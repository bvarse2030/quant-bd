/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface GalleryProps {
  data?: IGalleryData | string;
}

export interface IGalleryItem {
  id: string;
  url: string;
  caption?: string;
}

export type GalleryLayout = 'grid' | 'masonry' | 'bento' | 'filmstrip';
export type HoverEffect = 'zoom' | 'overlay' | 'grayscale' | 'lift' | 'none';
export type AnimationType = 'fade' | 'scale' | 'slide-up' | 'none';
export type Columns = 2 | 3 | 4 | 5;
export type Gap = 'none' | 'sm' | 'md' | 'lg';

export interface IGalleryData {
  images: IGalleryItem[];

  layout: GalleryLayout;
  columns: Columns;
  gap: Gap;
  aspectRatio: 'auto' | 'square' | 'video' | 'portrait';

  hoverEffect: HoverEffect;
  animation: AnimationType;
  showCaption: boolean;

  rounded: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const defaultDataSection28: IGalleryData = {
  images: [
    { id: '1', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80', caption: 'Mountain View' },
    { id: '2', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80', caption: 'Abstract Art' },
    { id: '3', url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&q=80', caption: 'Urban Life' },
    { id: '4', url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80', caption: 'Forest Path' },
    { id: '5', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80', caption: 'Lake Calm' },
    { id: '6', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80', caption: 'Foggy Morning' },
  ],
  layout: 'bento',
  columns: 3,
  gap: 'md',
  aspectRatio: 'auto',
  hoverEffect: 'overlay',
  animation: 'fade',
  showCaption: true,
  rounded: 'lg',
};

export interface GalleryFormProps {
  data?: IGalleryData;
  onSubmit: (values: IGalleryData) => void;
}
