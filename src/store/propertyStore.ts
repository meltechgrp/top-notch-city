import { create } from 'zustand';

type PropertyState = {
	details?: Property;
	updateProperty: (data: Property) => void;
	getImages: () => Property['media'];
	getVideos: () => Property['media'];
};
// Property temporary store
export const usePropertyStore = create<PropertyState>((set, get) => ({
	details: undefined,
	updateProperty: (data) => set((state) => ({ ...state, details: data })),
	getImages: () => {
		return (
			get().details?.media.filter((url) => url.media_type == 'IMAGE') ?? []
		);
	},
	getVideos: () => {
		return (
			get().details?.media.filter((url) => url.media_type == 'VIDEO') ?? []
		);
	},
}));
