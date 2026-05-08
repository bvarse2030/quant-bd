/*
|-----------------------------------------
| setting up Store for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { create } from 'zustand';

import { queryParams } from './store-constant';
import { AccessManagementsStore } from './store-type';
import { IAccessManagements, defaultAccessManagements } from './data/data';

export const useAccessManagementsStore = create<AccessManagementsStore>(set => ({
  queryPramsLimit: queryParams.limit,
  queryPramsPage: queryParams.page,
  queryPramsQ: queryParams.q,
  accessManagements: [],
  selectedAccessManagements: null,
  newAccessManagements: defaultAccessManagements,
  isBulkEditModalOpen: false,
  isBulkDynamicUpdateModal: false,
  isBulkUpdateModalOpen: false,
  isBulkDeleteModalOpen: false,
  isAddModalOpen: false,
  isViewModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  bulkData: [],
  setQueryPramsLimit: (payload: number) => set({ queryPramsLimit: payload }),
  setQueryPramsPage: (payload: number) => set({ queryPramsPage: payload }),
  setQueryPramsQ: (payload: string) => set({ queryPramsQ: payload }),
  setBulkData: (bulkData: IAccessManagements[]) => set({ bulkData }),
  setAccessManagements: (accessManagements: IAccessManagements[]) => set({ accessManagements }),
  setSelectedAccessManagements: AccessManagements => set({ selectedAccessManagements: AccessManagements }),
  setNewAccessManagements: AccessManagements =>
    set(state => ({
      newAccessManagements: typeof AccessManagements === 'function' ? AccessManagements(state.newAccessManagements) : AccessManagements,
    })),
  toggleAddModal: data => set({ isAddModalOpen: data }),
  toggleViewModal: data => set({ isViewModalOpen: data }),
  toggleEditModal: data => set({ isEditModalOpen: data }),
  toggleDeleteModal: data => set({ isDeleteModalOpen: data }),
  toggleBulkEditModal: data => set({ isBulkEditModalOpen: data }),
  toggleBulkUpdateModal: data => set({ isBulkUpdateModalOpen: data }),
  toggleBulkDynamicUpdateModal: data => set({ isBulkDynamicUpdateModal: data }),
  toggleBulkDeleteModal: data => set({ isBulkDeleteModalOpen: data }),
}));
