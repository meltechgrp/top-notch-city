import { observable } from "@legendapp/state";

const TYPING_TTL = 3000;

export const tempStore = observable({
  totalUnreadChat: 0,
  application: {} as Partial<Application>,
  email: undefined as string | undefined,
  typings: {} as Record<string, boolean>,
  typingTimers: {} as Record<string, ReturnType<typeof setTimeout>>,

  setTyping(chatId: string, state: boolean) {
    tempStore.typings[chatId].set(state);
    const existingTimer = tempStore.typingTimers[chatId].get();
    if (existingTimer) {
      clearTimeout(existingTimer);
    }
    if (state) {
      const timer = setTimeout(() => {
        tempStore.typings[chatId].set(false);
        tempStore.typingTimers[chatId].set(undefined as any);
      }, TYPING_TTL);

      tempStore.typingTimers[chatId].set(timer);
    }
  },

  getTyping(chatId: string) {
    return !!tempStore.typings[chatId].get();
  },
  resetStore() {
    tempStore.totalUnreadChat.set(0);
    tempStore.email.set(undefined);
    tempStore.application.set({});
  },

  resetEmail() {
    tempStore.email.set(undefined);
  },

  saveEmail(email: string) {
    tempStore.email.set(email);
  },

  updatetotalUnreadChat(data: number) {
    tempStore.totalUnreadChat.set(data);
  },

  updateApplication(data: Partial<Application>) {
    tempStore.application.assign(data);
  },
});
