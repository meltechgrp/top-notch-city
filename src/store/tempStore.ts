import { observable } from "@legendapp/state";

export const tempStore = observable({
  totalUnreadChat: 0,
  application: {} as Partial<Application>,
  email: undefined as string | undefined,

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
