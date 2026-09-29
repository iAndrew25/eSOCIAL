import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

export interface SessionState {
  username: string | null;
  avatarUrl: string | null;
  isLoading: boolean;
  init: () => Promise<void>;
  signIn: (username: string, avatarUrl?: string | null) => void;
  signOut: () => void;
  setAvatarUrl: (avatarUrl: string | null) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  username: null,
  avatarUrl: null,
  isLoading: true,
  init: async () => {
    const username = await SecureStore.getItemAsync("username");
    const avatarUrl = await SecureStore.getItemAsync("avatarUrl");
    set({ username, avatarUrl: avatarUrl ?? null, isLoading: false });
  },
  signIn: (username, avatarUrl) => {
    SecureStore.setItemAsync("username", username);
    if (avatarUrl) {
      SecureStore.setItemAsync("avatarUrl", avatarUrl);
    }
    set({ username, avatarUrl: avatarUrl ?? null });
  },
  signOut: () => {
    SecureStore.deleteItemAsync("username");
    SecureStore.deleteItemAsync("avatarUrl");
    set({ username: null, avatarUrl: null });
  },
  setAvatarUrl: (avatarUrl) => {
    if (avatarUrl) {
      SecureStore.setItemAsync("avatarUrl", avatarUrl);
    } else {
      SecureStore.deleteItemAsync("avatarUrl");
    }
    set({ avatarUrl });
  },
}));
