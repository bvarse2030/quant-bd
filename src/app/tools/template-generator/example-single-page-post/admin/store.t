import { create } from 'zustand';

export interface StringArrayData {
  name?: string;
  _id?: string;
  [key: string]: unknown;
}

export interface IPosts {
  title: string;
  email: string;
  'author-email': string;
  password: string;
  passcode: string;
  area: string;
  'sub-area': string[];
  'products-images': { url: string; name: string }[];
  'personal-image': { url: string; name: string };
  description: string;
  age: number;
  amount: number;
  isActive: boolean;
  'start-date': Date;
  'start-time': string;
  'schedule-date': { from: Date; to: Date };
  'schedule-time': { start: string; end: string };
  'favorite-color': string;
  number: string;
  profile: string;
  test: string;
  info: string;
  shift: string;
  policy: boolean;
  hobbies: string[];
  ideas: string[];
  students: StringArrayData[];
  complexValue: {
    id: string;
    title: string;
    parent: {
      id: string;
      title: string;
      child: {
        id: string;
        title: string;
        child: string;
        note: string;
      };
      note: string;
    };
    note: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
  _id?: string;
}

export const defaultPosts: IPosts = {
  title: '',
  email: '',
  'author-email': '',
  password: '',
  passcode: '',
  area: '',
  'sub-area': [],
  'products-images': [],
  'personal-image': { name: '', url: '' },
  description: '',
  age: 0,
  amount: 0,
  isActive: false,
  'start-date': new Date(),
  'start-time': '',
  'schedule-date': { from: new Date(), to: new Date() },
  'schedule-time': { start: '', end: '' },
  'favorite-color': '',
  number: '',
  profile: '',
  test: '',
  info: '',
  shift: '',
  policy: false,
  hobbies: [],
  ideas: [],
  students: [],
  complexValue: {
    id: '',
    title: '',
    parent: {
      id: '',
      title: '',
      child: {
        id: '',
        title: '',
        child: '',
        note: '',
      },
      note: '',
    },
    note: '',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  _id: '',
};

export const defaultPageNumber = 2;
export const queryParams = { q: '', page: 1, limit: defaultPageNumber };
export const pageLimitArr = [defaultPageNumber, 20, 30, 40, 50];
export const postsSelectorArr = ['Bangladesh', 'India', 'Pakistan', 'Canada'];

export interface PostsStore {
  queryPramsLimit: number;
  queryPramsPage: number;
  queryPramsQ: string;
  posts: IPosts[];
  selectedPosts: IPosts | null;
  newPosts: Partial<IPosts>;
  isAddModalOpen: boolean;
  isViewModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  setNewPosts: React.Dispatch<React.SetStateAction<Partial<IPosts>>>;
  isBulkEditModalOpen: boolean;
  isBulkUpdateModalOpen: boolean;
  isBulkDynamicUpdateModal: boolean;
  isBulkDeleteModalOpen: boolean;
  bulkData: IPosts[];
  setQueryPramsLimit: (payload: number) => void;
  setQueryPramsPage: (payload: number) => void;
  setQueryPramsQ: (payload: string) => void;
  setPosts: (Posts: IPosts[]) => void;
  setSelectedPosts: (Posts: IPosts | null) => void;
  toggleAddModal: (isOpen: boolean) => void;
  toggleViewModal: (isOpen: boolean) => void;
  toggleEditModal: (isOpen: boolean) => void;
  toggleDeleteModal: (isOpen: boolean) => void;
  toggleBulkEditModal: (Posts: boolean) => void;
  toggleBulkUpdateModal: (Posts: boolean) => void;
  toggleBulkDynamicUpdateModal: (Posts: boolean) => void;
  toggleBulkDeleteModal: (Posts: boolean) => void;
  setBulkData: (bulkData: IPosts[]) => void;
}

export const usePostsStore = create<PostsStore>(set => ({
  queryPramsLimit: queryParams.limit,
  queryPramsPage: queryParams.page,
  queryPramsQ: queryParams.q,
  posts: [],
  selectedPosts: null,
  newPosts: defaultPosts,
  isBulkEditModalOpen: false,
  isBulkDynamicUpdateModal: false,
  isBulkUpdateModalOpen: false,
  isBulkDeleteModalOpen: false,
  isAddModalOpen: false,
  isViewModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  bulkData: [],
  setQueryPramsLimit: payload => set({ queryPramsLimit: payload }),
  setQueryPramsPage: payload => set({ queryPramsPage: payload }),
  setQueryPramsQ: payload => set({ queryPramsQ: payload }),
  setBulkData: bulkData => set({ bulkData }),
  setPosts: posts => set({ posts }),
  setSelectedPosts: Posts => set({ selectedPosts: Posts }),
  setNewPosts: Posts =>
    set(state => ({
      newPosts: typeof Posts === 'function' ? Posts(state.newPosts) : Posts,
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
