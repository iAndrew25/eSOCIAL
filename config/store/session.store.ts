import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

export interface SessionState {
  username: string | null;
  isLoading: boolean;
  init: () => Promise<void>;
  signIn: (username: string) => void;
  signOut: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  username: null,
  isLoading: true,
  init: async () => {
    const username = await SecureStore.getItemAsync("username");
    set({ username, isLoading: false });
  },
  signIn: (username) => {
    SecureStore.setItemAsync("username", username);
    set({ username });
  },
  signOut: () => {
    SecureStore.deleteItemAsync("username");
    set({ username: null });
  },
}));
