/*
|-----------------------------------------
| setting up PhoneInputField for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PhoneInputField = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const countryCode = '+880';

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    let numericValue = value.replace(/\D/g, '');

    if (numericValue.startsWith('0')) {
      numericValue = numericValue.substring(1);
    }
    setPhoneNumber(numericValue);
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Label htmlFor="phone">Phone Number</Label>
      <div className="relative flex items-center">
        <span className="absolute left-3 text-muted-foreground">{countryCode}</span>
        <Input id="phone" type="tel" placeholder="1711223344" value={phoneNumber} onChange={handlePhoneChange} className="pl-14" />
      </div>
    </div>
  );
};

export default PhoneInputField;
