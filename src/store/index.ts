import { observable } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { ObservablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv";

export const profileDefault = require("@/assets/images/Avatar.png");

type State = {
  isOnboarded: boolean;
  muted: boolean;
};

type Actions = {
  resetStore: () => void;
  setIsOnboarded: (isOnboarded: boolean) => void;
  updateMuted: () => void;
};

const initialState: State = {
  muted: false,
  isOnboarded: false,
};

type StateAndActions = State & Actions;

export const mainStore = observable<StateAndActions>({
  ...initialState,
  resetStore: () => {
    return {
      ...initialState,
    };
  },
  setIsOnboarded(isOnboarded) {
    mainStore.isOnboarded.set(isOnboarded);
  },
  updateMuted: () => {
    mainStore.muted.set((m) => !m);
  },
});

syncObservable(mainStore, {
  persist: {
    name: "mainStore",
    plugin: ObservablePersistMMKV,
  },
});
