/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

import { cn } from '@/lib/utils';

import { alignMap, defaultDataSection21, ITitleData, paddingMap, sizeMap, TitleProps } from './data';

const QuerySection21 = ({ data }: TitleProps) => {
  let titleData = defaultDataSection21;

  if (data && typeof data === 'string') {
    titleData = JSON.parse(data) as ITitleData;
  } else if (data) {
    titleData = data as ITitleData;
  }

  const containerClasses = cn(
    'w-full h-full flex items-center bg-transparent transition-all duration-300 ease-in-out',
    paddingMap[titleData.padding] || 'p-6',
    titleData.textAlign === 'justify' ? 'block' : 'flex-col',
  );

  const textClasses = cn(
    'font-bold tracking-tight text-white leading-tight transition-all duration-300',
    sizeMap[titleData.textSize] || 'text-4xl',
    alignMap[titleData.textAlign] || 'text-center',
    titleData.isUnderline && 'underline decoration-blue-500/50 decoration-4 underline-offset-8',
    titleData.isLink && 'hover:text-blue-200 group-hover:scale-[1.01] origin-center',
  );

  const Content = () => (
    <h2 className={textClasses}>
      {titleData.text}
      {titleData.isLink && titleData.isNewTab && (
        <span className="inline-block ml-2 align-top opacity-0 group-hover:opacity-50 transition-opacity duration-300">
          <ExternalLink className="w-[0.4em] h-[0.4em]" />
        </span>
      )}
    </h2>
  );

  return (
    <div className={cn('group relative', containerClasses)}>
      {titleData.isLink ? (
        <Link
          href={titleData.url || '#'}
          target={titleData.isNewTab ? '_blank' : undefined}
          rel={titleData.isNewTab ? 'noopener noreferrer' : undefined}
          className="block w-full transition-opacity hover:opacity-90"
        >
          <Content />
        </Link>
      ) : (
        <Content />
      )}
    </div>
  );
};

export default QuerySection21;
