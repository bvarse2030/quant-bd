/*
|-----------------------------------------
| setting up FilterDialog for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { DateRange } from 'react-day-picker';
import { Calendar as CalendarIcon } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

export type FilterPayload = { type: 'month'; value: { start: string; end: string } } | { type: 'range'; value: { start: string; end: string } };

interface FilterDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onApplyFilter: (filter: FilterPayload) => void;
  onClearFilter: () => void;
  initialFilter?: FilterPayload;
}

const FilterDialog: React.FC<FilterDialogProps> = ({ isOpen, onOpenChange, onApplyFilter, onClearFilter, initialFilter }) => {
  const [activeTab, setActiveTab] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>();

  useEffect(() => {
    if (isOpen) {
      if (initialFilter) {
        if (initialFilter.type === 'month') {
          setActiveTab('month');
          setSelectedMonth(format(new Date(initialFilter.value.start), 'yyyy-MM'));
          setDateRange(undefined);
        } else if (initialFilter.type === 'range') {
          setActiveTab('range');
          setDateRange({
            from: new Date(initialFilter.value.start),
            to: new Date(initialFilter.value.end),
          });
          setSelectedMonth('');
        }
      } else {
        setSelectedMonth('');
        setDateRange(undefined);
      }
      setTempDateRange(dateRange);
    }
  }, [initialFilter, isOpen, dateRange]);

  useEffect(() => {
    if (isCalendarOpen) {
      setTempDateRange(dateRange);
    }
  }, [isCalendarOpen, dateRange]);

  const monthOptions = useMemo(() => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = subMonths(now, i);
      options.push({
        label: format(date, 'MMMM yyyy'),
        value: format(date, 'yyyy-MM'),
      });
    }
    return options;
  }, []);

  const handleApply = () => {
    if (activeTab === 'month' && selectedMonth) {
      const monthDate = new Date(selectedMonth);
      const startDate = startOfMonth(monthDate);
      const endDate = endOfMonth(monthDate);
      onApplyFilter({
        type: 'month',
        value: {
          start: format(startDate, 'yyyy-MM-dd'),
          end: format(endDate, 'yyyy-MM-dd'),
        },
      });
    } else if (activeTab === 'range' && dateRange?.from && dateRange?.to) {
      onApplyFilter({
        type: 'range',
        value: {
          start: format(dateRange.from, 'yyyy-MM-dd'),
          end: format(dateRange.to, 'yyyy-MM-dd'),
        },
      });
    }
    onOpenChange(false);
  };

  const handleClear = () => {
    onClearFilter();
    setSelectedMonth('');
    setDateRange(undefined);
    setTempDateRange(undefined);
    onOpenChange(false);
  };

  const handleCalendarUpdate = () => {
    setDateRange(tempDateRange);
    setIsCalendarOpen(false);
  };

  const handleCalendarClose = () => {
    setTempDateRange(dateRange);
    setIsCalendarOpen(false);
  };

  const isApplyDisabled = (activeTab === 'month' && !selectedMonth) || (activeTab === 'range' && (!dateRange?.from || !dateRange?.to));
  const isCalendarUpdateDisabled = !tempDateRange?.from || !tempDateRange?.to;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-xl transition-all text-white">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-white bg-clip-text bg-linear-to-r from-white to-blue-200">Filter Verifications</DialogTitle>
            <DialogDescription className="text-white/70">Select a filter option to narrow down data.</DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-lg rounded-lg text-white border border-white/20">
              <TabsTrigger value="month" className="data-[state=active]:bg-white/20 data-[state=active]:shadow-none text-white">
                By Month
              </TabsTrigger>
              <TabsTrigger value="range" className="data-[state=active]:bg-white/20 data-[state=active]:shadow-none text-white">
                By Date Range
              </TabsTrigger>
            </TabsList>

            <TabsContent value="month" className="py-4">
              <div className="grid gap-2">
                <Label htmlFor="month-select" className="text-white">
                  Select Month
                </Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger id="month-select" className="text-white border border-white/20 bg-white/5">
                    <SelectValue placeholder="Choose a month" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/20 backdrop-blur-xl text-white border border-white/20">
                    {monthOptions.map(option => (
                      <SelectItem key={option.value} value={option.value} className="focus:bg-white/30">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="range" className="py-4">
              <div className="grid gap-2">
                <Label className="text-white">Select Date Range</Label>
                <Button
                  id="date"
                  variant="outlineGarden"
                  className={cn('w-full justify-start text-left font-normal backdrop-blur-lg border-white/20 text-white bg-white/5', {
                    'text-white/60': !dateRange?.from && !dateRange?.to,
                  })}
                  onClick={() => setIsCalendarOpen(true)}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(dateRange.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-2 gap-2">
            <Button variant="outlineFire" onClick={handleClear}>
              Clear Filter
            </Button>
            <Button variant="outlineGarden" disabled={isApplyDisabled} onClick={handleApply}>
              Apply Filter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCalendarOpen} onOpenChange={handleCalendarClose}>
        <DialogContent className="p-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-lg md:p-4 max-w-[608px] min-w-[608px] w-[608px] text-white">
          <DialogTitle className="text-white">Select Date Range</DialogTitle>
          <Calendar mode="range" selected={tempDateRange} onSelect={setTempDateRange} numberOfMonths={2} />

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outlineWater" size="sm" onClick={handleCalendarClose}>
              Close
            </Button>
            <Button variant="outlineGarden" size="sm" disabled={isCalendarUpdateDisabled} onClick={handleCalendarUpdate}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FilterDialog;
