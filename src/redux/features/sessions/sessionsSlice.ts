/*
|-----------------------------------------
| setting up SessionsSlice for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { apiSlice } from '@/redux/api/apiSlice';

export const sessionsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getSessions: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/api/sessions/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypeSessions', id: 'LIST' }],
    }),
    getSessionsSummary: builder.query({
      query: ({ page, limit }) => {
        return `/api/sessions/v1/summary?page=${page || 1}&limit=${limit || 10}`;
      },
      providesTags: [{ type: 'tagTypeSessions', id: 'LIST' }],
    }),
    getSessionsById: builder.query({
      query: id => `/api/sessions/v1?id=${id}`,
    }),
    addSessions: builder.mutation({
      query: newSession => ({
        url: '/api/sessions/v1',
        method: 'POST',
        body: newSession,
      }),
      invalidatesTags: [{ type: 'tagTypeSessions' }],
    }),
    updateSessions: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/sessions/v1`,
        method: 'PUT',
        body: { id: id, ...data },
      }),
      invalidatesTags: [{ type: 'tagTypeSessions' }],
    }),
    deleteSessions: builder.mutation({
      query: ({ id }) => ({
        url: `/api/sessions/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: [{ type: 'tagTypeSessions' }],
    }),
    bulkUpdateSessions: builder.mutation({
      query: bulkData => ({
        url: `/api/sessions/v1?bulk=true`,
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeSessions' }],
    }),
    bulkDeleteSessions: builder.mutation({
      query: bulkData => ({
        url: `/api/sessions/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeSessions' }],
    }),
  }),
});

export const {
  useGetSessionsQuery,
  useGetSessionsSummaryQuery,
  useAddSessionsMutation,
  useUpdateSessionsMutation,
  useDeleteSessionsMutation,
  useBulkUpdateSessionsMutation,
  useBulkDeleteSessionsMutation,
  useGetSessionsByIdQuery,
} = sessionsApi;
