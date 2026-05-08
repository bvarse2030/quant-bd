/*
|-----------------------------------------
| setting up ApiSlice for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  tagTypes: [
    'tagTypeUser',
    'tagTypeRoles',
    'tagTypeAccessManagements',
    'tagTypeAccounts',
    'tagTypeVerifications',
    'tagTypeSessions',
    'FooterSettings',
    'tagTypeSidebars',
    'tagTypeProfile',
    'tagTypePageBuilder',
    'Footer',
    'tagTypeFormSubmission',
    'DashboardEditor',
    'tagTypeMedia',
  ],
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NODE_ENV === 'production' ? process.env.baseLiveURL : process.env.baseLocalURL,
    credentials: 'include',
    prepareHeaders: async (headers, {}) => {
      const localStorageToken = localStorage.getItem('token')?.replaceAll('"', '');
      const finalToken = localStorageToken;
      if (finalToken) {
        headers.set('authorization', `Bearer ${finalToken}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});
