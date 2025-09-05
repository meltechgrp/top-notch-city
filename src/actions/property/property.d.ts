type Result = {
  total: number;
  page: number;
  per_page: number;
  pages: number;
  results: Property[];
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
type CategorySections = {
  name: string;
  id: string;
  data: { name: string; id: string; catId: string }[];
}[];

type PropertyResponse = {
  count: number;
  properties: Property[];
};

type Property = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  created_at: string;
  updated_at: string;
  currency: Currency;
  status: PropertyStatus;
  purpose: PropertyPurpose;
  is_featured: boolean;
  duration?: string;
  category: Category;
  subcategory: SubCategory;
  address: Address;
  media: Media[];
  owner: Owner;
  is_following: boolean;
  amenities: Amenity[];
  interaction: Interaction;
  owner_interaction: Owner_interaction;
  reason_or_comment?: string;
};

type Media = {
  id: string;
  url: string;
  media_type: "IMAGE" | "VIDEO";
};

type Owner = {
  id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  profile_image?: string;
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

type Wishlist = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: Currency;
  status: PropertyStatus;
  purpose: PropertyPurpose;
  category: string;
  subcategory: string;
  // address: Address;
  media: string[];
};

type PropertyStatus =
  | "pending"
  | "approved"
  | "sold"
  | "rejected"
  | "flagged"
  | "expired";

type PropertyPurpose = "rent" | "sell";
type Currency = "ngn" | "usd";

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
