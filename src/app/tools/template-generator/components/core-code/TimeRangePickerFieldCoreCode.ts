/*
|-----------------------------------------
| setting up TimeRangePickerFieldCoreCode for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export const TimeRangePickerFieldCoreCode = `
'use client'


import * as React from 'react'
import { Clock } from 'lucide-react'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const TimeRangePickerField = ({
    className,
}: React.HTMLAttributes<HTMLDivElement>) => {
    const [startTime, setStartTime] = React.useState('09:00')
    const [endTime, setEndTime] = React.useState('17:00')

    const handleStartTimeChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setStartTime(event.target.value)
    }

    const handleEndTimeChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setEndTime(event.target.value)
    }

    return (
        <div className={cn('grid gap-2', className)}>
            <Label>
                <div className="mb-2 flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Time Range</span>
                </div>
                <div className="flex items-center gap-2">
                    <Input
                        type="time"
                        value={startTime}
                        onChange={handleStartTimeChange}
                        className="w-full"
                    />
                    <span>-</span>
                    <Input
                        type="time"
                        value={endTime}
                        onChange={handleEndTimeChange}
                        className="w-full"
                    />
                </div>
            </Label>
        </div>
    )
}

export default TimeRangePickerField
`;
