/*
|-----------------------------------------
| setting up TimeField for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const TimeField = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();

  const hourScrollRef = React.useRef<HTMLDivElement>(null);
  const minuteScrollRef = React.useRef<HTMLDivElement>(null);

  const formatTime = (date: Date | undefined): string => {
    if (!date) return '';

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const handleHourSelect = (hour: number) => {
    const newDate = selectedDate ? new Date(selectedDate) : new Date();
    newDate.setHours(hour, newDate.getMinutes(), 0, 0);
    setSelectedDate(newDate);
  };

  const handleMinuteSelect = (minute: number) => {
    const newDate = selectedDate ? new Date(selectedDate) : new Date();
    newDate.setMinutes(minute, 0, 0);
    setSelectedDate(newDate);
  };

  React.useEffect(() => {
    if (isOpen && selectedDate) {
      const currentHour = selectedDate.getHours();
      const currentMinute = selectedDate.getMinutes();

      if (hourScrollRef.current) {
        const hourElement = hourScrollRef.current.querySelector(`[data-hour="${currentHour}"]`);
        if (hourElement) {
          hourElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }

      if (minuteScrollRef.current) {
        const minuteElement = minuteScrollRef.current.querySelector(`[data-minute="${currentMinute}"]`);
        if (minuteElement) {
          minuteElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }
    }
  }, [isOpen, selectedDate]);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const currentHour = selectedDate?.getHours();
  const currentMinute = selectedDate?.getMinutes();

  return (
    <div className={cn('relative w-fit')}>
      <div className="text-red-700">This component works without popup</div>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn('w-full justify-start text-left font-normal', !selectedDate && 'text-muted-foreground')}
            aria-label={selectedDate ? `Selected time: ${formatTime(selectedDate)}` : 'Pick a time'}
          >
            <Clock className="mr-2 h-4 w-4" />
            {selectedDate ? formatTime(selectedDate) : <span>Pick a time</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-50">
          <div className="flex max-h-48">
            <ScrollArea className="h-48 w-20 border-r" ref={hourScrollRef}>
              <div className="flex flex-col p-1">
                {hours.map(hour => {
                  const ampm = hour >= 12 ? 'PM' : 'AM';
                  let displayHour = hour % 12;
                  displayHour = displayHour === 0 ? 12 : displayHour;

                  const isSelected = currentHour === hour;

                  return (
                    <Button
                      key={hour}
                      variant="ghost"
                      className={cn(
                        'flex items-center justify-center text-sm p-2 w-full',
                        isSelected && 'bg-accent text-accent-foreground hover:bg-accent',
                        'hover:bg-accent/50',
                      )}
                      onClick={() => handleHourSelect(hour)}
                      data-hour={hour}
                    >
                      {displayHour.toString().padStart(2, '0')} <span className="text-xs ml-1">{ampm}</span>
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>

            <ScrollArea className="h-48 w-20" ref={minuteScrollRef}>
              <div className="flex flex-col p-1">
                {minutes.map(minute => {
                  const isSelected = currentMinute === minute;
                  return (
                    <Button
                      key={minute}
                      variant="ghost"
                      className={cn(
                        'flex items-center justify-center text-sm p-2 w-full',
                        isSelected && 'bg-accent text-accent-foreground hover:bg-accent',
                        'hover:bg-accent/50',
                      )}
                      onClick={() => handleMinuteSelect(minute)}
                      data-minute={minute}
                    >
                      {minute.toString().padStart(2, '0')}
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TimeField;
