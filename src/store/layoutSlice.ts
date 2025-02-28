import { StateCreator } from 'zustand';

import { RootStore } from './root';

export type LayoutSlice = {
  setMobileDrawerOpen: (eventName: boolean) => void;
  mobileDrawerOpen: boolean;
  setGaslessEnabled: (eventName: boolean) => void;
  gaslessEnabled: boolean;
};

export const createLayoutSlice: StateCreator<
  RootStore,
  [['zustand/subscribeWithSelector', never], ['zustand/devtools', never]],
  [],
  LayoutSlice
> = (set) => {
  return {
    mobileDrawerOpen: false,
    setMobileDrawerOpen: (value: boolean) => {
      set({ mobileDrawerOpen: value });
    },
    gaslessEnabled: true,
    setGaslessEnabled: (value: boolean) => {
      set({ gaslessEnabled: value });
    },
  };
};
