/*
|-----------------------------------------
| setting up StoreType for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { IRoles } from './data/data';

export interface RolesStore {
  queryPramsLimit: number;
  queryPramsPage: number;
  queryPramsQ: string;
  roles: IRoles[];
  selectedRoles: IRoles | null;
  newRoles: Partial<IRoles>;
  isAddModalOpen: boolean;
  isViewModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  setNewRoles: React.Dispatch<React.SetStateAction<Partial<IRoles>>>;
  isBulkEditModalOpen: boolean;
  isBulkUpdateModalOpen: boolean;
  isBulkDynamicUpdateModal: boolean;
  isBulkDeleteModalOpen: boolean;
  bulkData: IRoles[];
  setQueryPramsLimit: (payload: number) => void;
  setQueryPramsPage: (payload: number) => void;
  setQueryPramsQ: (payload: string) => void;
  setRoles: (Roles: IRoles[]) => void;
  setSelectedRoles: (Roles: IRoles | null) => void;
  toggleAddModal: (isOpen: boolean) => void;
  toggleViewModal: (isOpen: boolean) => void;
  toggleEditModal: (isOpen: boolean) => void;
  toggleDeleteModal: (isOpen: boolean) => void;
  toggleBulkEditModal: (Roles: boolean) => void;
  toggleBulkUpdateModal: (Roles: boolean) => void;
  toggleBulkDynamicUpdateModal: (Roles: boolean) => void;
  toggleBulkDeleteModal: (Roles: boolean) => void;
  setBulkData: (bulkData: IRoles[]) => void;
}
