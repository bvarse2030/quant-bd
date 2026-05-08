/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import { defaultDataSection26, ITagSliderData, TagSliderProps } from './data';

const QuerySection26 = ({ data }: TagSliderProps) => {
  let sliderData = defaultDataSection26;

  if (data && typeof data === 'string') {
    sliderData = JSON.parse(data) as ITagSliderData;
  } else if (data) {
    sliderData = data as ITagSliderData;
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { tags, autoplaySpeed, isAutoplay, infiniteLoop, itemsPerSlide, navPosition, tagStyle, gap, pauseOnHover } = sliderData;

  const totalItems = tags.length;
  const safeItemsPerSlide = itemsPerSlide || 4;

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev >= totalItems - safeItemsPerSlide) {
        return infiniteLoop ? 0 : prev;
      }
      return prev + 1;
    });
  }, [totalItems, safeItemsPerSlide, infiniteLoop]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev === 0) {
        return infiniteLoop ? Math.max(0, totalItems - safeItemsPerSlide) : 0;
      }
      return prev - 1;
    });
  }, [totalItems, safeItemsPerSlide, infiniteLoop]);

  useEffect(() => {
    if (!isAutoplay || isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, autoplaySpeed || 3000);

    return () => clearInterval(interval);
  }, [isAutoplay, isPaused, autoplaySpeed, nextSlide, totalItems, safeItemsPerSlide]);

  const gapClass = {
    sm: 'px-1',
    md: 'px-2',
    lg: 'px-4',
  }[gap || 'md'];

  const getTagStyle = (hasLink: boolean) => {
    const base = 'flex items-center justify-center w-full h-12 rounded-lg transition-all duration-300 font-medium text-sm whitespace-nowrap';
    const cursor = hasLink ? 'cursor-pointer hover:-translate-y-0.5' : 'cursor-default';

    switch (tagStyle) {
      case 'solid':
        return cn(base, cursor, 'bg-white text-black shadow-md hover:bg-gray-100');
      case 'outline':
        return cn(base, cursor, 'border border-white/30 text-white bg-transparent hover:border-white hover:bg-white/5');
      case 'minimal':
        return cn(base, cursor, 'text-gray-300 hover:text-white bg-transparent hover:bg-white/5');
      case 'glassy':
      default:
        return cn(base, cursor, 'bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 hover:border-white/20 shadow-lg');
    }
  };

  const navClasses = {
    'middle-outside': { container: 'relative flex items-center', prev: '-left-10', next: '-right-10', wrapper: '' },
    'bottom-outside': {
      container: 'relative flex flex-col gap-4',
      prev: 'left-[40%] bottom-0 translate-y-full',
      next: 'right-[40%] bottom-0 translate-y-full',
      wrapper: 'order-first',
    },
    hidden: { container: 'relative', prev: 'hidden', next: 'hidden', wrapper: '' },
  }[navPosition || 'middle-outside'];

  const itemWidth = `${100 / safeItemsPerSlide}%`;

  if (tags.length === 0) return null;

  return (
    <div
      className={cn('w-full max-w-full mx-auto px-10', navPosition === 'bottom-outside' ? 'mb-12' : '')}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <div className={navClasses.container}>
        {navPosition !== 'hidden' && totalItems > safeItemsPerSlide && (
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            className={cn(
              'absolute z-10 h-8 w-8 rounded-full border border-white/10 bg-black/20 text-white hover:bg-white/10 transition-colors',
              navClasses.prev,
              !infiniteLoop && currentIndex === 0 && 'opacity-30 cursor-not-allowed',
            )}
            disabled={!infiniteLoop && currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        <div className={cn('overflow-hidden w-full', navClasses.wrapper)}>
          <div
            className="flex transition-transform duration-500 ease-in-out will-change-transform"
            style={{ transform: `translateX(-${currentIndex * (100 / safeItemsPerSlide)}%)` }}
          >
            {tags.map(tag => (
              <div key={tag.id} className={cn('flex-shrink-0', gapClass)} style={{ width: itemWidth }}>
                {tag.link ? (
                  <Link href={tag.link} className={getTagStyle(true)}>
                    {tag.text}
                  </Link>
                ) : (
                  <div className={getTagStyle(false)}>{tag.text}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {navPosition !== 'hidden' && totalItems > safeItemsPerSlide && (
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            className={cn(
              'absolute z-10 h-8 w-8 rounded-full border border-white/10 bg-black/20 text-white hover:bg-white/10 transition-colors',
              navClasses.next,
              !infiniteLoop && currentIndex >= totalItems - safeItemsPerSlide && 'opacity-30 cursor-not-allowed',
            )}
            disabled={!infiniteLoop && currentIndex >= totalItems - safeItemsPerSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuerySection26;
