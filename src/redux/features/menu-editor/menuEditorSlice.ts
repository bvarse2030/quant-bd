/*
|-----------------------------------------
| setting up MenuEditorSlice for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface IMenuItem {
  id: number;
  name: string;
  path: string;
  iconName?: string;
  children?: IMenuItem[];
}

export interface IMenuResponse {
  data: {
    _id: string;
    type: string;
    items: IMenuItem[];
    createdAt: string;
    updatedAt: string;
  };
  message: string;
  status: number;
}

export const menuEditorApi = createApi({
  reducerPath: 'menuEditorApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/menu-editor' }),
  tagTypes: ['Menu'],
  endpoints: builder => ({
    getMenu: builder.query<IMenuResponse, string>({
      query: type => `?type=${type}`,
      providesTags: (result, error, type) => [{ type: 'Menu', id: type }],
    }),
    updateMenu: builder.mutation<IMenuResponse, { type: string; items: IMenuItem[] }>({
      query: body => ({
        url: '',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { type }) => [{ type: 'Menu', id: type }],
    }),
  }),
});

export const { useGetMenuQuery, useUpdateMenuMutation } = menuEditorApi;
