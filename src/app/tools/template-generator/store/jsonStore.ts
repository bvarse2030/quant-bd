/*
|-----------------------------------------
| setting up JsonStore for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { persist, createJSONStorage } from 'zustand/middleware';

import { JsonTemplate } from '../components/JsonEditor';

export interface JsonTemplateItem {
  id: string;
  data: JsonTemplate;
  timestamp: number;
}

interface JsonStore {
  items: JsonTemplateItem[];
  addItem: (data: JsonTemplate) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, newData: JsonTemplate) => void;
  clearItems: () => void;
}

export const useJsonStore = create<JsonStore>()(
  persist(
    set => ({
      items: [],
      addItem: data =>
        set(state => ({
          items: [{ id: uuidv4(), data, timestamp: Date.now() }, ...state.items],
        })),
      removeItem: id =>
        set(state => ({
          items: state.items.filter(item => item.id !== id),
        })),
      updateItem: (id, newData) =>
        set(state => ({
          items: state.items.map(item => (item.id === id ? { ...item, data: newData, timestamp: Date.now() } : item)),
        })),
      clearItems: () => set({ items: [] }),
    }),
    {
      name: 'json-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
