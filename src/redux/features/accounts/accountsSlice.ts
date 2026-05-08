/*
|-----------------------------------------
| setting up AccountsSlice for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { apiSlice } from '@/redux/api/apiSlice';

export const accountsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getAccounts: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/api/accounts/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypeAccounts', id: 'LIST' }],
    }),
    getAccountsSummary: builder.query({
      query: ({ page, limit }) => {
        return `/api/accounts/v1/summary?page=${page || 1}&limit=${limit || 10}`;
      },
      providesTags: [{ type: 'tagTypeAccounts', id: 'LIST' }],
    }),
    getAccountsById: builder.query({
      query: id => `/api/accounts/v1?id=${id}`,
    }),
    addAccounts: builder.mutation({
      query: newAccount => ({
        url: '/api/accounts/v1',
        method: 'POST',
        body: newAccount,
      }),
      invalidatesTags: [{ type: 'tagTypeAccounts' }],
    }),
    updateAccounts: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/accounts/v1`,
        method: 'PUT',
        body: { id: id, ...data },
      }),
      invalidatesTags: [{ type: 'tagTypeAccounts' }],
    }),
    deleteAccounts: builder.mutation({
      query: ({ id }) => ({
        url: `/api/accounts/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: [{ type: 'tagTypeAccounts' }],
    }),
    bulkUpdateAccounts: builder.mutation({
      query: bulkData => ({
        url: `/api/accounts/v1?bulk=true`,
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeAccounts' }],
    }),
    bulkDeleteAccounts: builder.mutation({
      query: bulkData => ({
        url: `/api/accounts/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeAccounts' }],
    }),
  }),
});

export const {
  useGetAccountsQuery,
  useGetAccountsSummaryQuery,
  useAddAccountsMutation,
  useUpdateAccountsMutation,
  useDeleteAccountsMutation,
  useBulkUpdateAccountsMutation,
  useBulkDeleteAccountsMutation,
  useGetAccountsByIdQuery,
} = accountsApi;
