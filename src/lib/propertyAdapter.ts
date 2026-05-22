import { composeFullAddress } from "@/lib/utils";

export type UiProperty = {
  id: string;
  property_server_id: string;
  title: string;
  slug: string;
  description?: string | null;
  price: number;
  currency: string;
  status: string;
  purpose: string;
  is_featured: boolean;
  is_booked?: boolean;
  server_user_id: string;
  bed_type?: string;
  view_type?: string;
  is_enabled?: boolean;
  caution_fee?: number | string;
  discount?: number;
  thumbnail?: string;
  guests?: number;
  address: string;
  duration?: string;
  plots: number;
  bedroom: number;
  bathroom: number;
  landarea: number;
  category: string;
  subcategory: string;
  total_reviews?: number;
  avg_rating?: number;
  views: number;
  likes: number;
  viewed: boolean;
  liked: boolean;
  added: boolean;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  created_at: number;
  updated_at?: number;
  media: Media[];
  amenities: Amenity[];
  owner?: Owner;
  availabilities: Availabilities[];
  companies?: Company[];
  raw: ServerProperty;
};

function numberValue(value: unknown) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function amenityValue(property: ServerProperty, key: string) {
  return property.amenities?.find((a) => a.name === key)?.value;
}

export function getPropertyTitle(
  property?: Pick<ServerProperty, "title"> | null,
) {
  return property?.title?.trim() || "Untitled property";
}

export function toUiProperty(property: ServerProperty): UiProperty {
  const media = property.media || [];
  const address = property.address || ({} as Address);

  return {
    id: property.id,
    property_server_id: property.id,
    title: getPropertyTitle(property),
    slug: property.slug,
    description: property.description,
    price: property.price,
    currency: property.currency?.code || "NGN",
    status: property.status,
    purpose: property.purpose,
    is_featured: property.is_featured ?? false,
    is_booked: property.is_booked ?? false,
    server_user_id: property.owner?.id,
    bed_type: property.bedType,
    view_type: property.viewType,
    is_enabled: property.is_enabled,
    caution_fee: property.caution_fee,
    discount: numberValue(property.discount),
    thumbnail: media.find((m) => m.media_type === "IMAGE")?.url,
    guests: numberValue(property.guests),
    address: composeFullAddress(address),
    duration: property.duration,
    plots: numberValue(amenityValue(property, "Plots") || property.plots),
    bedroom: numberValue(amenityValue(property, "Bedroom") || property.bedroom),
    bathroom: numberValue(
      amenityValue(property, "Bathroom") || property.bathroom,
    ),
    landarea: numberValue(
      amenityValue(property, "Landarea") || property.landarea,
    ),
    category: property.category?.name || "",
    subcategory: property.subcategory?.name || "",
    total_reviews: numberValue(property.total_reviews),
    avg_rating: numberValue(property.avg_rating),
    views: numberValue(property.interaction?.viewed),
    likes: numberValue(property.interaction?.liked),
    viewed: property.owner_interaction?.viewed || false,
    liked: property.owner_interaction?.liked || false,
    added: property.owner_interaction?.added_to_wishlist || false,
    street: address.street,
    city: address.city,
    state: address.state,
    country: address.country,
    latitude: address.latitude,
    longitude: address.longitude,
    created_at: Date.parse(property.created_at),
    updated_at: property.updated_at
      ? Date.parse(property.updated_at)
      : undefined,
    media,
    amenities: property.amenities || [],
    owner: property.owner,
    availabilities: property.availabilities || [],
    companies: property.companies,
    raw: property,
  };
}

export function toUiProperties(
  properties: Array<ServerProperty | undefined> = [],
) {
  return properties.filter(Boolean).map((property) => toUiProperty(property!));
}

export function emptyPropertyResult(page = 1, perPage = 20): Result {
  return {
    total: 0,
    page,
    per_page: perPage,
    pages: 1,
    results: [],
  };
}
