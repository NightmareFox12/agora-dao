import { create } from 'zustand';

type Task = {
  daoAddress: string;
  setDaoAddress: (daoAddress: string) => void;
};

export const useTaskState = create<Task>((set) => ({
  daoAddress: '',
  setDaoAddress: (daoAddress: string) => set(() => ({ daoAddress })),
}));
