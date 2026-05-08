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

const TextareaFieldForDescription = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const [description, setDescription] = React.useState('');

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  return (
    <div className={cn('grid w-full gap-2', className)}>
      <Label htmlFor="description">Description</Label>
      <Textarea id="description" placeholder="Type your description here." value={description} onChange={handleDescriptionChange} />
    </div>
  );
};

export default TextareaFieldForDescription;
