import { format } from "date-fns";
import { Fetch } from "../utills";

export async function searchProperties(
  page: number,
  perPage: number,
  filters?: SearchFilters,
  updated_after?: number
): Promise<Result> {
  const query = new URLSearchParams();
  // if (filters?.city) query.append("city", filters.city);
  // if (filters?.state) query.append("state", filters.state);
  if (filters?.latitude) query.append("latitude", String(filters.latitude));
  if (filters?.longitude) query.append("longitude", String(filters.longitude));
  if (filters?.country) query.append("country", filters.country);
  if (filters?.purpose) query.append("purpose", filters.purpose);
  if (filters?.viewType) query.append("viewType", filters.viewType);
  if (filters?.bedType) query.append("bedType", filters.bedType);
  if (filters?.guests) query.append("guests", filters.guests);
  if (filters?.minPrice && filters.minPrice !== "No min")
    query.append("min_price", filters.minPrice);
  if (filters?.maxPrice && filters.maxPrice !== "No max")
    query.append("max_price", filters.maxPrice);
  if (filters?.category) query.append("category", filters.category);
  filters?.subCategory?.forEach((sub) => {
    query.append("sub_category", sub);
  });
  if (filters?.minBedroom && filters.minBedroom !== "No min")
    query.append("min_bedroom", filters.minBedroom);
  if (filters?.maxBedroom && filters.maxBedroom !== "No max")
    query.append("max_bedroom", filters.maxBedroom);
  if (filters?.minBathroom && filters.minBathroom !== "No min")
    query.append("min_bathroom", filters.minBathroom);
  if (filters?.maxBathroom && filters.maxBathroom !== "No max")
    query.append("max_bathroom", filters.maxBathroom);
  if (filters?.minPlots && filters.minPlots !== "No min")
    query.append("min_plots", filters.minPlots);
  if (filters?.maxPlots && filters.maxPlots !== "No max")
    query.append("max_plots", filters.maxPlots);
  if (filters?.minLandarea && filters.minLandarea !== "No min")
    query.append("min_landarea", filters.minLandarea);
  if (filters?.maxLandarea && filters.maxLandarea !== "No max")
    query.append("max_landarea", filters.maxLandarea);
  if (filters?.createdAt && filters.createdAt !== "any")
    query.append(
      "created_at",
      format(new Date(filters.createdAt), "yyyy-MM-dd")
    );
  if (filters?.amenities?.length) {
    filters?.amenities.forEach((amenity) =>
      query.append("amenities_filter", amenity)
    );
  }

  query.append("page", String(page));
  query.append("per_page", "99");
  query.append("sortBy", "created_at");
  query.append("use_geo_location", String(filters?.useGeoLocation) || "true");
  query.append("radius_km", "100");
  query.append("sort_order", "desc");
  const path = `/properties/search/?${query.toString()}`;
  try {
    const res = await Fetch(path, {});
    if (!res?.results) throw new Error("property not found");
    return res;
  } catch (error) {
    throw error;
  }
}
export async function voiceSearchProperties(
  audioUrl?: string
): Promise<Result> {
  const query = new URLSearchParams();
  const formData = new FormData();
  formData.append("voice_file", {
    audioUrl,
    name: "audio.wav",
    type: "audio/wav",
  } as any);

  query.append("sortBy", "created_at");
  query.append("sort_order", "desc");
  try {
    const res = await Fetch("/properties/search/voice", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });

    if (!res?.results) throw new Error("property not found");
    return res;
  } catch (error) {
    throw error;
  }
}
