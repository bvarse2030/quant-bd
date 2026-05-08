import { apiSlice } from '@/redux/api/apiSlice';

export interface PaymentRecord {
  key: string;
  value: string;
}

export interface DashboardEditorItem {
  _id: string;
  Name: string;
  Roll: number;
  class: number;
  subject: string[];
  payment: PaymentRecord[];
  createdAt?: string;
}

export const dashboardEditorApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getDashboardEditors: builder.query<DashboardEditorItem[], void>({
      query: () => '/tools/dashboard-builder/api/dashboard-editor/v1',
      providesTags: result =>
        result
          ? [...result.map(({ _id }) => ({ type: 'DashboardEditor' as const, id: _id })), { type: 'DashboardEditor', id: 'LIST' }]
          : [{ type: 'DashboardEditor', id: 'LIST' }],
    }),
    addDashboardEditor: builder.mutation<DashboardEditorItem, Partial<DashboardEditorItem>>({
      query: newRecord => ({
        url: '/tools/dashboard-builder/api/dashboard-editor/v1',
        method: 'POST',
        body: newRecord,
      }),
      invalidatesTags: [{ type: 'DashboardEditor', id: 'LIST' }],
    }),
    updateDashboardEditor: builder.mutation<DashboardEditorItem, Partial<DashboardEditorItem>>({
      query: ({ _id, ...data }) => ({
        url: '/tools/dashboard-builder/api/dashboard-editor/v1',
        method: 'PUT',
        body: { _id, ...data },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'DashboardEditor', id: arg._id },
        { type: 'DashboardEditor', id: 'LIST' },
      ],
    }),
    deleteDashboardEditor: builder.mutation<{ success: boolean; id: string }, string>({
      query: id => ({
        url: `/tools/dashboard-builder/api/dashboard-editor/v1?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'DashboardEditor', id },
        { type: 'DashboardEditor', id: 'LIST' },
      ],
    }),
  }),
});

export const { useGetDashboardEditorsQuery, useAddDashboardEditorMutation, useUpdateDashboardEditorMutation, useDeleteDashboardEditorMutation } =
  dashboardEditorApi;
