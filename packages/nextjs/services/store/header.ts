import { create } from "zustand";

type HeaderStore = {
  showHeader: boolean;
  setShowHeader: (show: boolean) => void;
};

export const useHeaderState = create<HeaderStore>(set => ({
  showHeader: false,
  setShowHeader: (show: boolean) => set(() => ({ showHeader: show })),
}));
