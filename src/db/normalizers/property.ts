import { composeFullAddress, FindAmenity, generateTitle } from "@/lib/utils";
export function normalizePropertyList(api: any) {
  const property = {
    id: api.id,
    title: generateTitle(api) || "",
    slug: api?.slug || "",
    description: api?.description,
    price: api.price || 0,
    currencyCode: api?.currency?.code || "NGN",
    status: api.status || "pending",
    purpose: api.purpose,
    isFeatured: api.is_featured,
    duration: api.duration?.toString(),
    bedroom: FindAmenity("Bedroom", api),
    bathroom: FindAmenity("Bathroom", api),
    landarea: FindAmenity("Landarea", api),
    ownerId: api.owner?.id || "",
    displayAddress:
      api?.address?.display_address || composeFullAddress(api.address) || "",
    bedType: api.bedType,
    guests: api.guests,
    plots: api.plots,
    viewType: api.viewType,
    isBooked: api.is_booked,
    category: api?.category?.name || "",
    subCategory: api?.subcategory?.name || "",
    discount: api.discount,
    cautionFee: api.caution_fee?.toString(),
    createdAt: api.created_at,
    updatedAt: api.updated_at,
    totalReviews: api?.total_reviews,
    avgRating: api?.avg_rating,
    syncedAt: new Date().toISOString(),
    version: Date.now(),
    deletedAt: null,
  };

  const address = api.address && {
    id: api.id,
    street: api.address.street,
    city: api.address.city,
    state: api.address.state,
    country: api.address.country,
    latitude: api.address.latitude,
    longitude: api.address.longitude,
    displayAddress:
      api?.address?.display_address || composeFullAddress(api.address) || "",
  };

  const media = (api.media || []).map((m: any) => ({
    id: m.id,
    propertyId: api.id,
    url: m.url,
    mediaType: m.media_type,
  }));

  const amenities = (api.amenities || []).map((a: Amenity) => ({
    id: a.id,
    name: a.name,
  }));

  const propertyAmenities = (api.amenities || []).map((a: any) => ({
    propertyId: api.id,
    amenityId: a.id,
  }));

  const interaction = api.interaction && {
    propertyId: api.id,
    viewed: api.interaction.viewed ?? 0,
    liked: api.interaction.liked ?? 0,
    addedToWishlist: api.interaction.added_to_wishlist ?? 0,
  };

  const ownerInteraction = api.owner_interaction && {
    propertyId: api.id,
    viewed: api.owner_interaction.viewed,
    liked: api.owner_interaction.liked,
    addedToWishlist: api.owner_interaction.added_to_wishlist,
  };
  const ownership = api.ownership && {
    id: api.id,
    listingRole: api.ownership?.listing_role,
    ownerType: api.ownership?.owner_type,
    verificationStatus: api.ownership?.verification_status,
    verificationNote: api.ownership?.verificationNote,
  };
  const owner = api.owner && {
    propertyId: api.id,
    id: api.owner.id,
    slug: api.owner.slug,
    email: api.owner.email,
    phone: api.owner.phone,
    firstName: api.owner.first_name,
    lastName: api.owner.last_name,
    profileImage: api.owner.profile_image,
  };
  const availabilities = (api.availabilities || []).map((a: any) => ({
    propertyId: api.id,
    id: a.id,
    start: a.start,
    end: a.end,
  }));
  const reviews = (api.reviews || []).map((a: any) => ({
    id: a.id,
    reviewerId: a.reviewer.id,
    targetId: a.id,
    targetType: "property",
    rating: a.rating,
    comment: a?.comment,
    createdAt: a.created_at,
    updatedAt: a?.updated_at,
  }));
  const companies = (api.companies || []).map((a: any) => ({
    id: a.id,
    name: a?.name,
    verified: a?.verified,
    address: a?.address,
    website: a?.website,
    email: a?.email,
    phone: a?.phone,
    description: a?.description,
  }));

  return {
    property,
    address,
    media,
    amenities,
    propertyAmenities,
    interaction,
    ownerInteraction,
    ownership,
    owner,
    availabilities,
    reviews,
    companies,
  };
}
