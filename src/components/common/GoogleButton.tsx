/*
|-----------------------------------------
| setting up GoogleButton for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import React from 'react';

import { Button } from '@/components/ui/button';

interface ContinueWithGoogleButtonProps {
  onClick?: () => void;
}

const ContinueWithGoogleButton: React.FC<ContinueWithGoogleButtonProps> = ({ onClick }) => {
  return (
    <Button onClick={onClick} variant="outlineGlassy" className="rounded-full overflow-hidden border border-slate-100/50 w-3/4">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="22" height="22">
        <path
          fill="#EA4335"
          d="M24 9.5c3.94 0 6.64 1.7 8.17 3.12l5.96-5.83C34.25 3.63 29.55 1.5 24 1.5 14.73 1.5 7.18 7.7 4.25 16.05l6.99 5.42C12.51 14.7 17.72 9.5 24 9.5z"
        />
        <path fill="#34A853" d="M46.15 24.5c0-1.62-.14-3.14-.4-4.5H24v9h12.65c-.57 2.9-2.28 5.36-4.83 7.04l7.45 5.78C43.26 37.32 46.15 31.44 46.15 24.5z" />
        <path
          fill="#4A90E2"
          d="M24 46.5c6.06 0 11.15-2 14.87-5.45l-7.45-5.78c-2.07 1.4-4.7 2.23-7.42 2.23-5.72 0-10.56-3.85-12.3-9.02l-7 5.4C7.11 40.53 14.85 46.5 24 46.5z"
        />
        <path fill="#FBBC05" d="M11.7 28.48c-.48-1.4-.75-2.9-.75-4.48s.27-3.08.75-4.48l-7-5.4C3.94 17.2 3 20.74 3 24s.94 6.8 2.7 9.88l6-4.4z" />
      </svg>
      Continue with Google
    </Button>
  );
};

export default ContinueWithGoogleButton;
