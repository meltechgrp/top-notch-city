type SearchFilters = {
  city?: string;
  state?: string;
  country?: string;
  purpose?: string;
  minPrice?: string;
  maxPrice?: string;
  category?: string;
  subCategory?: string[];
  amenities?: string[];
  minBedroom?: string;
  maxBedroom?: string;
  minBathroom?: string;
  maxBathroom?: string;
  minPlots?: string;
  maxPlots?: string;
  minLandarea?: string;
  maxLandarea?: string;
  useGeoLocation?: boolean;
  createdAt?: string;
  latitude?: number;
  longitude?: number;
  perPage?: number;
  bedType?: string;
  guests?: string;
  viewType?: string;
};

type SearchHistory = {
  country?: string;
  state?: string;
  city?: string;
  latitude: string;
  longitude: string;
};
