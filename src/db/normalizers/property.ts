import { FindAmenity, generateTitle } from "@/lib/utils";
export function normalizeProperty(api: Property) {
  const property = {
    id: api.id,
    title: generateTitle(api),
    slug: api.slug,
    description: api.description,
    price: api.price,
    currencyCode: api.currency?.code,
    status: api.status,
    purpose: api.purpose,
    isFeatured: api.is_featured,
    duration: api.duration?.toString(),
    bedroom: FindAmenity("Bedroom", api),
    bathroom: FindAmenity("Bathroom", api),
    landarea: FindAmenity("Landarea", api),
    bedType: api.bedType,
    guests: api.guests,
    plots: api.plots,
    viewType: api.viewType,
    isBooked: api.is_booked,
    discount: api.discount,
    cautionFee: api.caution_fee?.toString(),
    createdAt: api.created_at,
    updatedAt: api.updated_at,
    syncedAt: new Date().toISOString(),
    version: Date.now(),
    deletedAt: null,
  };

  const category = api.category && {
    id: api.category.id,
    name: api.category.name,
    slug: api.category.name.toLowerCase(),
  };

  const subcategory = api.subcategory && {
    id: api.subcategory.id,
    name: api.subcategory.name,
    slug: api.subcategory.name.toLowerCase(),
    categoryId: api.category.id,
  };

  const address = api.address && {
    propertyId: api.id,
    street: api.address.street,
    city: api.address.city,
    state: api.address.state,
    country: api.address.country,
    latitude: api.address.latitude,
    longitude: api.address.longitude,
  };

  const media = (api.media || []).map((m: Media) => ({
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
    amenityName: a.name,
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
    propertyId: api.id,
    listingRole: api.ownership.listing_role,
    ownerType: api.ownership.owner_type,
    verificationStatus: api.ownership.verification_status,
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
  const availabilities = (api.amenities || []).map((a: any) => ({
    propertyId: api.id,
    id: a.id,
    start: a.start,
    end: a.end,
  }));

  return {
    property,
    category,
    subcategory,
    address,
    media,
    amenities,
    propertyAmenities,
    interaction,
    ownerInteraction,
    ownership,
    owner,
    availabilities,
  };
}
