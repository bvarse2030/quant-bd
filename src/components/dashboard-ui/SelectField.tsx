/*
|-----------------------------------------
| setting up SelectField for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import * as React from 'react';

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SelectFieldProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  options?: { label: string; value: string }[];
}

export function SelectField({
  value,
  onValueChange,
  placeholder = 'Select an option',
  options = [
    { label: 'Option 1', value: 'Option 1' },
    { label: 'Option 2', value: 'Option 2' },
  ],
}: SelectFieldProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className="
          w-full rounded-lg bg-white/10 backdrop-blur-lg text-white
          border border-white/20 shadow-sm transition-all
          focus:ring-2 focus:ring-purple-400/50
          hover:border-purple-400/50 hover:bg-white/20
        "
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent
        className="
          bg-white/10 backdrop-blur-xl text-white
          border border-white/20 shadow-xl rounded-lg
        "
      >
        <SelectGroup>
          <SelectLabel className="text-purple-200/80">Options</SelectLabel>

          {options.map(item => (
            <SelectItem
              key={item.value}
              value={item.value}
              className="
                text-white cursor-pointer
                hover:bg-purple-500/30 hover:text-purple-100
                focus:bg-purple-500/40 focus:text-purple-50
              "
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
