/*
|-----------------------------------------
| setting up InputFieldForEmail for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { Input } from '@/components/ui/input';

const InputFieldForEmail = ({
  id,
  value,
  onChange,
  placeholder = 'Email',
  className,
  readonly = false,
}: {
  id: string;
  value: string;
  className?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readonly?: boolean;
}) => {
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange(value);
  };
  return <Input readOnly={readonly} id={id} value={value || ''} onChange={handlePasswordChange} placeholder={placeholder} className={className} />;
};
export default InputFieldForEmail;
