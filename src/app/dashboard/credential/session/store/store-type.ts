/*
|-----------------------------------------
| setting up StoreType for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { ISessions } from './data/data';

export interface SessionsStore {
  queryPramsLimit: number;
  queryPramsPage: number;
  queryPramsQ: string;
  sessions: ISessions[];
  selectedSessions: ISessions | null;
  newSessions: Partial<ISessions>;
  isAddModalOpen: boolean;
  isViewModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  setNewSessions: React.Dispatch<React.SetStateAction<Partial<ISessions>>>;
  isBulkEditModalOpen: boolean;
  isBulkUpdateModalOpen: boolean;
  isBulkDynamicUpdateModal: boolean;
  isBulkDeleteModalOpen: boolean;
  bulkData: ISessions[];
  setQueryPramsLimit: (payload: number) => void;
  setQueryPramsPage: (payload: number) => void;
  setQueryPramsQ: (payload: string) => void;
  setSessions: (Sessions: ISessions[]) => void;
  setSelectedSessions: (Sessions: ISessions | null) => void;
  toggleAddModal: (isOpen: boolean) => void;
  toggleViewModal: (isOpen: boolean) => void;
  toggleEditModal: (isOpen: boolean) => void;
  toggleDeleteModal: (isOpen: boolean) => void;
  toggleBulkEditModal: (Sessions: boolean) => void;
  toggleBulkUpdateModal: (Sessions: boolean) => void;
  toggleBulkDynamicUpdateModal: (Sessions: boolean) => void;
  toggleBulkDeleteModal: (Sessions: boolean) => void;
  setBulkData: (bulkData: ISessions[]) => void;
}
