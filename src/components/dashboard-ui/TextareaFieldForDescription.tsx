/*
|-----------------------------------------
| setting up TextareaFieldForDescription for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const TextareaFieldForDescription = ({
  id,
  value,
  className,
  onChange,
}: {
  id: string;
  value: string;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) => {
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e);
  };

  return (
    <div id={id} className={cn('grid w-full gap-2', className)}>
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        placeholder="Type your description here."
        value={value}
        onChange={handleDescriptionChange}
        className="text-white placeholder:text-white/50"
      />
    </div>
  );
};

export default TextareaFieldForDescription;
