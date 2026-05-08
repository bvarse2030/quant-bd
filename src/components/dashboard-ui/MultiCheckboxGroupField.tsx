/*
|-----------------------------------------
| setting up MultiCheckboxGroupField for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import * as React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface CheckboxOption {
  value: string;
  label: string;
}

export interface MultiCheckboxGroupFieldProps {
  value: string[] | undefined;
  onChange: (newValue: string[]) => void;
  options?: CheckboxOption[];
  label?: string;
  className?: string;
}

export default function MultiCheckboxGroupField({ value, onChange, options = [], label, className }: MultiCheckboxGroupFieldProps) {
  const handleCheckboxChange = (itemValue: string, isChecked: boolean) => {
    const currentValue = value ?? [];

    if (isChecked) {
      onChange([...new Set([...currentValue, itemValue])]);
    } else {
      onChange(currentValue.filter(v => v !== itemValue));
    }
  };

  let updateCheckboxOptions: CheckboxOption[] = [
    { label: 'Book 1', value: 'book1' },
    { label: 'Book 2', value: 'book2' },
    { label: 'Book 3', value: 'book3' },
  ];
  if (options?.length > 0) {
    updateCheckboxOptions = options;
  }

  return (
    <fieldset className={cn('grid w-full gap-2.5', className)}>
      {label && <legend className="text-sm font-medium leading-none mb-1">{label}</legend>}

      <div className="flex flex-col gap-2">
        {updateCheckboxOptions.map(option => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={`checkbox-${option.value}`}
              checked={value?.includes(option.value) ?? false}
              onCheckedChange={isChecked => {
                handleCheckboxChange(option.value, isChecked as boolean);
              }}
            />
            <Label htmlFor={`checkbox-${option.value}`}>{option.label}</Label>
          </div>
        ))}
      </div>
    </fieldset>
  );
}

MultiCheckboxGroupField.displayName = 'MultiCheckboxGroupField';
