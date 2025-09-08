import { StateCreator, create } from "zustand";
import { createJSONStorage, persist, PersistOptions } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUniqueIdSync } from "react-native-device-info";
import { LocationObjectCoords } from "expo-location";

export type Profile = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  gender?: string;
  dob?: any;
  photo?: any;
};

export const profileDefault = require("@/assets/images/Avatar.png");

type State = {
  hasAuth: boolean;
  isAdmin: boolean;
  me?: Me;
  location?: LocationObjectCoords;
  isOnboarded: boolean;
  topProperties: Property[];
  topLocations: TopLocation[];
  nearbyProperties?: Property[];
  searchProperties: Property[];
  savedSearches: SearchHistory[];
  muted: boolean;
};

type Actions = {
  resetStore: () => void;
  getDeviceId: () => string;
  setIsAdmin: (isAdmin: boolean) => void;
  setIsOnboarded: (isOnboarded: boolean) => void;
  updateProfile: (data: Me) => void;
  updateLocation: (data: LocationObjectCoords) => void;
  setMediaViewer: (
    mediaViewer: Media[],
    currentIndex: number,
    isVideoReady?: boolean
  ) => void;

  // 🔹 New Actions for property lists
  setTopProperties: (properties: Property[]) => void;
  clearTopProperties: () => void;

  setNearbyProperties: (properties: Property[]) => void;
  clearNearbyProperties: () => void;

  setTopLocations: (locations: TopLocation[]) => void;
  clearTopLocations: () => void;
  updateMuted: () => void;
  // Search
  updateSearchProperties: (data: Property[]) => void;
  updateSavedSearch: (data: SearchHistory[]) => void;
};

const initialState: State = {
  me: undefined,
  hasAuth: false,
  isAdmin: false,
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
      setIsAdmin: (isAdmin) => {
        set((state) => ({ ...state, isAdmin }));
      },
      getDeviceId: getUniqueIdSync,
      resetStore: () => {
        const isOnboarded = get().isOnboarded;
        set((state) => ({
          ...initialState,
          isOnboarded: isOnboarded,
        }));
      },
      updateLocation: (data) => set((p) => ({ ...p, location: data })),
      setMediaViewer: (mediaViewer, currentIndex, isVideoReady) =>
        set((state) => ({
          ...state,
          mediaViewer: {
            media: mediaViewer,
            currentIndex,
            isVideoReady,
          },
        })),
      unsetMediaViewer: () =>
        set((state) => ({ ...state, mediaViewer: undefined })),
      setIsOnboarded(isOnboarded) {
        set((state) => ({ ...state, isOnboarded }));
      },
      updateProfile: (data) =>
        set((state) => ({ ...state, me: { ...state.me, ...data } })),

      // 🔹 Property list actions
      setTopProperties: (properties) =>
        set((state) => ({ ...state, topProperties: properties })),

      clearTopProperties: () =>
        set((state) => ({ ...state, topProperties: [] })),

      setNearbyProperties: (properties) =>
        set((state) => ({ ...state, nearbyProperties: properties })),

      clearNearbyProperties: () =>
        set((state) => ({ ...state, nearbyProperties: [] })),

      setTopLocations: (locations) =>
        set((state) => ({ ...state, topLocations: locations })),

      clearTopLocations: () => set((state) => ({ ...state, topLocations: [] })),
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
  photos?: UploadedFile[];
  videos?: UploadedFile[];
  modelImages?: UploadedFile[];
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
  resetEmail: () => void;
  saveEmail: (email: string) => void;
  updateListing: (data: Listing) => void;
  updateListingStep: () => void;
};
const initialTempState = {
  fullScreenLoading: false,
  pin: "",
  listing: {
    step: 1,
    currency: "ngn",
    totalSteps: 7,
  },
};
// temporary store
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
}));
