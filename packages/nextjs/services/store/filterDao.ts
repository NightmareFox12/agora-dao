import { create } from 'zustand';

type FilterDao = {
  category: string;
  setCategory: (category: string) => void;
  name: string;
  setName: (name: string) => void;
};

export const useFilterDao = create<FilterDao>((set) => ({
  category: '',
  setCategory: (category: string) => set(() => ({ category })),
  name: '',
  setName: (name: string) => set(() => ({ name })),
}));
