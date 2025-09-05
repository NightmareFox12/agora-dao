import { create } from "zustand";

type HeaderStore = {
  showHeader: boolean;
  setShowHeader: (show: boolean) => void;
};

export const useHeaderStore = create<HeaderStore>(set => ({
  showHeader: true,
  setShowHeader: (show: boolean) => set(() => ({ showHeader: show })),
}));
