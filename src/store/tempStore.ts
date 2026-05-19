import { create } from "zustand";

const TYPING_TTL = 3000;

type TempStore = {
  totalUnreadChat: number;
  application: Partial<Application>;
  email?: string;
  typings: Record<string, boolean>;
  typingTimers: Record<string, ReturnType<typeof setTimeout> | undefined>;
  setTyping: (chatId: string, state: boolean) => void;
  getTyping: (chatId: string) => boolean;
  resetStore: () => void;
  resetEmail: () => void;
  saveEmail: (email: string) => void;
  updatetotalUnreadChat: (data: number) => void;
  incrementTotalUnreadChat: (data?: number) => void;
  decrementTotalUnreadChat: (data?: number) => void;
  updateApplication: (data: Partial<Application>) => void;
  resetApplication: () => void;
};

export const useTempStore = create<TempStore>((set, get) => ({
  totalUnreadChat: 0,
  application: {},
  email: undefined,
  typings: {},
  typingTimers: {},

  setTyping(chatId, state) {
    const existingTimer = get().typingTimers[chatId];
    if (existingTimer) clearTimeout(existingTimer);

    set((current) => ({
      typings: { ...current.typings, [chatId]: state },
      typingTimers: { ...current.typingTimers, [chatId]: undefined },
    }));

    if (!state) return;

    const timer = setTimeout(() => {
      set((current) => ({
        typings: { ...current.typings, [chatId]: false },
        typingTimers: { ...current.typingTimers, [chatId]: undefined },
      }));
    }, TYPING_TTL);

    set((current) => ({
      typingTimers: { ...current.typingTimers, [chatId]: timer },
    }));
  },

  getTyping(chatId) {
    return !!get().typings[chatId];
  },

  resetStore() {
    set({ totalUnreadChat: 0, email: undefined, application: {} });
  },

  resetEmail() {
    set({ email: undefined });
  },

  saveEmail(email) {
    set({ email });
  },

  updatetotalUnreadChat(totalUnreadChat) {
    set({ totalUnreadChat });
  },

  incrementTotalUnreadChat(data = 1) {
    set((state) => ({
      totalUnreadChat: Math.max(0, state.totalUnreadChat + data),
    }));
  },

  decrementTotalUnreadChat(data = 1) {
    set((state) => ({
      totalUnreadChat: Math.max(0, state.totalUnreadChat - data),
    }));
  },

  updateApplication(data) {
    set((state) => ({ application: { ...state.application, ...data } }));
  },

  resetApplication() {
    set({ application: {} });
  },
}));

export const tempStore = useTempStore;
