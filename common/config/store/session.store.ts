import { create } from "zustand";

import {
  getPersistentItemAsync,
  setPersistentItemAsync,
} from "./persistent-store/persistent-store";

const SESSION_KEY = "session";

type SessionState = {
  session: string | null;
  isLoading: boolean;
  init: () => Promise<void>;
  signIn: (username: string) => void;
  signOut: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  isLoading: true,
  init: async () => {
    const session = await getPersistentItemAsync(SESSION_KEY);
    set({ session, isLoading: false });
  },
  signIn: (username: string) => {
    setPersistentItemAsync(SESSION_KEY, username);
    set({ session: username });
  },
  signOut: () => {
    setPersistentItemAsync(SESSION_KEY, null);
    set({ session: null });
  },
}));
