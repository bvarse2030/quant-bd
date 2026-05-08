/*
|-----------------------------------------
| setting up FooterSlice for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { apiSlice } from '@/redux/api/apiSlice';

export interface DisabledPath {
  path: string;
  isExcluded: boolean;
}

export interface FooterItem {
  _id: string;
  name: string;
  disabledPaths: DisabledPath[];
  isEnabled: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  createdAt?: string;
}

export const footerApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getFooters: builder.query<FooterItem[], void>({
      query: () => '/api/footer-settings/v1',
      providesTags: result =>
        result ? [...result.map(({ _id }) => ({ type: 'Footer' as const, id: _id })), { type: 'Footer', id: 'LIST' }] : [{ type: 'Footer', id: 'LIST' }],
    }),
    addFooter: builder.mutation<FooterItem, Partial<FooterItem>>({
      query: newFooter => ({
        url: '/api/footer-settings/v1',
        method: 'POST',
        body: newFooter,
      }),
      invalidatesTags: [{ type: 'Footer', id: 'LIST' }],
    }),
    updateFooter: builder.mutation<FooterItem, Partial<FooterItem>>({
      query: ({ _id, ...data }) => ({
        url: '/api/footer-settings/v1',
        method: 'PUT',
        body: { _id, ...data },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Footer', id: arg._id },
        { type: 'Footer', id: 'LIST' },
      ],
    }),
    deleteFooter: builder.mutation<{ success: boolean; id: string }, string>({
      query: id => ({
        url: `/api/footer-settings/v1?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Footer', id },
        { type: 'Footer', id: 'LIST' },
      ],
    }),
  }),
});

export const { useGetFootersQuery, useAddFooterMutation, useUpdateFooterMutation, useDeleteFooterMutation } = footerApi;
