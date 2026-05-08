/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { iconMap } from '@/components/all-icons/all-icons';

import { defaultDataSection20, IButton2Data, Button2Props } from './data';

const QuerySection20 = ({ data }: Button2Props) => {
  let buttonData = defaultDataSection20;

  if (data && typeof data === 'string') {
    buttonData = JSON.parse(data) as IButton2Data;
  }

  const getWidthClass = (width: string | undefined) => {
    switch (width) {
      case 'full':
        return 'w-full';
      case 'fixed-sm':
        return 'w-[120px]';
      case 'fixed-md':
        return 'w-[200px]';
      case 'fixed-lg':
        return 'w-[300px]';
      case 'fixed-xl':
        return 'w-[400px]';
      case 'auto':
      default:
        return 'w-auto';
    }
  };

  const renderIcon = () => {
    if (!buttonData.buttonIcon) return null;
    if (buttonData.buttonIcon === 'doc-icon') {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      );
    }
    const MappedIcon = iconMap ? iconMap[buttonData.buttonIcon] : null;

    if (MappedIcon) {
      return <span className="w-4 h-4 flex items-center justify-center">{MappedIcon}</span>;
    }

    return <span className="text-[10px] font-mono border border-current rounded px-1">{buttonData.buttonIcon.substring(0, 2).toUpperCase()}</span>;
  };

  return (
    <div className="p-10 flex items-center justify-center bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl rounded-xl">
      <Button
        asChild
        variant={buttonData.buttonVariant || 'default'}
        size={buttonData.buttonSize || 'default'}
        className={cn('gap-3', getWidthClass(buttonData.buttonWidth))}
      >
        <Link
          href={buttonData.buttonPath || '#'}
          target={buttonData.isNewTab ? '_blank' : undefined}
          rel={buttonData.isNewTab ? 'noopener noreferrer' : undefined}
        >
          {renderIcon()}

          <span className="truncate">{buttonData.buttonName || 'Click Here'}</span>

          {buttonData.isNewTab && (
            <svg className="w-3 h-3 opacity-70 ml-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          )}
        </Link>
      </Button>
    </div>
  );
};

export default QuerySection20;
