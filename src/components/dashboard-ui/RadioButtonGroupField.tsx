/*
|-----------------------------------------
| setting up RadioButtonGroupField for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioButtonGroupFieldProps {
  value: string | undefined;
  onChange: (value: string) => void;
  options?: RadioOption[];
  label?: string;
  className?: string;
}

export function RadioButtonGroupField({
  value,
  onChange,
  options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ],
  label,
  className,
}: RadioButtonGroupFieldProps) {
  let updateOptions: RadioOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ];
  if (options?.length > 0) {
    updateOptions = options;
  }
  return (
    <fieldset className={cn('grid w-full items-center gap-2.5', className)}>
      {label && <legend className="text-sm font-medium leading-none">{label}</legend>}
      <RadioGroup value={value} onValueChange={onChange} className="flex flex-col gap-2">
        {updateOptions.map(option => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`radio-option-${option.value}`} />
            <Label htmlFor={`radio-option-${option.value}`}>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </fieldset>
  );
}

RadioButtonGroupField.displayName = 'RadioButtonGroupField';
