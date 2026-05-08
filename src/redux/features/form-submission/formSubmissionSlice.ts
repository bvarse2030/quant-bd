/*
|-----------------------------------------
| setting up FormSubmissionSlice for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { apiSlice } from '@/redux/api/apiSlice';

export const formSubmissionApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getFormSubmissions: builder.query({
      query: ({ page, limit, q, pathTitle }) => {
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        if (q) params.append('q', q);
        if (pathTitle) params.append('pathTitle', pathTitle);

        return `/api/form-submission/v1?${params.toString()}`;
      },
      providesTags: [{ type: 'tagTypeFormSubmission', id: 'LIST' }],
    }),
    getFormSubmissionById: builder.query({
      query: id => `/api/form-submission/v1?id=${id}`,
      providesTags: (result, error, id) => [{ type: 'tagTypeFormSubmission', id }],
    }),
    addFormSubmission: builder.mutation({
      query: newSubmission => ({
        url: '/api/form-submission/v1',
        method: 'POST',
        body: newSubmission,
      }),
      invalidatesTags: [{ type: 'tagTypeFormSubmission', id: 'LIST' }],
    }),
    updateFormSubmission: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/form-submission/v1`,
        method: 'PUT',
        body: { id, ...data },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'tagTypeFormSubmission', id },
        { type: 'tagTypeFormSubmission', id: 'LIST' },
      ],
    }),
    deleteFormSubmission: builder.mutation({
      query: ({ id }) => ({
        url: `/api/form-submission/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'tagTypeFormSubmission', id },
        { type: 'tagTypeFormSubmission', id: 'LIST' },
      ],
    }),
    bulkDeleteFormSubmissions: builder.mutation({
      query: bulkData => ({
        url: `/api/form-submission/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeFormSubmission', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetFormSubmissionsQuery,
  useGetFormSubmissionByIdQuery,
  useAddFormSubmissionMutation,
  useUpdateFormSubmissionMutation,
  useDeleteFormSubmissionMutation,
  useBulkDeleteFormSubmissionsMutation,
} = formSubmissionApi;
