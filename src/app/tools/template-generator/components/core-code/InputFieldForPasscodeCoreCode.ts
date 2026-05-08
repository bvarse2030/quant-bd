/*
|-----------------------------------------
| setting up InputFieldForPasscodeCoreCode for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export const InputFieldForPasscodeCoreCode = `

import { Input } from '@/components/ui/input'

const InputFieldForPasscode = () => {
    return (
        <div>
            <small>Only number 4 digits allowed</small>
            <Input placeholder="********" type="password" />
        </div>
    )
}
export default InputFieldForPasscode
`;
