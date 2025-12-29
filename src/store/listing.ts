import { observable } from "@legendapp/state";

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

export const listingStore = observable<ListingState>({
  listing: initialListing,

  resetListing() {
    listingStore.listing.set(initialListing);
  },

  updateListing(data) {
    listingStore.listing.assign(data);
  },
  updateListingStep() {
    listingStore.listing.step.set((s) => s + 1);
  },
});
