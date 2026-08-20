import { create } from 'zustand';

import {
    getToken as getStoredToken,
    removeToken as removeStoredToken,
    saveToken,
} from '@/storage/token-storage';

type TokenStore = {
  token: string | null;
  setToken: (token: string) => Promise<void>;
  getToken: () => Promise<string | null>;
  removeToken: () => Promise<void>;
};

export const useTokenStore = create<TokenStore>((set) => ({
  token: null,

  setToken: async (token) => {
    await saveToken(token);
    set({ token });
  },

  getToken: async () => {
    const token = await getStoredToken();
    set({ token });
    return token;
  },

  removeToken: async () => {
    await removeStoredToken();
    set({ token: null });
  },
}));