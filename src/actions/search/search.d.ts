type SearchFilters = {
  keyword?: string;
  city?: string;
  state?: string;
  country?: string;
  purpose?: string;
  category?: string;
  subCategory?: string[];
  amenities?: string[];
  minPrice?: string;
  maxPrice?: string;
  minBedroom?: string;
  maxBedroom?: string;
  minBathroom?: string;
  maxBathroom?: string;
  minPlots?: string;
  maxPlots?: string;
  minLandarea?: string;
  maxLandarea?: string;
  bedType?: string;
  guests?: string;
  viewType?: string;
  createdAt?: string;

  // Control flags (NOT DB filters)
  latitude?: number;
  longitude?: number;
  useGeoLocation?: boolean;
};

type SearchHistory = {
  country?: string;
  state?: string;
  city?: string;
  latitude: string;
  longitude: string;
};
