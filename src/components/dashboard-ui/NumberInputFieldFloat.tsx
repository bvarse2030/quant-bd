/*
|-----------------------------------------
| setting up NumberInputFieldFloat for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import React from 'react';
import { Input } from '@/components/ui/input';

const NumberInputFieldFloat = ({ id, value, onChange }: { id: string; value: number; onChange: (value: number) => void }) => {
  const min = 0;
  const max = 100000;
  const step = 0.01;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const parsedValue = parseFloat(rawValue);

    if (isNaN(parsedValue) || rawValue.trim() === '') {
      onChange(1.0);
    } else {
      let finalValue = parsedValue;

      if (min !== undefined && finalValue < min) {
        finalValue = min;
      }
      if (max !== undefined && finalValue > max) {
        finalValue = max;
      }
      onChange(finalValue);
    }
  };

  const displayValue = value !== undefined && value !== null ? String(value) : '';

  return (
    <Input
      id={id}
      placeholder="Quantity"
      type="number"
      inputMode="decimal"
      pattern="[0-9]*\.?[0-9]*"
      value={displayValue}
      onChange={handleChange}
      onKeyDown={e => {
        if (e.key === 'e' || (e.key === '-' && (displayValue.includes('-') || e.currentTarget.selectionStart !== 0))) {
          e.preventDefault();
        }
      }}
      className="text-white placeholder:text-white/50"
      min={min}
      max={max}
      step={step}
    />
  );
};

export default NumberInputFieldFloat;
