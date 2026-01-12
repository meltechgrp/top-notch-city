import { Property } from "@/db/models/properties";
import { composeFullAddress, FindAmenity, generateTitle } from "@/lib/utils";

export function normalizeProperty(p: ServerProperty) {
  try {
    const property = {
      property_server_id: p.id,
      title: generateTitle(p),
      slug: p.slug,
      description: p.description,
      price: p.price,
      currency: p.currency?.code || "NGN",
      status: p.status,
      purpose: p.purpose,
      is_featured: p.is_featured ?? false,
      is_booked: p.is_booked ?? false,
      server_user_id: p.owner.id,
      bed_type: p?.bedType,
      view_type: p?.viewType,
      is_enabled: p?.is_enabled || true,
      caution_fee: p.caution_fee,
      discount: Number(p?.discount || 0),
      thumbnail: p?.media?.find((m) => m.media_type == "IMAGE")?.url,
      guests: Number(p?.guests || 0),
      address: composeFullAddress(p.address),
      duration: p?.duration,
      plots: Number(FindAmenity("Plots", p) || p?.plots || 0),
      bedroom: Number(FindAmenity("Bedroom", p) || p?.bedroom || 0),
      bathroom: Number(FindAmenity("Bathroom", p) || p?.bathroom || 0),
      landarea: Number(FindAmenity("Landarea", p) || p?.landarea || 0),
      category: p?.category?.name || "",
      subcategory: p?.subcategory?.name || "",
      total_reviews: Number(p?.total_reviews || 0),
      avg_rating: Number(p?.avg_rating || 0),
      is_following: p?.is_following || false,
      views: Number(p?.interaction?.viewed ?? 0),
      likes: Number(p?.interaction?.liked ?? 0),
      viewed: p?.owner_interaction?.viewed || false,
      liked: p?.owner_interaction?.liked || false,
      added: p?.owner_interaction?.added_to_wishlist || false,
      street: p.address?.street,
      city: p.address?.city,
      state: p.address?.state,
      country: p.address?.country,
      latitude: p.address.latitude,
      longitude: p.address.longitude,
      sync_status: "synced",
      created_at: Date.parse(p.created_at),
      updated_at: p.updated_at
        ? Date.parse(p.updated_at)
        : new Date().getMilliseconds(),
    };

    const media = (p.media || []).map((m) => ({
      property_server_id: p.id,
      server_image_id: m.id,
      url: m.url,
      media_type: m.media_type,
    }));

    const amenities = (p.amenities || []).map((a) => ({
      property_server_id: p.id,
      amenity_id: a.name,
      name: a.name,
    }));

    const availabilities = (p.availabilities || []).map((a) => ({
      property_server_id: p.id,
      start: Date.parse(a.start),
      end: Date.parse(a.end),
    }));
    const owner = p.owner && {
      server_user_id: p.owner.id,
      slug: p.owner.slug,
      email: p.owner.email,
      first_name: p.owner.first_name,
      last_name: p.owner.last_name,
      role: "agent",
      profile_image: p.owner.profile_image,
      status: "offline",
      views_count: 0,
      likes_count: 0,
      total_properties: 0,
      followers_count: 0,
    };

    const ownership = p?.ownership && {
      property_server_id: p.id,
      listing_role: p?.ownership?.listing_role,
      owner_type: p.ownership?.owner_type,
      owner_user_id: p.ownership?.owner_user_id,
      owner_company_id: p.ownership?.owner_company?.id,
      verification_status: p.ownership?.verification_status,
      verification_note: p.ownership?.verification_note,
    };
    const companies = (p.companies || []).map((a: any) => ({
      property_server_id: p.id,
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
      media,
      amenities,
      ownership,
      owner,
      availabilities,
      companies,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}

export type PropertyDefault = ReturnType<typeof normalizeProperty>;

export function transformServerProperty(data: ServerProperty[]) {
  return data.map((p) => ({
    property_server_id: p.id,
    title: generateTitle(p),
    slug: p.slug,
    description: p.description,
    price: p.price,
    currency: p.currency?.code || "NGN",
    status: p.status,
    purpose: p.purpose,
    is_featured: p.is_featured ?? false,
    is_booked: p.is_booked ?? false,
    server_user_id: p.owner.id,
    bed_type: p?.bedType,
    view_type: p?.viewType,
    is_enabled: p?.is_enabled || true,
    caution_fee: p.caution_fee,
    discount: Number(p?.discount || 0),
    thumbnail: p?.media?.find((m) => m.media_type == "IMAGE")?.url,
    guests: Number(p?.guests || 0),
    address: composeFullAddress(p.address),
    duration: p?.duration,
    plots: Number(FindAmenity("Plots", p) || p?.plots || 0),
    bedroom: Number(FindAmenity("Bedroom", p) || p?.bedroom || 0),
    bathroom: Number(FindAmenity("Bathroom", p) || p?.bathroom || 0),
    landarea: Number(FindAmenity("Landarea", p) || p?.landarea || 0),
    category: p?.category?.name || "",
    subcategory: p?.subcategory?.name || "",
    total_reviews: Number(p?.total_reviews || 0),
    avg_rating: Number(p?.avg_rating || 0),
    is_following: p?.is_following || false,
    views: Number(p?.interaction?.viewed ?? 0),
    likes: Number(p?.interaction?.liked ?? 0),
    viewed: p?.owner_interaction?.viewed || false,
    liked: p?.owner_interaction?.liked || false,
    added: p?.owner_interaction?.added_to_wishlist || false,
    street: p.address?.street,
    city: p.address?.city,
    state: p.address?.state,
    country: p.address?.country,
    latitude: p.address.latitude,
    longitude: p.address.longitude,
    created_at: Date.parse(p.created_at),
  })) as unknown as Property[];
}
