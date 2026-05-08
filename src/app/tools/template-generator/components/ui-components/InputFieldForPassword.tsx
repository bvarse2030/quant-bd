/*
|-----------------------------------------
| setting up InputFieldForPassword for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { Input } from '@/components/ui/input';

const InputFieldForPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (value.length > 0 && (value.length < 6 || value.length > 12)) {
      setError('Password must be between 6 and 12 characters.');
    } else {
      setError('');
    }
  };

  return (
    <div>
      <div className="relative">
        <Input
          placeholder="********"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={handlePasswordChange}
          maxLength={12}
          minLength={6}
          className={`pr-10 ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
        <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3" onClick={togglePasswordVisibility}>
          {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
        </div>
      </div>
      {error && (
        <div className="mt-2 rounded-md bg-red-100 p-3 text-sm text-red-700">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default InputFieldForPassword;
