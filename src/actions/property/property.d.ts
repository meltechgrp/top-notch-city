type Result = {
  total: number;
  page: number;
  per_page: number;
  pages: number;
  results: ServerProperty[];
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

type SubCategory = {
  category: Category;
  id: string;
  name: string;
  slug: string;
};
type CategorySections = {
  name: string;
  id: string;
  data: { name: string; id: string; catId: string }[];
}[];

type PropertyResponse = {
  count: number;
  properties: ServerProperty[];
};

type ServerProperty = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  created_at: string;
  updated_at: string;
  currency: Currency;
  status: PropertyStatus;
  purpose: PropertyPurpose;
  is_featured: boolean;
  is_enabled: boolean;
  duration?: string;
  category: Category;
  subcategory: SubCategory;
  address: Address;
  media: Media[];
  bathroom?: string;
  bedroom?: string;
  is_booked?: boolean;
  total_reviews?: number;
  avg_rating?: number;
  landarea?: number;
  bedType?: string;
  guests?: string;
  plots?: string;
  viewType?: string;
  companies?: Company[];
  discount?: string;
  listing_role?: string;
  owner_type?: string;
  caution_fee?: string;
  owner: Owner;
  ownership: Ownership;
  availabilities: Availabilities[];
  is_following: boolean;
  amenities: Amenity[];
  interaction: Interaction;
  owner_interaction: Owner_interaction;
  reason_or_comment?: string;
};

type Media = {
  id: string;
  url: string;
  media_type: "IMAGE" | "VIDEO" | "AUDIO";
  is_local?: boolean;
};

type Availabilities = {
  id: string;
  start: string;
  end: string;
};

type Owner = {
  id: string;
  email: string;
  slug: string;
  phone: string;
  first_name: string;
  last_name: string;
  profile_image?: string;
};

type ListingRole = "agent" | "manager" | "onwer";
type OwnerType =
  | "individual"
  | "company"
  | "property_manager"
  | "hotel_operator";

type Ownership = {
  id: string;
  listing_role: ListingRole;
  owner_type: OwnerType;
  owner_user_id: string;
  owner_company: Company;
  verification_status: "not_required" | "required";
  verification_note: string | null;
  documents: Documents[];
  created_at: string;
  updated_at: string | null;
};

type Documents = {
  id: string;
  document_type: "image" | "pdf";
  file_url: string;
  uploaded_at: string;
};

type Amenity = {
  name: string;
  icon: string;
  value: string;
};

type Interaction = {
  viewed: number;
  liked: number;
  added_to_wishlist: number;
};

type Owner_interaction = {
  viewed: boolean;
  liked: boolean;
  added_to_wishlist: boolean;
};

type Place = {
  name: string;
  vicinity: string;
};

type FlatCategoryItem = { type: "category"; id: string; name: string };
type FlatSubcategoryItem = {
  type: "subcategory";
  id: string;
  name: string;
  categoryId: string;
};
type FlatItem = FlatCategoryItem | FlatSubcategoryItem;

type PropertyStatus =
  | "pending"
  | "approved"
  | "sold"
  | "rejected"
  | "flagged"
  | "expired"
  | "featured";

type PropertyPurpose = "rent" | "sell";

type TopLocation = {
  state: string;
  property_count: number;
  property_image: string;
  longitude: string;
  latitude: string;
};

type AmenityLabel = {
  name: string;
  type: string;
  id: string;
  category: string;
};

type POICategory =
  | "religion"
  | "education"
  | "catering"
  | "commercial"
  | "healthcare";

interface NearbyPOI {
  name: string;
  lat: number;
  lon: number;
  address: string;
  category: POICategory;
}

interface GetNearbyOptions {
  latitude?: number | string;
  longitude?: number | string;
  radiusMeters?: number;
  limit?: number;
}

interface GeoapifyPlacesResponse {
  type: "FeatureCollection";
  features: GeoapifyPlaceFeature[];
}

interface GeoapifyPlaceFeature {
  type: "Feature";
  properties: GeoapifyPlaceProperties;
  geometry: GeoapifyGeometry;
}

interface GeoapifyPlaceProperties {
  name?: string;
  country?: string;
  country_code?: string;
  state?: string;
  county?: string;
  city?: string;
  postcode?: string | number;
  street?: string;
  housenumber?: string | number;
  iso3166_2?: string;
  lon: number;
  lat: number;
  formatted?: string;
  address_line1?: string;
  address_line2?: string;
  categories?: string[];
  details?: string[];
  datasource?: {
    sourcename: string;
    attribution: string;
    license: string;
    url?: string;
    raw?: Record<string, any>;
  };
  website?: string;
  description?: string;
  contact?: {
    email?: string;
    [key: string]: any;
  };
  building?: {
    type?: string;
    [key: string]: any;
  };
  place_id: string;
  [key: string]: any;
}

interface GeoapifyGeometry {
  type: "Point";
  coordinates: [number, number];
}

interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
}

interface ViewType {
  id: string;
  name: string;
}
interface BedType {
  id: string;
  name: string;
}
