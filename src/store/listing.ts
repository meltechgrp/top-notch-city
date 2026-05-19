import { create } from "zustand";

export type Listing = {
  title?: string;
  step: number;
  purpose?: string;
  category?: string;
  subCategory?: string;
  type?: string;
  address?: GooglePlace;
  bathroom?: string;
  bedroom?: string;
  landarea?: string;
  bedType?: string;
  guests?: string;
  plots?: string;
  viewType?: string;
  companies?: Company[];
  discount?: string;
  listing_role?: string;
  owner_type?: string;
  caution_fee?: string;
  ownership_documents?: Media[];
  facilities?: string[];
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

type ListingState = {
  listing: Listing;
  resetListing: () => void;
  updateListing: (data: Partial<Listing>) => void;
  updateListingStep: () => void;
};

const initialListing: Listing = {
  purpose: "rent",
  step: 1,
  currency: "NGN",
};

export const useListingStore = create<ListingState>((set) => ({
  listing: initialListing,

  resetListing() {
    set({ listing: initialListing });
  },

  updateListing(data) {
    set((state) => ({ listing: { ...state.listing, ...data } }));
  },

  updateListingStep() {
    set((state) => ({
      listing: { ...state.listing, step: state.listing.step + 1 },
    }));
  },
}));

export const listingStore = useListingStore;
