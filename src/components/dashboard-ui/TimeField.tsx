/*
|-----------------------------------------
| setting up TimeField for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface TimeFieldProps {
  value: string | null | undefined;
  onChange: (time: string | undefined) => void;
  id: string;
  label?: string;
  placeholder?: string;
  className?: string;
}

export default function TimeField({ id, label, value, onChange, placeholder = 'Pick a time', className }: TimeFieldProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const hourScrollRef = React.useRef<HTMLDivElement>(null);
  const minuteScrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const parsedTime = React.useMemo(() => {
    if (!value) return { hour: null, minute: null };
    const [h, m] = value.split(':').map(Number);
    if (!isNaN(h) && h >= 0 && h <= 23 && !isNaN(m) && m >= 0 && m <= 59) {
      return { hour: h, minute: m };
    }
    return { hour: null, minute: null };
  }, [value]);

  const displayTime = React.useMemo(() => {
    if (parsedTime.hour === null || parsedTime.minute === null) {
      return placeholder;
    }
    const date = new Date();
    date.setHours(parsedTime.hour, parsedTime.minute);
    return format(date, 'hh:mm a');
  }, [parsedTime, placeholder]);

  const handleTimeChange = (part: 'hour' | 'minute', val: number) => {
    const now = new Date();
    const currentHour = parsedTime.hour ?? now.getHours();
    const currentMinute = parsedTime.minute ?? now.getMinutes();
    const newHour = part === 'hour' ? val : currentHour;
    const newMinute = part === 'minute' ? val : currentMinute;
    const newTimeString = `${String(newHour).padStart(2, '0')}:${String(newMinute).padStart(2, '0')}`;
    onChange(newTimeString);
    if (part === 'minute') setIsOpen(false);
  };

  React.useEffect(() => {
    if (!isOpen) return;
    if (parsedTime.hour !== null) {
      hourScrollRef.current?.querySelector(`[data-hour="${parsedTime.hour}"]`)?.scrollIntoView({ block: 'center' });
    }
    if (parsedTime.minute !== null) {
      minuteScrollRef.current?.querySelector(`[data-minute="${parsedTime.minute}"]`)?.scrollIntoView({ block: 'center' });
    }
  }, [isOpen, parsedTime]);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div ref={ref} className={cn('relative grid w-full items-center gap-1.5', isOpen && 'mb-64', className)}>
      {label && <Label className="text-white/90 drop-shadow-sm">{label}</Label>}

      <Button
        id={id}
        variant="outline"
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={cn(
          'w-full justify-start text-left font-normal',
          'text-white/90 bg-white/10 hover:bg-white/20',
          'border-white/20 backdrop-blur-md rounded-xl shadow-lg',
          'transition-all duration-300',
          !value && 'text-white/60',
        )}
      >
        <Clock className="mr-2 h-4 w-4" />
        {displayTime}
      </Button>

      {isOpen && (
        <div
          className="
          absolute top-full left-0 mt-2 z-[9999]
          rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl
          shadow-2xl overflow-hidden
        "
        >
          <div className="flex max-h-56">
            <ScrollArea className="h-56 w-24 border-r border-white/10" ref={hourScrollRef}>
              <div className="p-1 space-y-1">
                {hours.map(hour => (
                  <Button
                    key={hour}
                    variant="ghost"
                    className={cn(
                      'w-full text-xs justify-center rounded-md text-white/90 hover:bg-white/20 transition',
                      parsedTime.hour === hour && 'bg-white/30 border border-white/40 shadow-md',
                    )}
                    onClick={() => handleTimeChange('hour', hour)}
                    data-hour={hour}
                  >
                    {format(new Date().setHours(hour), 'hh a')}
                  </Button>
                ))}
              </div>
            </ScrollArea>

            <ScrollArea className="h-56 w-20" ref={minuteScrollRef}>
              <div className="p-1 space-y-1">
                {minutes.map(min => (
                  <Button
                    key={min}
                    variant="ghost"
                    className={cn(
                      'w-full text-xs justify-center rounded-md text-white/90 hover:bg-white/20 transition',
                      parsedTime.minute === min && 'bg-white/30 border border-white/40 shadow-md',
                    )}
                    onClick={() => handleTimeChange('minute', min)}
                    data-minute={min}
                  >
                    {String(min).padStart(2, '0')}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}
