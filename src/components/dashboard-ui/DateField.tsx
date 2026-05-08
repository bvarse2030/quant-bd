/*
|-----------------------------------------
| setting up DateField for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

export interface DateFieldProps {
  id?: string;
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
}

export function DateField({ value, onChange, id = Math.random().toString() }: DateFieldProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div id={id} ref={ref} className={cn('flex flex-col gap-3 relative', open && 'mb-[350px]')}>
      <Label htmlFor={id} className="px-1 text-white/90 drop-shadow-sm">
        Date
      </Label>

      <Button
        variant="outline"
        id={id}
        onClick={() => setOpen(prev => !prev)}
        type="button"
        className={cn(
          'w-48 justify-between font-normal',
          'bg-white/10 border-white/20 text-white/90',
          'backdrop-blur-md rounded-xl shadow-lg',
          'hover:bg-white/20 hover:shadow-xl transition-all duration-300',
        )}
      >
        {value ? format(value, 'PPP') : 'Select date'}
        <ChevronDown className={cn('ml-2 h-4 w-4 opacity-70', open && 'rotate-180')} />
      </Button>

      {open && (
        <div
          className={cn(
            'absolute top-full left-0 mt-2 z-[9999] p-2',
            'rounded-xl border border-white/20 shadow-2xl',
            'bg-white/10 backdrop-blur-lg transition-all duration-300',
          )}
        >
          <Calendar
            mode="single"
            selected={value}
            captionLayout="dropdown"
            onSelect={selectedDate => {
              onChange(selectedDate ?? undefined);
              setOpen(false);
            }}
            className="text-white/90"
          />
        </div>
      )}
    </div>
  );
}

DateField.displayName = 'DateField';
