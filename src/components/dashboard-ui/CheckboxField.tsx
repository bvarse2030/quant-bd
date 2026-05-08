/*
|-----------------------------------------
| setting up CheckboxField for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export interface CheckboxFieldProps {
  id?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: React.ReactNode;
  className?: string;
}

export function CheckboxField({ id = Math.random().toString(), checked, onCheckedChange, label, className }: CheckboxFieldProps) {
  if (label) {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
        <Label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </Label>
      </div>
    );
  } else {
    return (
      <div className={cn('flex justify-end items-center space-x-2', className)}>
        <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
      </div>
    );
  }
}

CheckboxField.displayName = 'CheckboxField';
