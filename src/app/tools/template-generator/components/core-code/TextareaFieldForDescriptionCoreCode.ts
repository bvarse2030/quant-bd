/*
|-----------------------------------------
| setting up TextareaFieldForDescriptionCoreCode for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export const TextareaFieldForDescriptionCoreCode = `
'use client'


import * as React from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const TextareaFieldForDescription = ({
    className,
}: React.HTMLAttributes<HTMLDivElement>) => {
    const [description, setDescription] = React.useState('')

    const handleDescriptionChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setDescription(e.target.value)
    }

    return (
        <div className={cn('grid w-full gap-2', className)}>
            <Label htmlFor="description">Description</Label>
            <Textarea
                id="description"
                placeholder="Type your description here."
                value={description}
                onChange={handleDescriptionChange}
            />
        </div>
    )
}

export default TextareaFieldForDescription
`;
