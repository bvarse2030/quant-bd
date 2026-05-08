/*
|-----------------------------------------
| setting up RadioButtonGroupFieldCoreCode for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/


export const RadioButtonGroupFieldCoreCode = `

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export function RadioButtonGroupField() {
    return (
        <RadioGroup defaultValue="comfortable">
        {['Choice A', 'Choice B', 'Choice C'].map((item) => (
            <div className="flex items-center gap-3" key={item}>
                <RadioGroupItem value={item.toLowerCase()} id={\`r\${item}\`} />
                <Label htmlFor={\`r\${item}\`}>{item}</Label>
            </div>
        ))}
        </RadioGroup>
    )
}
`
