/*
|-----------------------------------------
| setting up GenerateStore for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

interface Schema {
  [key: string]: string | Schema;
}

interface NamingConvention {
  Users_1_000___: string;
  users_2_000___: string;
  User_3_000___: string;
  user_4_000___: string;
}

interface InputConfig {
  uid: string;
  templateName: string;
  schema: Schema;
  namingConvention: NamingConvention;
}

function generateStoreFile(inputJson: string): string {
  const config: InputConfig = JSON.parse(inputJson);
  const { namingConvention } = config;

  const template = `import { create } from 'zustand'
import { IUsers_1_000___ ,defaultUsers_1_000___} from '../store/data/data'
import { Users_1_000___Store } from '../store/store-type' 
import { queryParams } from '../store/store-constant';

export const useUsers_1_000___Store = create<Users_1_000___Store>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    users_2_000___: [],
    selectedUsers_1_000___: null,
    newUsers_1_000___: defaultUsers_1_000___,
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
    setBulkData: (bulkData: IUsers_1_000___[]) => set({ bulkData }),
    setUsers_1_000___: (users_2_000___: IUsers_1_000___[]) =>
        set({ users_2_000___ }),
    setSelectedUsers_1_000___: (Users_1_000___) =>
        set({ selectedUsers_1_000___: Users_1_000___ }),
    setNewUsers_1_000___: (Users_1_000___) =>
        set((state) => ({
            newUsers_1_000___:
                typeof Users_1_000___ === 'function'
                    ? Users_1_000___(state.newUsers_1_000___)
                    : Users_1_000___,
        })),
    toggleAddModal: (data) => set({ isAddModalOpen: data }),
    toggleViewModal: (data) => set({ isViewModalOpen: data }),
    toggleEditModal: (data) => set({ isEditModalOpen: data }),
    toggleDeleteModal: (data) => set({ isDeleteModalOpen: data }),
    toggleBulkEditModal: (data) => set({ isBulkEditModalOpen: data }),
    toggleBulkUpdateModal: (data) => set({ isBulkUpdateModalOpen: data }),
    toggleBulkDynamicUpdateModal: (data) =>
        set({ isBulkDynamicUpdateModal: data }),
    toggleBulkDeleteModal: (data) => set({ isBulkDeleteModalOpen: data }),
}))
`;

  const result = template
    .replaceAll('baseIUsers_1_000___', `baseI${namingConvention.Users_1_000___}`)
    .replaceAll('IUsers_1_000___', `I${namingConvention.Users_1_000___}`)
    .replaceAll('useUsers_1_000___Store', `use${namingConvention.Users_1_000___}Store`)
    .replaceAll('Users_1_000___Store', `${namingConvention.Users_1_000___}Store`)
    .replaceAll('setUsers_1_000___', `set${namingConvention.Users_1_000___}`)
    .replaceAll('setSelectedUsers_1_000___', `setSelected${namingConvention.Users_1_000___}`)
    .replaceAll('selectedUsers_1_000___', `selected${namingConvention.Users_1_000___}`)
    .replaceAll('setNewUsers_1_000___', `setNew${namingConvention.Users_1_000___}`)
    .replaceAll('newUsers_1_000___', `new${namingConvention.Users_1_000___}`)
    .replaceAll('users_2_000___', namingConvention.users_2_000___)
    .replaceAll('Users_1_000___', namingConvention.Users_1_000___);

  return result;
}

export default generateStoreFile;
