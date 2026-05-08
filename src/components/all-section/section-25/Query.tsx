/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import { defaultDataSection25, ISliderData, SliderProps } from './data';

const QuerySection25 = ({ data }: SliderProps) => {
  let sliderData = defaultDataSection25;

  if (data && typeof data === 'string') {
    sliderData = JSON.parse(data) as ISliderData;
  } else if (data) {
    sliderData = data as ISliderData;
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const { slides, autoplaySpeed, isAutoplay, infiniteLoop, itemsPerSlide, height, navPosition, showArrowsOnHover, overlayOpacity } = sliderData;

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev >= totalSlides - itemsPerSlide) {
        return infiniteLoop ? 0 : prev;
      }
      return prev + 1;
    });
  }, [totalSlides, itemsPerSlide, infiniteLoop]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev === 0) {
        return infiniteLoop ? Math.max(0, totalSlides - itemsPerSlide) : 0;
      }
      return prev - 1;
    });
  }, [totalSlides, itemsPerSlide, infiniteLoop]);

  useEffect(() => {
    if (!isAutoplay || isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, autoplaySpeed || 3000);

    return () => clearInterval(interval);
  }, [isAutoplay, isPaused, autoplaySpeed, nextSlide]);

  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  const heightClass = {
    auto: 'h-auto aspect-video',
    'fixed-sm': 'h-[300px]',
    'fixed-md': 'h-[500px]',
    'fixed-lg': 'h-[700px]',
    screen: 'h-screen',
  }[height];

  const getNavClasses = () => {
    switch (navPosition) {
      case 'middle-outside':
        return { prev: '-left-12', next: '-right-12', container: 'top-1/2 -translate-y-1/2' };
      case 'bottom-overlay':
        return { prev: 'left-4 bottom-4', next: 'left-16 bottom-4', container: '' };
      case 'bottom-outside':
        return { prev: 'left-0 -bottom-12', next: 'left-12 -bottom-12', container: '' };
      case 'middle-inside':
      default:
        return { prev: 'left-4', next: 'right-4', container: 'top-1/2 -translate-y-1/2' };
    }
  };
  const navClasses = getNavClasses();

  const itemWidthPercent = 100 / itemsPerSlide;

  if (!slides.length) return <div className="p-10 text-center text-gray-500">No slides configured.</div>;

  return (
    <div
      className={cn(
        'relative group w-full max-w-full mx-auto select-none',
        navPosition === 'middle-outside' || navPosition === 'bottom-outside' ? 'mb-12' : '',
      )}
      onMouseEnter={() => sliderData.pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => sliderData.pauseOnHover && setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className={cn('overflow-hidden w-full rounded-xl bg-gray-900', heightClass)}>
        <div className="flex h-full transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentIndex * itemWidthPercent}%)` }}>
          {slides.map(slide => (
            <div key={slide.id} className="flex-shrink-0 h-full relative px-1" style={{ width: `${itemWidthPercent}%` }}>
              <div className="relative w-full h-full overflow-hidden rounded-lg">
                {slide.image ? (
                  <Image
                    width={2200}
                    height={2200}
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600">No Image</div>
                )}

                {(slide.title || slide.description) && (
                  <div
                    className="absolute inset-0 flex flex-col justify-end p-8"
                    style={{ background: `linear-gradient(to top, rgba(0,0,0,${overlayOpacity / 100}) 0%, transparent 100%)` }}
                  >
                    <div className="space-y-3 max-w-xl animate-in slide-in-from-bottom-4 fade-in duration-700">
                      {slide.title && <h3 className="text-2xl md:text-4xl font-bold text-white drop-shadow-md">{slide.title}</h3>}
                      {slide.description && <p className="text-sm md:text-base text-gray-200 drop-shadow-sm line-clamp-3">{slide.description}</p>}

                      {slide.buttonText && (
                        <Button asChild size="sm" className="mt-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm">
                          <Link href={slide.buttonLink || '#'}>{slide.buttonText}</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {totalSlides > itemsPerSlide && (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className={cn(
              'absolute z-10 h-10 w-10 rounded-full bg-black/30 border-white/10 text-white backdrop-blur-md hover:bg-black/50 transition-all duration-300',
              navClasses.container,
              navClasses.prev,
              showArrowsOnHover ? 'opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0' : 'opacity-100',
              !infiniteLoop && currentIndex === 0 && 'opacity-30 cursor-not-allowed hover:bg-black/30',
            )}
            disabled={!infiniteLoop && currentIndex === 0}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className={cn(
              'absolute z-10 h-10 w-10 rounded-full bg-black/30 border-white/10 text-white backdrop-blur-md hover:bg-black/50 transition-all duration-300',
              navClasses.container,
              navClasses.next,
              showArrowsOnHover ? 'opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0' : 'opacity-100',
              !infiniteLoop && currentIndex >= totalSlides - itemsPerSlide && 'opacity-30 cursor-not-allowed hover:bg-black/30',
            )}
            disabled={!infiniteLoop && currentIndex >= totalSlides - itemsPerSlide}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {Array.from({ length: Math.ceil(totalSlides - itemsPerSlide + 1) }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300 shadow-sm',
              idx === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60',
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default QuerySection25;
