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

const ColorPickerField = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const [color, setColor] = React.useState('#563d7c');

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Label htmlFor="color-picker">
        <div className="mb-2 flex items-center">
          <Palette className="mr-2 h-4 w-4" />
          <span>Pick a Color</span>
        </div>
      </Label>
      <div className="flex items-center gap-2">
        <Input id="color-picker" type="color" value={color} onChange={handleColorChange} className="h-10 w-14 cursor-pointer p-1" />
        <Input type="text" value={color} onChange={handleColorChange} className="w-32" placeholder="#000000" />
      </div>
    </div>
  );
};

export default ColorPickerField;
