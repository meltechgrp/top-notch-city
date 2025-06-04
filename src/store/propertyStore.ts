import { create } from 'zustand';

type PropertyState = {
	details?: Property;
	updateProperty: (data: Property) => void;
	getImages: () => Property['media_urls'];
	getVideos: () => Property['media_urls'];
};
// Property temporary store
export const usePropertyStore = create<PropertyState>((set, get) => ({
	details: undefined,
	updateProperty: (data) => set((state) => ({ ...state, details: data })),
	getImages: () => {
		return (
			get().details?.media_urls.filter((url) => url.endsWith('.jpg')) ?? []
		);
	},
	getVideos: () => {
		return (
			get().details?.media_urls.filter((url) => url.endsWith('.mp4')) ?? []
		);
	},
}));
