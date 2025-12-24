type Result = {
  total: number;
  page: number;
  per_page: number;
  pages: number;
  results: any[];
  user_location?: LocationData;
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

type PropertyResponse = {
  count: number;
  properties: Property[];
};

type Property = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  createdAt: string;
  updatedAt: string;
  currency: string;
  status: PropertyStatus;
  purpose: PropertyPurpose;
  isFeatured: boolean;
  duration?: string;
  category: string;
  subCategory: string;
  displayAddress: string;
  address: Address;
  media: Media[];
  totalReviews: number;
  ownerId: string;
  avgRating: number;
  bathroom?: string;
  bedroom?: string;
  isBooked?: boolean;
  landarea?: number;
  bedType?: string;
  guests?: string;
  plots?: string;
  viewType?: string;
  companies?: Company[];
  discount?: string;
  cautionFee?: string;
  owner: Owner;
  ownership: Ownership;
  availabilities: Availabilities[];
  isFollowing: boolean;
  amenities: Amenity[];
  views: number;
  likes: number;
  viewed: number;
  liked: number;
  added: number;
};
type PropertyList = {
  id: string;
  title: string;
  slug: string;
  price: number;
  currency: string;
  status: PropertyStatus;
  purpose: PropertyPurpose;
  bathroom?: string;
  bedroom?: string;
  plots?: string;
  isBooked?: boolean;
  landarea?: number;
  category: string;
  ownerId: string;
  address: string;
  latitude: number;
  longitude: number;
  thumbnail: string | null;
  views: number | null;
  likes: number | null;
  liked: boolean | null;
  description?: string;
  createdAt: string;
};

type Media = {
  id: string;
  url: string;
  mediaType: "IMAGE" | "VIDEO" | "AUDIO";
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
  firstName: string;
  lastName: string;
  profileImage?: string;
};

type ListingRole = "agent" | "manager" | "onwer";
type OwnerType =
  | "individual"
  | "company"
  | "property_manager"
  | "hotel_operator";

type Documents = {
  id: string;
  document_type: "image" | "pdf";
  file_url: string;
  uploaded_at: string;
};

type Ownership = {
  id: string;
  listingRole: ListingRole;
  ownerType: OwnerType;
  ownerCompany: Company;
  verificationStatus: "not_required" | "required";
  verificationNote: string | null;
  documents: Documents[];
  createdAt: string;
  updatedAt: string | null;
};

type Amenity = {
  id: string;
  name: string;
};

type Interaction = {
  viewed: number;
  liked: number;
  addedToWishlist: number;
};

type OwnerInteraction = {
  viewed: boolean;
  liked: boolean;
  added_to_wishlist: number;
};

type Place = {
  name: string;
  vicinity: string;
};

type PropertyStatus =
  | "pending"
  | "approved"
  | "sold"
  | "rejected"
  | "flagged"
  | "expired"
  | "featured";

type PropertyPurpose = "rent" | "sell";

type CategorySections = {
  name: string;
  id: string;
  data: { name: string; id: string; catId: string }[];
}[];

type FlatCategoryItem = { type: "category"; id: string; name: string };
type FlatSubcategoryItem = {
  type: "subcategory";
  id: string;
  name: string;
  categoryId: string;
};
type FlatItem = FlatCategoryItem | FlatSubcategoryItem;

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
