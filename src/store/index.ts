import { StateCreator, create } from 'zustand';
import { createJSONStorage, persist, PersistOptions } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUniqueIdSync } from 'react-native-device-info';

type State = {
	hasAuth: boolean;
	isAdmin: boolean;
	displayStyle: 'flex' | 'grid';
};

type Actions = {
	resetStore: () => void;
	getDeviceId: () => string;
	setIsAdmin: (isAdmin: boolean) => void;
	setDisplayStyle: (displayStyle: 'flex' | 'grid') => void;
};

const initialState: State = {
	hasAuth: false,
	isAdmin: false,
	displayStyle: 'flex',
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
