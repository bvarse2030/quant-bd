/*
|-----------------------------------------
| setting up VerificationsSlice for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { apiSlice } from '@/redux/api/apiSlice';

export const verificationsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getVerifications: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/api/verifications/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypeVerifications', id: 'LIST' }],
    }),
    getVerificationsSummary: builder.query({
      query: ({ page, limit }) => {
        return `/api/verifications/v1/summary?page=${page || 1}&limit=${limit || 10}`;
      },
      providesTags: [{ type: 'tagTypeVerifications', id: 'LIST' }],
    }),
    getVerificationsById: builder.query({
      query: id => `/api/verifications/v1?id=${id}`,
    }),
    addVerifications: builder.mutation({
      query: newVerification => ({
        url: '/api/verifications/v1',
        method: 'POST',
        body: newVerification,
      }),
      invalidatesTags: [{ type: 'tagTypeVerifications' }],
    }),
    updateVerifications: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/verifications/v1`,
        method: 'PUT',
        body: { id: id, ...data },
      }),
      invalidatesTags: [{ type: 'tagTypeVerifications' }],
    }),
    deleteVerifications: builder.mutation({
      query: ({ id }) => ({
        url: `/api/verifications/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: [{ type: 'tagTypeVerifications' }],
    }),
    bulkUpdateVerifications: builder.mutation({
      query: bulkData => ({
        url: `/api/verifications/v1?bulk=true`,
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeVerifications' }],
    }),
    bulkDeleteVerifications: builder.mutation({
      query: bulkData => ({
        url: `/api/verifications/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeVerifications' }],
    }),
  }),
});

export const {
  useGetVerificationsQuery,
  useGetVerificationsSummaryQuery,
  useAddVerificationsMutation,
  useUpdateVerificationsMutation,
  useDeleteVerificationsMutation,
  useBulkUpdateVerificationsMutation,
  useBulkDeleteVerificationsMutation,
  useGetVerificationsByIdQuery,
} = verificationsApi;
