/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import Image from 'next/image';

import { cn } from '@/lib/utils';

import { defaultDataSection28, IGalleryData, GalleryProps, IGalleryItem } from './data';

const QuerySection28 = ({ data }: GalleryProps) => {
  let galleryData = defaultDataSection28;

  if (data && typeof data === 'string') {
    galleryData = JSON.parse(data) as IGalleryData;
  } else if (data) {
    galleryData = data as IGalleryData;
  }

  const { images, layout, columns, gap, aspectRatio, hoverEffect, animation, showCaption, rounded } = galleryData;

  const gapClass = {
    none: 'gap-0 space-y-0',
    sm: 'gap-2 space-y-2',
    md: 'gap-4 space-y-4',
    lg: 'gap-6 space-y-6',
  }[gap];

  const colsClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-5',
  }[columns];

  const masonryColsClass = {
    2: 'columns-1 sm:columns-2',
    3: 'columns-1 sm:columns-2 md:columns-3',
    4: 'columns-2 md:columns-4',
    5: 'columns-2 md:columns-5',
  }[columns];

  const aspectClass = {
    auto: '',
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
  }[aspectRatio];

  const roundedClass = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
  }[rounded];

  const hoverClass = {
    none: '',
    zoom: 'group-hover:scale-110',
    grayscale: 'grayscale group-hover:grayscale-0 transition-all duration-500',
    overlay: 'group-hover:scale-105',
    lift: 'group-hover:-translate-y-2 shadow-lg group-hover:shadow-xl',
  }[hoverEffect];

  const animationClass = {
    none: '',
    fade: 'animate-in fade-in duration-700',
    scale: 'animate-in zoom-in-95 duration-500',
    'slide-up': 'animate-in slide-in-from-bottom-8 fade-in duration-700',
  }[animation];

  const GalleryItem = ({ item, index, isBentoHero = false }: { item: IGalleryItem; index: number; isBentoHero?: boolean }) => (
    <div
      className={cn(
        'relative group overflow-hidden bg-gray-100/5 border border-white/5',
        roundedClass,
        aspectClass,
        aspectRatio === 'auto' ? 'h-full' : '',
        animationClass,
        layout === 'masonry' && 'break-inside-avoid mb-4',
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Image
        width={200}
        height={200}
        src={item.url}
        alt={item.caption || 'Gallery Image'}
        className={cn('w-full h-full object-cover transition-all duration-500 ease-out', hoverClass, isBentoHero && 'object-center')}
        loading="lazy"
      />

      {showCaption && item.caption && (
        <div
          className={cn(
            'absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300',
            hoverEffect === 'overlay' ? 'opacity-0 group-hover:opacity-100' : 'opacity-100',
          )}
        >
          <p className="text-white font-medium text-sm drop-shadow-md translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            {item.caption}
          </p>
        </div>
      )}
    </div>
  );

  if (images.length === 0) return null;

  if (layout === 'masonry') {
    return (
      <div className={cn('w-full block', masonryColsClass, gapClass)}>
        {images.map((item, idx) => (
          <GalleryItem key={item.id} item={item} index={idx} />
        ))}
      </div>
    );
  }

  if (layout === 'filmstrip') {
    return (
      <div className={cn('flex w-full overflow-x-auto pb-4 snap-x', gapClass)}>
        {images.map((item, idx) => (
          <div key={item.id} className="snap-center shrink-0 w-[80vw] sm:w-[400px]">
            <GalleryItem item={item} index={idx} />
          </div>
        ))}
      </div>
    );
  }

  if (layout === 'bento') {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-4 auto-rows-[200px]', gapClass)}>
        {images.map((item, idx) => {
          const isFirst = idx === 0;
          return (
            <div key={item.id} className={cn(isFirst ? 'md:col-span-2 md:row-span-2 h-full' : 'md:col-span-1 md:row-span-1 h-full')}>
              <GalleryItem item={item} index={idx} isBentoHero={isFirst} />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('grid w-full', colsClass, gapClass)}>
      {images.map((item, idx) => (
        <GalleryItem key={item.id} item={item} index={idx} />
      ))}
    </div>
  );
};

export default QuerySection28;
