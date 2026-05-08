/*
|-----------------------------------------
| setting up GenerateDataSelect for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export const generateDataSelectComponentFile = (): string => {
  return `'use client'

import { useState, useEffect } from 'react'

import MultiSelect from './MultiSelect'

interface DataSelectProps {
    newItemTags: string[]
    setNewItemTags: (payload: string[]) => void
    label?: string
    placeholder?: string
}

export default function DataSelect({
    newItemTags,
    setNewItemTags,
    label = 'Select Tags',
    placeholder = 'Choose tags for your item',
}: DataSelectProps) {
    const [currentSelection, setCurrentSelection] =
        useState<string[]>(newItemTags)

    useEffect(() => {
        // This effect syncs the internal state with the parent's state
        // if the prop changes from the outside.
        if (JSON.stringify(newItemTags) !== JSON.stringify(currentSelection)) {
            setCurrentSelection(newItemTags)
        }
    }, [newItemTags, currentSelection])

    const handleSelectionChange = (newSelectionFromMultiSelect: string[]) => {
        // This function handles changes from the MultiSelect component
        // and propagates them up to the parent component.
        if (
            JSON.stringify(newSelectionFromMultiSelect) !==
            JSON.stringify(currentSelection)
        ) {
            setCurrentSelection(newSelectionFromMultiSelect)
            setNewItemTags(newSelectionFromMultiSelect)
        } else {
            // Fallback for cases where object references differ but content is the same
            if (newSelectionFromMultiSelect !== currentSelection) {
                setCurrentSelection(newSelectionFromMultiSelect)
            }
        }
    }
    
    return (
        <div className="w-full">
            <form id="data-select-form" className="space-y-4">
                <MultiSelect
                    label={label}
                    placeholder={placeholder || 'Select options'}
                    defaultSelected={currentSelection}
                    onSelectionChange={handleSelectionChange}
                />
            </form>
        </div>
    )
}
`;
};
