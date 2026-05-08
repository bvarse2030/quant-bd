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

import { defaultDataSection27, ILogoData, LogoProps } from './data';

const QuerySection27 = ({ data }: LogoProps) => {
  let logoData = defaultDataSection27;

  if (data && typeof data === 'string') {
    logoData = JSON.parse(data) as ILogoData;
  } else if (data) {
    logoData = data as ILogoData;
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(logoData.responsive.desktop);
  const [isPaused, setIsPaused] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { logos, autoplaySpeed, isAutoplay, infiniteLoop, navPosition, gap, pauseOnHover, grayscale } = logoData;

  const totalItems = logos.length;

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleCount(logoData.responsive.mobile);
      } else if (width < 1024) {
        setVisibleCount(logoData.responsive.tablet);
      } else {
        setVisibleCount(logoData.responsive.desktop);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [logoData.responsive]);

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev >= totalItems - visibleCount) {
        return infiniteLoop ? 0 : prev;
      }
      return prev + 1;
    });
  }, [totalItems, visibleCount, infiniteLoop]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev === 0) {
        return infiniteLoop ? Math.max(0, totalItems - visibleCount) : 0;
      }
      return prev - 1;
    });
  }, [totalItems, visibleCount, infiniteLoop]);

  useEffect(() => {
    if (!isAutoplay || isPaused || !mounted) return;

    if (totalItems <= visibleCount && !infiniteLoop) return;

    const interval = setInterval(() => {
      nextSlide();
    }, autoplaySpeed || 3000);

    return () => clearInterval(interval);
  }, [isAutoplay, isPaused, autoplaySpeed, nextSlide, totalItems, visibleCount, infiniteLoop, mounted]);

  const gapMap = {
    sm: 'px-2',
    md: 'px-4',
    lg: 'px-6',
    xl: 'px-8',
  }[gap || 'lg'];

  const navClasses = {
    'middle-outside': { container: 'relative flex items-center', prev: '-left-12', next: '-right-12', wrapper: '' },
    'bottom-outside': {
      container: 'relative flex flex-col gap-6',
      prev: 'left-[40%] bottom-0 translate-y-full',
      next: 'right-[40%] bottom-0 translate-y-full',
      wrapper: 'order-first',
    },
    hidden: { container: 'relative', prev: 'hidden', next: 'hidden', wrapper: '' },
  }[navPosition || 'hidden'];

  if (!mounted) return <div className="w-full h-20 bg-transparent animate-pulse" />;
  if (logos.length === 0) return null;

  const itemWidth = 100 / visibleCount;

  return (
    <div
      className={cn('w-full max-w-full mx-auto px-12 py-4', navPosition === 'bottom-outside' ? 'mb-12' : '')}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <div className={navClasses.container}>
        {navPosition !== 'hidden' && totalItems > visibleCount && (
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            className={cn(
              'absolute z-10 h-10 w-10 rounded-full border border-white/10 bg-black/20 text-white hover:bg-white/10 transition-colors',
              navClasses.prev,
              !infiniteLoop && currentIndex === 0 && 'opacity-30 cursor-not-allowed',
            )}
            disabled={!infiniteLoop && currentIndex === 0}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}

        <div className={cn('overflow-hidden w-full', navClasses.wrapper)}>
          <div
            className="flex items-center transition-transform duration-700 ease-in-out will-change-transform"
            style={{ transform: `translateX(-${currentIndex * itemWidth}%)` }}
          >
            {logos.map(logo => (
              <div key={logo.id} className={cn('flex-shrink-0 flex items-center justify-center', gapMap)} style={{ width: `${itemWidth}%` }}>
                {logo.link ? (
                  <Link href={logo.link} target="_blank" rel="noopener noreferrer" className="group/logo w-full flex justify-center">
                    <Image
                      width={200}
                      height={200}
                      src={logo.image}
                      alt={logo.alt}
                      className={cn(
                        'max-w-full h-12 w-auto object-contain transition-all duration-300',
                        grayscale
                          ? 'grayscale opacity-60 group-hover/logo:grayscale-0 group-hover/logo:opacity-100 group-hover/logo:scale-110'
                          : 'hover:scale-105',
                      )}
                    />
                  </Link>
                ) : (
                  <div className="group/logo w-full flex justify-center">
                    <Image
                      width={200}
                      height={200}
                      src={logo.image}
                      alt={logo.alt}
                      className={cn(
                        'max-w-full h-12 w-auto object-contain transition-all duration-300',
                        grayscale
                          ? 'grayscale opacity-60 group-hover/logo:grayscale-0 group-hover/logo:opacity-100 group-hover/logo:scale-110'
                          : 'hover:scale-105',
                      )}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {navPosition !== 'hidden' && totalItems > visibleCount && (
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            className={cn(
              'absolute z-10 h-10 w-10 rounded-full border border-white/10 bg-black/20 text-white hover:bg-white/10 transition-colors',
              navClasses.next,
              !infiniteLoop && currentIndex >= totalItems - visibleCount && 'opacity-30 cursor-not-allowed',
            )}
            disabled={!infiniteLoop && currentIndex >= totalItems - visibleCount}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuerySection27;
