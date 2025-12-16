type SearchFilters = {
  keyword?: string;
  city?: string;
  state?: string;
  country?: string;
  purpose?: string;
  min_price?: string;
  max_price?: string;
  category?: string;
  sub_category?: string[];
  amenities?: string[];
  min_bedroom?: string;
  max_bedroom?: string;
  min_bathroom?: string;
  max_bathroom?: string;
  min_plots?: string;
  max_plots?: string;
  min_landarea?: string;
  max_landarea?: string;
  use_geo_location?: string;
  createdAt?: string;
  tour?: string;
  latitude?: string;
  longitude?: sttring;
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
