/*
|-----------------------------------------
| setting up DynamicDataSelect for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { useState, useEffect } from 'react';

import MultiSelect from './MultiSelect';

interface DataSelectProps {
  newItemTags: string[];
  setNewItemTags: (payload: string[]) => void;
  label?: string;
  placeholder?: string;
}

export default function DynamicDataSelect({ newItemTags, setNewItemTags, label, placeholder }: DataSelectProps) {
  const [currentSelection, setCurrentSelection] = useState<string[]>(newItemTags);

  useEffect(() => {
    if (JSON.stringify(newItemTags) !== JSON.stringify(currentSelection)) {
      setCurrentSelection(newItemTags);
    }
  }, [newItemTags, currentSelection]);

  const handleSelectionChange = (newSelectionFromMultiSelect: string[]) => {
    if (JSON.stringify(newSelectionFromMultiSelect) !== JSON.stringify(currentSelection)) {
      setCurrentSelection(newSelectionFromMultiSelect);
      setNewItemTags(newSelectionFromMultiSelect);
    }
  };

  return (
    <div className="w-full">
      <form id="dynamic-data-select-form" className="space-y-4">
        <MultiSelect
          label={label}
          placeholder={placeholder || 'Select options...'}
          defaultSelected={currentSelection}
          onSelectionChange={handleSelectionChange}
        />
      </form>
    </div>
  );
}
