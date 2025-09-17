import { create } from 'zustand';

type Dao = {
  daoAddress: string;
  setDaoAddress: (daoAddress: string) => void;
};

export const useDaoState = create<Dao>((set) => ({
  daoAddress: '',
  setDaoAddress: (daoAddress: string) => set(() => ({ daoAddress })),
}));
