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
  use_geo_location?: string;
  createdAt?: string;
  tour?: string;
  latitude?: string;
  longitude?: sttring;
  perPage?: number;
};
type CustomFilters = {
  keyword?: string;
  city?: string;
  state?: string;
  country?: string;
  purpose?: string;
  min_price?: string;
  max_price?: string;
  category?: string;
  sub_category?: string;
  amenities?: string[];
  bedrooms?: string;
  bathrooms?: string;
  use_geo_location?: string;
  createdAt?: string;
  tour?: string;
  latitude?: string;
  longitude?: sttring;
};

type SearchHistory = {
  country?: string;
  state?: string;
  city?: string;
  latitude: string;
  longitude: string;
};
