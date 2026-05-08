/*
|-----------------------------------------
| setting up DateRangePickerField for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

export interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  id: string;
  label?: string;
  placeholder?: string;
  className?: string;
}

export default function DateRangePickerField({ id, label, value, onChange, placeholder = 'Select a date range', className }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={cn('relative grid w-full items-center gap-1.5', isOpen && 'mb-64', className)}>
      {label && (
        <Label className="text-white/90 drop-shadow-sm" htmlFor={id}>
          {label}
        </Label>
      )}

      <Button
        id={id}
        variant="outline"
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={cn(
          'w-full justify-start text-left font-normal',
          'text-white/90 bg-white/10 hover:bg-white/20 shadow-lg',
          'border-white/20 backdrop-blur-md rounded-xl',
          'transition-all duration-300',
          !value && 'text-white/60',
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4 text-white/80" />
        {value?.from ? (
          value.to ? (
            <>
              {format(value.from, 'LLL dd, y')} – {format(value.to, 'LLL dd, y')}
            </>
          ) : (
            format(value.from, 'LLL dd, y')
          )
        ) : (
          <span>{placeholder}</span>
        )}
      </Button>

      {isOpen && (
        <div
          className="
          absolute top-full left-0 mt-2 z-[9999]
          rounded-2xl border border-white/20
          bg-white/10 backdrop-blur-xl shadow-2xl
          p-3 animate-in fade-in zoom-in-95
        "
        >
          <Calendar
            mode="range"
            initialFocus
            numberOfMonths={2}
            defaultMonth={value?.from}
            selected={value}
            onSelect={range => {
              onChange(range);
              if (range?.from && range?.to) setIsOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

DateRangePickerField.displayName = 'DateRangePickerField';
