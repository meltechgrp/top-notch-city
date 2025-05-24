import { StateCreator, create } from 'zustand';
import { createJSONStorage, persist, PersistOptions } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUniqueIdSync } from 'react-native-device-info';
import { ImagePickerAsset } from 'expo-image-picker';
import { UpdateUserInput } from '@/lib/schema';

export type Profile = {
	firstName?: string;
	lastName?: string;
	email?: string;
	phoneNumber?: string;
	gender?: string;
	dob?: any;
	photo?: any;
};

export const profileDefault = require('@/assets/images/Avatar.png');

type State = {
	hasAuth: boolean;
	isAdmin: boolean;
	displayStyle: 'flex' | 'grid';
	me?: Me;
	isOnboarded: boolean;
};

type Actions = {
	resetStore: () => void;
	getDeviceId: () => string;
	setMe: (me: Me) => void;
	setIsAdmin: (isAdmin: boolean) => void;
	setDisplayStyle: (displayStyle: 'flex' | 'grid') => void;
	setIsOnboarded: (isOnboarded: boolean) => void;
	updateProfile: (data: Me) => void;
};

const initialState: State = {
	hasAuth: false,
	isAdmin: false,
	displayStyle: 'flex',
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
			setMe: (me) => set((state) => ({ ...state, me })),
			getDeviceId: getUniqueIdSync,
			resetStore: () => set(initialState),
			setDisplayStyle: (displayStyle) => {
				set((state) => ({ ...state, displayStyle }));
			},
			setIsOnboarded(isOnboarded) {
				set((state) => ({ ...state, isOnboarded }));
			},
			updateProfile: (data) =>
				set((state) => ({ ...state, me: { ...state.me, ...data } })),
		}),
		{
			name: 'top-notch-storage',
			storage: createJSONStorage(() => AsyncStorage),
		}
	)
);

export type UploadedFile = ImagePickerAsset & {
	default: boolean;
};

type Listing = {
	totalSteps: number;
	step: number;
	purpose: string;
	category: string;
	type?: string;
	address?: string;
	facilities?: {
		label: string;
		value: number;
	}[];
	photos?: UploadedFile[];
	videos?: UploadedFile[];
	modelImages?: UploadedFile[];
	features?: string[];
	title?: string;
	description?: string;
	price?: string;
};

type TempState = {
	fullScreenLoading: boolean;
	listing: Listing;
	kyc?: Partial<UpdateUserInput>;
	updateFullScreenLoading: (fullScreenLoading: boolean) => void;
	resetStore: () => void;
	resetListing: () => void;
	resetKyc: () => void;
	updateListing: (data: Listing) => void;
};
const initialTempState = {
	fullScreenLoading: false,
	listing: {
		step: 1,
		totalSteps: 7,
		purpose: 'rent',
		category: 'bungalow',
	},
};
// temporary store
export const useTempStore = create<TempState>((set, get) => ({
	...initialTempState,
	updateFullScreenLoading: (fullScreenLoading: boolean) =>
		set((state) => ({ ...state, fullScreenLoading })),
	resetStore: () => set(initialTempState),
	resetKyc: () => set((state) => ({ ...state, kyc0: undefined })),
	resetListing: () =>
		set((state) => ({ ...state, listing: initialTempState.listing })),
	updateListing: (data) =>
		set((state) => ({ ...state, listing: { ...state.listing, ...data } })),
}));

type ChatState = {
	getOppositeUser: (currentUserId?: string) => any | undefined;
	getCurrentUser: (currentUserId?: string) => any | undefined;
	chat?: any;
	isProfileOpen: boolean;
	toggleProfile: (val: boolean) => void;
	updateChat?: (chat: any) => void;
};
export const useChatStore = create<ChatState>((set, get) => ({
	isProfileOpen: false,
	toggleProfile: (val: boolean) =>
		set((state) => ({ ...state, isProfileOpen: val })),
	getOppositeUser: (currentUserId) => {
		if (!currentUserId) return;
		const chat = get().chat;
		const members = chat?.members || [];
		return members.find((m: any) => m.user.id !== currentUserId);
	},
	getCurrentUser: (currentUserId) => {
		if (!currentUserId) return;
		const chat = get().chat;
		const members = chat?.members || [];
		return members.find((m: any) => m.user.id === currentUserId);
	},
	updateChat: (chat: any) => set((state) => ({ ...state, chat })),
}));
