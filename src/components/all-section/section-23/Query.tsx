/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { cn } from '@/lib/utils';

import { alignMap, defaultDataSection23, IParagraphData, PADDING_MAP, ParagraphProps, sizeMap, weightMap } from './data';

const QuerySection23 = ({ data }: ParagraphProps) => {
  let paraData = defaultDataSection23;

  if (data && typeof data === 'string') {
    paraData = JSON.parse(data) as IParagraphData;
  } else if (data) {
    paraData = data as IParagraphData;
  }

  return (
    <div className={cn('w-full transition-all duration-300 ease-in-out', PADDING_MAP[paraData.padding] || 'p-6', alignMap[paraData.textAlign] || 'text-left')}>
      <p
        className={cn(
          'text-gray-200 whitespace-pre-wrap break-words',
          sizeMap[paraData.textSize] || 'text-base',
          weightMap[paraData.textWeight] || 'font-normal',
          paraData.isUnderline && 'underline decoration-gray-500/50 underline-offset-4',
        )}
        style={{ opacity: (paraData.opacity || 100) / 100 }}
      >
        {paraData.text}
      </p>
    </div>
  );
};

export default QuerySection23;
