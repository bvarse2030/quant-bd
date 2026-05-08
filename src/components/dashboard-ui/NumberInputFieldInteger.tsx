/*
|-----------------------------------------
| setting up NumberInputFieldInteger for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import React from 'react';
import { Input } from '@/components/ui/input';

const NumberInputFieldInteger = ({
  id = Math.random().toString(36).substring(2),
  value,
  onChange,
}: {
  id?: string;
  value: number;
  onChange: (value: number) => void;
}) => {
  const min = 0;
  const max = 100000;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const parsedValue = parseInt(rawValue, 10);

    if (isNaN(parsedValue) || rawValue.trim() === '') {
      onChange?.(1);
    } else {
      let finalValue = parsedValue;

      if (min !== undefined && finalValue < min) {
        finalValue = min;
      }
      if (max !== undefined && finalValue > max) {
        finalValue = max;
      }

      onChange?.(finalValue);
    }
  };

  const displayValue = value !== undefined && value !== null ? String(Math.floor(value)) : '';
  return (
    <Input
      id={id}
      placeholder="Quantity"
      type="number"
      inputMode="numeric"
      pattern="[0-9]*"
      value={displayValue}
      onChange={handleChange}
      onKeyDown={e => {
        if (e.key === '.' || e.key === 'e' || e.key === '-') {
          e.preventDefault();
        }
      }}
      className="text-white placeholder:text-white/50"
      min={min}
      max={max}
    />
  );
};

export default NumberInputFieldInteger;
