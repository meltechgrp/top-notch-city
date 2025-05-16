import { StateCreator, create } from 'zustand';
import { createJSONStorage, persist, PersistOptions } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUniqueIdSync } from 'react-native-device-info';

type State = {
	hasAuth: boolean;
	isAdmin: boolean;
	displayStyle: 'flex' | 'grid';
	me?: any;
	isOnboarded: boolean;
};

type Actions = {
	resetStore: () => void;
	getDeviceId: () => string;
	setIsAdmin: (isAdmin: boolean) => void;
	setDisplayStyle: (displayStyle: 'flex' | 'grid') => void;
	setIsOnboarded: (isOnboarded: boolean) => void;
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
			getDeviceId: getUniqueIdSync,
			resetStore: () => set(initialState),
			setDisplayStyle: (displayStyle) => {
				set((state) => ({ ...state, displayStyle }));
			},
			setIsOnboarded(isOnboarded) {
				set((state) => ({ ...state, isOnboarded }));
			},
		}),
		{
			name: 'top-notch-storage',
			storage: createJSONStorage(() => AsyncStorage),
		}
	)
);

type TempState = {
	fullScreenLoading: boolean;
	updateFullScreenLoading: (fullScreenLoading: boolean) => void;
	resetStore: () => void;
};
const initialTempState = {
	fullScreenLoading: false,
};
// temporary store
export const useTempStore = create<TempState>((set, get) => ({
	...initialTempState,
	updateFullScreenLoading: (fullScreenLoading: boolean) =>
		set((state) => ({ ...state, fullScreenLoading })),
	resetStore: () => set(initialTempState),
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
