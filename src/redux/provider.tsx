/*
|-----------------------------------------
| setting up Provider for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';

import { store } from '@/redux/app/store';

export function ReduxProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
