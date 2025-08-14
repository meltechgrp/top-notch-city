import { StateCreator, create } from "zustand";
import { createJSONStorage, persist, PersistOptions } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUniqueIdSync } from "react-native-device-info";
import { UpdateUserInput } from "@/lib/schema";

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
  isOnboarded: boolean;
};

type Actions = {
  resetStore: () => void;
  getDeviceId: () => string;
  setIsAdmin: (isAdmin: boolean) => void;
  setIsOnboarded: (isOnboarded: boolean) => void;
  updateProfile: (data: Me) => void;
};

const initialState: State = {
  me: undefined,
  hasAuth: false,
  isAdmin: false,
  isOnboarded: false,
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
      setIsOnboarded(isOnboarded) {
        set((state) => ({ ...state, isOnboarded }));
      },
      updateProfile: (data) =>
        set((state) => ({ ...state, me: { ...state.me, ...data } })),
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
  kyc?: Partial<UpdateUserInput>;
  updateFullScreenLoading: (fullScreenLoading: boolean) => void;
  resetStore: () => void;
  resetListing: () => void;
  resetKyc: () => void;
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
  resetKyc: () => set((state) => ({ ...state, kyc0: undefined })),
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

type ChatState = {
  updateReceiver: (data: ReceiverInfo) => any | undefined;
  updateSender: (data: SenderInfo) => any | undefined;
  chats?: Message[];
  receiver?: ReceiverInfo;
  sender?: SenderInfo;
  updateChat: (chat: Message[]) => void;
};
export const useChatStore = create<ChatState>((set, get) => ({
  updateReceiver: (receiver) => set((state) => ({ ...state, receiver })),
  updateSender: (sender) => set((state) => ({ ...state, sender })),
  updateChat: (chats) => set((state) => ({ ...state, chats })),
}));
