import { StateCreator, create } from "zustand";
import { createJSONStorage, persist, PersistOptions } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUniqueIdSync } from "react-native-device-info";
import { LocationObjectCoords } from "expo-location";

export const profileDefault = require("@/assets/images/Avatar.png");

type State = {
  me?: StoredAccount;
  location?: LocationObjectCoords;
  isOnboarded: boolean;
  topProperties: Property[];
  topLocations: TopLocation[];
  nearbyProperties?: Property[];
  searchProperties: Property[];
  savedSearches: SearchHistory[];
  muted: boolean;
};

export type CurrentUser = {
  me?: StoredAccount;
  isAdmin: boolean;
  isAgent: boolean;
};

type Actions = {
  resetStore: () => void;
  getDeviceId: () => string;
  setIsOnboarded: (isOnboarded: boolean) => void;
  updateProfile: (data: StoredAccount) => void;
  updateLocation: (data: LocationObjectCoords) => void;

  setNearbyProperties: (properties: Property[]) => void;
  clearNearbyProperties: () => void;
  updateMuted: () => void;
  getCurrentUser: () => CurrentUser;
  // Search
  updateSearchProperties: (data: Property[]) => void;
  updateSavedSearch: (data: SearchHistory[]) => void;
};

const initialState: State = {
  me: undefined,
  muted: false,
  isOnboarded: false,
  topLocations: [],
  topProperties: [],
  searchProperties: [],
  savedSearches: [],
};

type StateAndActions = State & Actions;

type MyPersist = (
  config: StateCreator<StateAndActions>,
  options: PersistOptions<StateAndActions>
) => StateCreator<StateAndActions>;
export const useStore = create<StateAndActions>(
  (persist as MyPersist)(
    (set, get) => ({
      ...initialState,
      getDeviceId: getUniqueIdSync,
      resetStore: () => {
        const isOnboarded = get().isOnboarded;
        set((state) => ({
          ...initialState,
          isOnboarded: isOnboarded,
        }));
      },
      getCurrentUser: () => {
        const me = get()?.me;
        return {
          me,
          isAgent: me?.role == "agent" || me?.role == "staff_agent",
          isAdmin: me?.role == "admin" || me?.is_superuser || false,
        };
      },
      updateLocation: (data) => set((p) => ({ ...p, location: data })),
      setIsOnboarded(isOnboarded) {
        set((state) => ({ ...state, isOnboarded }));
      },
      updateProfile(data) {
        set({ me: data });
      },

      setNearbyProperties: (properties) =>
        set((state) => ({ ...state, nearbyProperties: properties })),

      clearNearbyProperties: () =>
        set((state) => ({ ...state, nearbyProperties: [] })),

      updateMuted: () => set((s) => ({ ...s, muted: !s.muted })),
      updateSearchProperties: (searchProperties) =>
        set((s) => ({ ...s, searchProperties })),
      updateSavedSearch: (data) => set((s) => ({ ...s, savedSearches: data })),
    }),
    {
      name: "top-notch-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export type Listing = {
  title?: string;
  step: number;
  purpose?: string;
  category?: string;
  subCategory?: string;
  type?: string;
  address?: GooglePlace;
  facilities?: {
    label: string;
    value: any;
  }[];
  photos?: Media[];
  videos?: Media[];
  modelImages?: Media[];
  availabilityPeriod?: {
    start: string;
    end: string;
  }[];
  duration?: string;
  description?: string;
  price?: string;
  currency?: string;
};

type TempState = {
  pin?: string;
  pinVerifyRequest?: {
    callback: () => void;
    buttonTitle: string;
    description?: string;
  };
  application?: Partial<Application>;
  totalUnreadChat: number;
  pinSetupOptions?: {
    onSuccessRoute?: string;
    onSuccessRouteParams?: any;
    reenter?: boolean;
  };
  setPinSetupOptions: (args: {
    onSuccessRoute?: string;
    onSuccessRouteParams?: any;
    reenter?: boolean;
  }) => void;
  setPinVerifyRequest: (
    pinVerifyRequest: TempState["pinVerifyRequest"]
  ) => void;
  clearPinSetupOptions: () => void;
  fullScreenLoading: boolean;
  listing: Listing;
  email?: string;
  updateFullScreenLoading: (fullScreenLoading: boolean) => void;
  resetStore: () => void;
  resetListing: () => void;
  updateApplication: (data: Partial<Application>) => void;
  resetEmail: () => void;
  saveEmail: (email: string) => void;
  updateListing: (data: Partial<Listing>) => void;
  updateListingStep: () => void;
  updatetotalUnreadChat: (data: number) => void;
};
const initialTempState = {
  fullScreenLoading: false,
  pin: "",
  listing: {
    purpose: "sell",
    step: 1,
    currency: "NGN",
    totalSteps: 7,
  },
  totalUnreadChat: 0,
};
export const useTempStore = create<TempState>((set, get) => ({
  ...initialTempState,
  updateFullScreenLoading: (fullScreenLoading: boolean) =>
    set((state) => ({ ...state, fullScreenLoading })),
  setPinVerifyRequest: (pinVerifyRequest: TempState["pinVerifyRequest"]) =>
    set((state) => ({ ...state, pinVerifyRequest })),
  resetStore: () => set(initialTempState),
  resetEmail: () => set((state) => ({ ...state, email: undefined })),
  saveEmail: (email) => set((state) => ({ ...state, email })),
  resetListing: () =>
    set((state) => ({ ...state, listing: initialTempState.listing })),
  setPinSetupOptions: (args) => {
    set((state) => ({ ...state, pinSetupOptions: args }));
  },
  clearPinSetupOptions: () => {
    set((state) => ({ ...state, pinSetupOptions: undefined }));
  },
  updateListing: (data) =>
    set((state) => ({ ...state, listing: { ...state.listing, ...data } })),
  updateListingStep: () =>
    set((state) => ({
      ...state,
      listing: { ...state.listing, step: state?.listing?.step + 1 },
    })),
  updatetotalUnreadChat: (data) =>
    set((s) => ({ ...s, totalUnreadChat: data })),
  updateApplication: (data) =>
    set((s) => ({ ...s, application: { ...s.application, ...data } })),
}));
