/*
|-----------------------------------------
| setting up MediaSlice for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { apiSlice } from '@/redux/api/apiSlice';

export const mediaApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getMedias: builder.query({
      query: ({ page, limit, q, contentType, status }) => {
        let url = `/api/media/v1?page=${page || 1}&limit=${limit || 10}&status=${status || 'active'}`;
        if (q) url += `&q=${encodeURIComponent(q)}`;
        if (contentType && contentType !== 'all') url += `&contentType=${contentType}`;
        return url;
      },
      providesTags: result =>
        result
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [...result.data.map(({ _id }: any) => ({ type: 'tagTypeMedia' as const, id: _id })), { type: 'tagTypeMedia', id: 'LIST' }]
          : [{ type: 'tagTypeMedia', id: 'LIST' }],
    }),
    addMedia: builder.mutation({
      query: newMedia => ({
        url: '/api/media/v1',
        method: 'POST',
        body: newMedia,
      }),
      invalidatesTags: [{ type: 'tagTypeMedia', id: 'LIST' }],
    }),
    updateMedia: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/media/v1`,
        method: 'PUT',
        body: { id, ...data },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'tagTypeMedia', id },
        { type: 'tagTypeMedia', id: 'LIST' },
      ],
    }),
    deleteMedia: builder.mutation({
      query: ({ id }) => ({
        url: `/api/media/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: [{ type: 'tagTypeMedia', id: 'LIST' }],
    }),
  }),
});

export const { useGetMediasQuery, useAddMediaMutation, useUpdateMediaMutation, useDeleteMediaMutation } = mediaApi;
