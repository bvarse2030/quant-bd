/*
|-----------------------------------------
| setting up StoreType for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { IUsers } from './data/data';

export interface UsersStore {
  queryPramsLimit: number;
  queryPramsPage: number;
  queryPramsQ: string;
  users: IUsers[];
  selectedUsers: IUsers | null;
  newUsers: Partial<IUsers>;
  isAddModalOpen: boolean;
  isViewModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  setNewUsers: React.Dispatch<React.SetStateAction<Partial<IUsers>>>;
  isBulkEditModalOpen: boolean;
  isBulkUpdateModalOpen: boolean;
  isBulkDynamicUpdateModal: boolean;
  isBulkDeleteModalOpen: boolean;
  bulkData: IUsers[];
  setQueryPramsLimit: (payload: number) => void;
  setQueryPramsPage: (payload: number) => void;
  setQueryPramsQ: (payload: string) => void;
  setUsers: (Users: IUsers[]) => void;
  setSelectedUsers: (Users: IUsers | null) => void;
  toggleAddModal: (isOpen: boolean) => void;
  toggleViewModal: (isOpen: boolean) => void;
  toggleEditModal: (isOpen: boolean) => void;
  toggleDeleteModal: (isOpen: boolean) => void;
  toggleBulkEditModal: (Users: boolean) => void;
  toggleBulkUpdateModal: (Users: boolean) => void;
  toggleBulkDynamicUpdateModal: (Users: boolean) => void;
  toggleBulkDeleteModal: (Users: boolean) => void;
  setBulkData: (bulkData: IUsers[]) => void;
}
