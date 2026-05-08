/*
|-----------------------------------------
| setting up TimeRangePickerField for the App
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

export interface TimeRangePickerProps {
  value: { start: string; end: string } | undefined;
  onChange: (range: { start: string; end: string } | undefined) => void;
  id: string;
  label?: string;
  className?: string;
}

export default function TimeRangePickerField({ id, label = 'Time Range', value, onChange, className }: TimeRangePickerProps) {
  const [openPicker, setOpenPicker] = React.useState<'start' | 'end' | null>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpenPicker(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const formatDisplayTime = (time: string | undefined) => {
    if (!time) return 'Select time';
    const [h, m] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m);
    return format(date, 'hh:mm a');
  };

  const handleTimeChange = (part: 'start' | 'end', timeValue: string) => {
    const newRange = {
      start: value?.start ?? '00:00',
      end: value?.end ?? '00:00',
    };
    newRange[part] = timeValue;
    onChange(newRange);
    setOpenPicker(null);
  };

  const renderPicker = (part: 'start' | 'end') => {
    const current = value?.[part];
    const [hour, minute] = current ? current.split(':').map(Number) : [null, null];

    return (
      <div
        className="
          absolute top-full left-0 mt-2 z-[9999]
          w-[180px]
          rounded-xl border border-white/20
          bg-white/10 backdrop-blur-xl shadow-2xl
          overflow-hidden
        "
      >
        <div className="flex max-h-56">
          <ScrollArea className="h-56 w-24 border-r border-white/10">
            <div className="p-1 space-y-1">
              {hours.map(h => (
                <Button
                  key={h}
                  variant="ghost"
                  className={cn(
                    'w-full text-xs text-white/90 hover:bg-white/20 transition rounded-lg',
                    hour === h && 'bg-white/30 border border-white/40 shadow-md',
                  )}
                  onClick={() => {
                    const newTime = `${String(h).padStart(2, '0')}:${String(minute ?? 0).padStart(2, '0')}`;
                    handleTimeChange(part, newTime);
                  }}
                >
                  {format(new Date().setHours(h), 'hh a')}
                </Button>
              ))}
            </div>
          </ScrollArea>

          <ScrollArea className="h-56 w-20">
            <div className="p-1 space-y-1">
              {minutes.map(m => (
                <Button
                  key={m}
                  variant="ghost"
                  className={cn(
                    'w-full text-xs text-white/90 hover:bg-white/20 transition rounded-lg',
                    minute === m && 'bg-white/30 border border-white/40 shadow-md',
                  )}
                  onClick={() => {
                    const newTime = `${String(hour ?? 0).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                    handleTimeChange(part, newTime);
                  }}
                >
                  {String(m).padStart(2, '0')}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  };

  return (
    <div ref={wrapperRef} className={cn('relative grid w-full gap-1.5', openPicker && 'mb-64', className)}>
      <div className="flex items-center text-white/90 drop-shadow-sm">
        <Clock className="mr-2 h-4 w-4" />
        <Label htmlFor={id}>{label}</Label>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative w-full">
          <Button
            variant="outline"
            className="
              w-full justify-between font-normal text-white/90
              bg-white/10 hover:bg-white/20
              border-white/20 backdrop-blur-md
              shadow-lg rounded-xl
              transition-all
            "
            onClick={() => setOpenPicker(openPicker === 'start' ? null : 'start')}
          >
            {formatDisplayTime(value?.start)}
          </Button>
          {openPicker === 'start' && renderPicker('start')}
        </div>

        <span className="text-white/60">-</span>

        <div className="relative w-full">
          <Button
            variant="outline"
            className="
              w-full justify-between font-normal text-white/90
              bg-white/10 hover:bg-white/20
              border-white/20 backdrop-blur-md
              shadow-lg rounded-xl
              transition-all
            "
            onClick={() => setOpenPicker(openPicker === 'end' ? null : 'end')}
          >
            {formatDisplayTime(value?.end)}
          </Button>
          {openPicker === 'end' && renderPicker('end')}
        </div>
      </div>
    </div>
  );
}

TimeRangePickerField.displayName = 'TimeRangePickerField';
