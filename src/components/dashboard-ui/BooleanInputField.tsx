/*
|-----------------------------------------
| setting up BooleanInputField for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

export function BooleanInputField({ id, checked, onCheckedChange }: { id: string; checked: boolean; onCheckedChange: (checked: boolean) => void }) {
  return (
    <div id={id} className={cn('flex items-center justify-end gap-3 px-4 py-2', 'transition-all duration-300')}>
      <Switch checked={checked} onCheckedChange={onCheckedChange} className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-white/50" />
    </div>
  );
}
