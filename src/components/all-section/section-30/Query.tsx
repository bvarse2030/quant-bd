/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { iconMap } from '@/components/all-icons/all-icons-jsx';

import { defaultDataSection30, IDefaultDataSection30Props } from './data';

const QuerySection30 = ({ data }: IDefaultDataSection30Props) => {
  let parsedData = data;
  if (typeof data === 'string') {
    try {
      parsedData = JSON.parse(data);
    } catch (error) {
      console.error('Error parsing QuerySection30 data', error);
    }
  }

  const { iconName } = {
    ...defaultDataSection30,
    ...(typeof parsedData === 'object' ? parsedData : {}),
  };

  const IconComponent = iconName ? iconMap[iconName] : null;

  if (!IconComponent) {
    return <div className="hidden" />;
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <IconComponent className="w-full h-full object-contain text-inherit" />
    </div>
  );
};

export default QuerySection30;
