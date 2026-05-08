/*
|-----------------------------------------
| setting up SidebarsSlice for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { apiSlice } from '@/redux/api/apiSlice';

export const sidebarsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getSidebars: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/api/sidebars/v1?page=${page || 1}&limit=${limit || 100}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypeSidebars', id: 'LIST' }],
    }),
    getSidebarById: builder.query({
      query: id => `/api/sidebars/v1?id=${id}`,
    }),
    addSidebar: builder.mutation({
      query: newSidebar => ({
        url: '/api/sidebars/v1',
        method: 'POST',
        body: newSidebar,
      }),
      invalidatesTags: [{ type: 'tagTypeSidebars' }],
    }),
    updateSidebar: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/sidebars/v1`,
        method: 'PUT',
        body: { id, ...data },
      }),
      invalidatesTags: [{ type: 'tagTypeSidebars' }],
    }),
    deleteSidebar: builder.mutation({
      query: ({ id }) => ({
        url: `/api/sidebars/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: [{ type: 'tagTypeSidebars' }],
    }),
    bulkUpdateSidebars: builder.mutation({
      query: bulkData => ({
        url: `/api/sidebars/v1?bulk=true`,
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeSidebars' }],
    }),
    bulkDeleteSidebars: builder.mutation({
      query: bulkData => ({
        url: `/api/sidebars/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeSidebars' }],
    }),
  }),
});

export const {
  useGetSidebarsQuery,
  useAddSidebarMutation,
  useUpdateSidebarMutation,
  useDeleteSidebarMutation,
  useBulkUpdateSidebarsMutation,
  useBulkDeleteSidebarsMutation,
  useGetSidebarByIdQuery,
} = sidebarsApi;
