/*
|-----------------------------------------
| setting up PageBuilderSlice for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { apiSlice } from '@/redux/api/apiSlice';

export const pageBuilderApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getPages: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/api/page-builder/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypePageBuilder', id: 'LIST' }],
    }),
    getPageById: builder.query({
      query: id => `/api/page-builder/v1?id=${id}`,
      providesTags: (result, error, id) => [{ type: 'tagTypePageBuilder', id }],
    }),
    addPage: builder.mutation({
      query: newPage => ({
        url: '/api/page-builder/v1',
        method: 'POST',
        body: newPage,
      }),
      invalidatesTags: [{ type: 'tagTypePageBuilder', id: 'LIST' }],
    }),
    updatePage: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/page-builder/v1`,
        method: 'PUT',
        body: { id, ...data },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'tagTypePageBuilder', id },
        { type: 'tagTypePageBuilder', id: 'LIST' },
      ],
    }),
    deletePage: builder.mutation({
      query: ({ id }) => ({
        url: `/api/page-builder/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'tagTypePageBuilder', id },
        { type: 'tagTypePageBuilder', id: 'LIST' },
      ],
    }),
    bulkUpdatePages: builder.mutation({
      query: bulkData => ({
        url: `/api/page-builder/v1?bulk=true`,
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypePageBuilder', id: 'LIST' }],
    }),
    bulkDeletePages: builder.mutation({
      query: bulkData => ({
        url: `/api/page-builder/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypePageBuilder', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetPagesQuery,
  useGetPageByIdQuery,
  useAddPageMutation,
  useUpdatePageMutation,
  useDeletePageMutation,
  useBulkUpdatePagesMutation,
  useBulkDeletePagesMutation,
} = pageBuilderApi;
