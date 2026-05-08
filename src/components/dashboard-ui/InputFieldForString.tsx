/*
|-----------------------------------------
| setting up InputFieldForString for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { Input } from '@/components/ui/input';

const InputFieldForString = ({
  id,
  value,
  onChange,
  placeholder = 'Please write...',
  className,
}: {
  id: string;
  value: string;
  onChange: (e: string) => void;
  className?: string;
  placeholder?: string;
}) => {
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange(value);
  };
  return <Input id={id} value={value || ''} onChange={handleValueChange} placeholder={placeholder} className={className} />;
};
export default InputFieldForString;
