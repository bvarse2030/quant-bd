/*
|-----------------------------------------
| setting up StoreType for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { IAccounts } from './data/data';

export interface AccountsStore {
  queryPramsLimit: number;
  queryPramsPage: number;
  queryPramsQ: string;
  accounts: IAccounts[];
  selectedAccounts: IAccounts | null;
  newAccounts: Partial<IAccounts>;
  isAddModalOpen: boolean;
  isViewModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  setNewAccounts: React.Dispatch<React.SetStateAction<Partial<IAccounts>>>;
  isBulkEditModalOpen: boolean;
  isBulkUpdateModalOpen: boolean;
  isBulkDynamicUpdateModal: boolean;
  isBulkDeleteModalOpen: boolean;
  bulkData: IAccounts[];
  setQueryPramsLimit: (payload: number) => void;
  setQueryPramsPage: (payload: number) => void;
  setQueryPramsQ: (payload: string) => void;
  setAccounts: (Accounts: IAccounts[]) => void;
  setSelectedAccounts: (Accounts: IAccounts | null) => void;
  toggleAddModal: (isOpen: boolean) => void;
  toggleViewModal: (isOpen: boolean) => void;
  toggleEditModal: (isOpen: boolean) => void;
  toggleDeleteModal: (isOpen: boolean) => void;
  toggleBulkEditModal: (Accounts: boolean) => void;
  toggleBulkUpdateModal: (Accounts: boolean) => void;
  toggleBulkDynamicUpdateModal: (Accounts: boolean) => void;
  toggleBulkDeleteModal: (Accounts: boolean) => void;
  setBulkData: (bulkData: IAccounts[]) => void;
}
