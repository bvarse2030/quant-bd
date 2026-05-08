/*
|-----------------------------------------
| setting up NumberInputFieldInteger for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import React, { useState } from 'react';

import { Input } from '@/components/ui/input';

const NumberInputFieldInteger = () => {
  const min = 0;
  const max = 100000;
  const [quantity, setQuantity] = useState<number | undefined>(1);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const parsedValue = parseInt(rawValue, 10);

    if (isNaN(parsedValue) || rawValue.trim() === '') {
      setQuantity?.(undefined);
    } else {
      let finalValue = parsedValue;

      if (min !== undefined && finalValue < min) {
        finalValue = min;
      }
      if (max !== undefined && finalValue > max) {
        finalValue = max;
      }

      setQuantity?.(finalValue);
    }
  };

  const displayValue = quantity !== undefined && quantity !== null ? String(Math.floor(quantity)) : '';
  return (
    <Input
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
      min={min}
      max={max}
    />
  );
};

export default NumberInputFieldInteger;
