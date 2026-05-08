/*
|-----------------------------------------
| setting up StoreType for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { IVerifications } from './data/data';

export interface VerificationsStore {
  queryPramsLimit: number;
  queryPramsPage: number;
  queryPramsQ: string;
  verifications: IVerifications[];
  selectedVerifications: IVerifications | null;
  newVerifications: Partial<IVerifications>;
  isAddModalOpen: boolean;
  isViewModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  setNewVerifications: React.Dispatch<React.SetStateAction<Partial<IVerifications>>>;
  isBulkEditModalOpen: boolean;
  isBulkUpdateModalOpen: boolean;
  isBulkDynamicUpdateModal: boolean;
  isBulkDeleteModalOpen: boolean;
  bulkData: IVerifications[];
  setQueryPramsLimit: (payload: number) => void;
  setQueryPramsPage: (payload: number) => void;
  setQueryPramsQ: (payload: string) => void;
  setVerifications: (Verifications: IVerifications[]) => void;
  setSelectedVerifications: (Verifications: IVerifications | null) => void;
  toggleAddModal: (isOpen: boolean) => void;
  toggleViewModal: (isOpen: boolean) => void;
  toggleEditModal: (isOpen: boolean) => void;
  toggleDeleteModal: (isOpen: boolean) => void;
  toggleBulkEditModal: (Verifications: boolean) => void;
  toggleBulkUpdateModal: (Verifications: boolean) => void;
  toggleBulkDynamicUpdateModal: (Verifications: boolean) => void;
  toggleBulkDeleteModal: (Verifications: boolean) => void;
  setBulkData: (bulkData: IVerifications[]) => void;
}
