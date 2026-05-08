/*
|-----------------------------------------
| setting up UserSlice for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { apiSlice } from '@/redux/api/apiSlice';

export const usersApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUsers: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/api/user/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypeUser', id: 'LIST' }],
    }),
    getUsersSummary: builder.query({
      query: ({ page, limit }) => {
        return `/api/user/v1/summary?page=${page || 1}&limit=${limit || 10}`;
      },
      providesTags: [{ type: 'tagTypeUser', id: 'LIST' }],
    }),
    getUsersById: builder.query({
      query: id => `/api/user/v1?id=${id}`,
    }),
    addUsers: builder.mutation({
      query: newUser => ({
        url: '/api/user/v1',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: [{ type: 'tagTypeUser' }],
    }),
    updateUsers: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/user/v1`,
        method: 'PUT',
        body: { id: id, ...data },
      }),
      invalidatesTags: [{ type: 'tagTypeUser' }],
    }),
    deleteUsers: builder.mutation({
      query: ({ id }) => ({
        url: `/api/user/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: [{ type: 'tagTypeUser' }],
    }),
    bulkUpdateUsers: builder.mutation({
      query: bulkData => ({
        url: `/api/user/v1?bulk=true`,
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeUser' }],
    }),
    bulkDeleteUsers: builder.mutation({
      query: bulkData => ({
        url: `/api/user/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeUser' }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUsersSummaryQuery,
  useAddUsersMutation,
  useUpdateUsersMutation,
  useDeleteUsersMutation,
  useBulkUpdateUsersMutation,
  useBulkDeleteUsersMutation,
  useGetUsersByIdQuery,
} = usersApi;
