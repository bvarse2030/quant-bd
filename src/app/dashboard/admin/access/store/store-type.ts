/*
|-----------------------------------------
| setting up StoreType for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { IAccessManagements } from './data/data';

export interface AccessManagementsStore {
  queryPramsLimit: number;
  queryPramsPage: number;
  queryPramsQ: string;
  accessManagements: IAccessManagements[];
  selectedAccessManagements: IAccessManagements | null;
  newAccessManagements: Partial<IAccessManagements>;
  isAddModalOpen: boolean;
  isViewModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  setNewAccessManagements: React.Dispatch<React.SetStateAction<Partial<IAccessManagements>>>;
  isBulkEditModalOpen: boolean;
  isBulkUpdateModalOpen: boolean;
  isBulkDynamicUpdateModal: boolean;
  isBulkDeleteModalOpen: boolean;
  bulkData: IAccessManagements[];
  setQueryPramsLimit: (payload: number) => void;
  setQueryPramsPage: (payload: number) => void;
  setQueryPramsQ: (payload: string) => void;
  setAccessManagements: (AccessManagements: IAccessManagements[]) => void;
  setSelectedAccessManagements: (AccessManagements: IAccessManagements | null) => void;
  toggleAddModal: (isOpen: boolean) => void;
  toggleViewModal: (isOpen: boolean) => void;
  toggleEditModal: (isOpen: boolean) => void;
  toggleDeleteModal: (isOpen: boolean) => void;
  toggleBulkEditModal: (AccessManagements: boolean) => void;
  toggleBulkUpdateModal: (AccessManagements: boolean) => void;
  toggleBulkDynamicUpdateModal: (AccessManagements: boolean) => void;
  toggleBulkDeleteModal: (AccessManagements: boolean) => void;
  setBulkData: (bulkData: IAccessManagements[]) => void;
}
