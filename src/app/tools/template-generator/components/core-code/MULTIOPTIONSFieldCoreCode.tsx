/*
|-----------------------------------------
| setting up MULTIOPTIONSFieldCoreCode for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export const MULTIOPTIONSFieldCoreCode = `
'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { XIcon, PlusCircleIcon } from 'lucide-react'

const MULTIOPTIONSField: React.FC = () => {
    const [allData, setAllData] = useState<string[]>([
        'Option 1',
        'Option 2',
        'Option 3',
        'Option 4',
        'Option 5',
        'Option 6',
    ])

    const [selectedData, setSelectedData] = useState<string[]>([])

    const [inputValue, setInputValue] = useState('')

    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const wrapperRef = useRef<HTMLDivElement>(null)
    const filteredSuggestions = useMemo(() => {
        if (!inputValue) {
            return allData.filter((item) => !selectedData.includes(item))
        }
        return allData.filter(
            (item) =>
                !selectedData.includes(item) &&
                item.toLowerCase().includes(inputValue.toLowerCase())
        )
    }, [inputValue, allData, selectedData])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [wrapperRef])

    const handleSelect = (item: string) => {
        setSelectedData((prevSelected) => [...prevSelected, item])
        setInputValue('')
        setIsDropdownOpen(false)
    }

    const handleRemove = (itemToRemove: string) => {
        setSelectedData((prevSelected) =>
            prevSelected.filter((item) => item !== itemToRemove)
        )
    }

    const handleAddNew = () => {
        const newItem = inputValue.trim()
        if (
            newItem &&
            !allData.find(
                (item) => item.toLowerCase() === newItem.toLowerCase()
            )
        ) {
            setAllData((prevAll) => [...prevAll, newItem])

            setSelectedData((prevSelected) => [...prevSelected, newItem])
            setInputValue('')
            setIsDropdownOpen(false)
        }
    }

    return (
        <div className="relative w-full max-w-lg" ref={wrapperRef}>
            <div className="flex flex-wrap items-center gap-2 p-2 border rounded-md bg-background min-h-[46px]">
                {selectedData.map((item) => (
                    <div
                        key={item}
                        className="flex items-center gap-1.5 bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm animate-in fade-in-0"
                    >
                        <span>{item}</span>
                        <button
                            onClick={() => handleRemove(item)}
                            className="rounded-full hover:bg-muted-foreground/20 transition-colors"
                            aria-label={\`Remove \${item}\`}
                        >
                            <XIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                <Input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder={
                        selectedData.length === 0 ? 'Search or add tags...' : ''
                    }
                />
            </div>

            {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-card border rounded-md shadow-lg animate-in fade-in-0 zoom-in-95">
                    <ul className="py-1 max-h-60 overflow-y-auto">
                        {filteredSuggestions.length > 0
                            ? filteredSuggestions.map((item) => (
                                  <li
                                      key={item}
                                      onClick={() => handleSelect(item)}
                                      className="px-3 py-2 text-sm cursor-pointer hover:bg-accent"
                                  >
                                      {item}
                                  </li>
                              ))
                            : inputValue.trim() && (
                                  <li className="px-3 py-2 text-sm">
                                      <button
                                          onClick={handleAddNew}
                                          className="flex items-center justify-between w-full text-left hover:text-primary transition-colors"
                                      >
                                          <span>Add "{inputValue}"</span>
                                          <PlusCircleIcon className="w-4 h-4 text-primary" />
                                      </button>
                                  </li>
                              )}
                        {filteredSuggestions.length === 0 &&
                            !inputValue.trim() && (
                                <li className="px-3 py-2 text-sm text-center text-muted-foreground">
                                    No more options available.
                                </li>
                            )}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default MULTIOPTIONSField
`;
