/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import Link from 'next/link';

import { iconMap } from '@/components/all-icons/all-icons-jsx';

import { defaultDataSection19, Button1Props } from './data';

const QuerySection19 = ({ data }: Button1Props) => {
  let buttonData = defaultDataSection19;

  if (data && typeof data === 'string') {
    try {
      buttonData = { ...defaultDataSection19, ...JSON.parse(data) };
    } catch (e) {
      console.error('Error parsing button data:', e);
    }
  } else if (data && typeof data === 'object') {
    buttonData = { ...defaultDataSection19, ...data };
  }

  const IconComponent = buttonData.buttonIcon ? iconMap[buttonData.buttonIcon] : null;

  return (
    <div className="p-10 flex items-center justify-center bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl rounded-xl">
      <Link
        href={buttonData.buttonPath || '#'}
        target={buttonData.isNewTab ? '_blank' : undefined}
        rel={buttonData.isNewTab ? 'noopener noreferrer' : undefined}
        className="group relative inline-flex items-center gap-3 px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-semibold shadow-lg transition-all hover:shadow-xl hover:scale-105 focus:ring-2 focus:ring-purple-400 focus:outline-none"
      >
        {IconComponent && (
          <span className="flex items-center justify-center bg-white/20 rounded-full p-1 group-hover:bg-white/30 transition-colors">
            <IconComponent size={18} strokeWidth={2} />
          </span>
        )}

        <span>{buttonData.buttonName || 'Click Here'}</span>

        {buttonData.isNewTab && (
          <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        )}
      </Link>
    </div>
  );
};

export default QuerySection19;
