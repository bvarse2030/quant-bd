/*
|-----------------------------------------
| setting up NumberInputFieldFloatCoreCode for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export const NumberInputFieldFloatCoreCode = `
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'

const NumberInputFieldFloat = () => {
    const min = 0
    const max = 100000
    const step = 0.01 

    const [quantity, setQuantity] = useState<number | undefined>(1.0) 

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value
        const parsedValue = parseFloat(rawValue) 

        if (isNaN(parsedValue) || rawValue.trim() === '') {
            setQuantity(undefined) 
        } else {
            let finalValue = parsedValue

            if (min !== undefined && finalValue < min) {
                finalValue = min
            }
            if (max !== undefined && finalValue > max) {
                finalValue = max
            }
            setQuantity(finalValue)
        }
    }

    const displayValue =
        quantity !== undefined && quantity !== null ? String(quantity) : ''

    return (
        <Input
            placeholder="Quantity"
            type="number"
            inputMode="decimal" 
            pattern="[0-9]*\.?[0-9]*" 
            value={displayValue}
            onChange={handleChange}
            onKeyDown={(e) => {
                if (
                    e.key === 'e' ||
                    (e.key === '-' &&
                        (displayValue.includes('-') ||
                            e.currentTarget.selectionStart !== 0))
                ) {
                    e.preventDefault()
                }
            }}
            min={min}
            max={max}
            step={step}
        />
    )
}

export default NumberInputFieldFloat
`;
