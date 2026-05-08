/*
|-----------------------------------------
| setting up ColorPickerField for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import * as React from 'react';
import { Palette } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ColorPickerField = ({
  id = Math.random().toString(36).substring(2),
  value,
  onChange,
  className,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) => {
  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div id={id} className={cn('grid gap-2', className)}>
      <Label htmlFor="color-picker">
        <div className="mb-2 flex items-center">
          <Palette className="mr-2 h-4 w-4" />
          <span>Pick a Color</span>
        </div>
      </Label>
      <div className="flex items-center gap-2">
        <Input id="color-picker" type="color" value={value || '#563d7c'} onChange={handleColorChange} className="h-10 w-14 cursor-pointer p-1" />
        <Input type="text" value={value || '#563d7c'} onChange={handleColorChange} className="w-32" placeholder="#000000" />
      </div>
    </div>
  );
};

export default ColorPickerField;
