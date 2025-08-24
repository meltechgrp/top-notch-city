import { format } from "date-fns";
import { Fetch } from "../utills";

export async function searchProperties(
  page: number,
  perPage: number,
  filters?: SearchFilters
): Promise<Result> {
  const query = new URLSearchParams();
  if (filters?.keyword) query.append("title", filters.keyword);
  // if (filters?.city) query.append('city', filters.city);
  if (filters?.state) query.append("state", filters.state);
  if (filters?.latitude) query.append("latitude", filters.latitude);
  if (filters?.longitude) query.append("longitude", filters.longitude);
  if (filters?.country) query.append("country", filters.country);
  if (filters?.purpose) query.append("purpose", filters.purpose);
  if (filters?.min_price && filters.min_price !== "No Min")
    query.append("min_price", filters.min_price);
  if (filters?.max_price && filters.max_price !== "No Max")
    query.append("max_price", filters.max_price);
  if (filters?.category && filters.category !== "any")
    query.append("category", filters.category);
  if (filters?.tour) query.append("virtual_tour", "true");
  if (filters?.sub_category) query.append("sub_category", filters.sub_category);
  if (filters?.bedrooms && filters.bedrooms !== "Any")
    query.append("amenities_filter", "Bedrooms");
  if (filters?.bedrooms && filters.bedrooms !== "Any")
    query.append("amenities_value_filter", filters.bedrooms);
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
  query.append("per_page", String(perPage));
  query.append("sort_by", "created_at");
  {
    filters?.use_geo_location &&
      query.append("use_geo_location", filters.use_geo_location);
  }
  query.append("radius_km", "20");
  query.append("sort_order", "desc");
  const path = `/properties/search/?${query.toString()}`;
  console.log(path);
  try {
    const res = await Fetch(path, {});
    if (!res?.results) throw new Error("property not found");
    return res;
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
}
export async function voiceSearchProperties(
  audioUrl?: string
): Promise<Result> {
  console.log(audioUrl, "api");
  const query = new URLSearchParams();
  const formData = new FormData();
  formData.append("voice_file", {
    audioUrl,
    name: "audio.wav",
    type: "audio/wav",
  } as any);

  query.append("sort_by", "created_at");
  query.append("sort_order", "desc");
  console.log(formData);
  try {
    const res = await Fetch("/properties/search/voice", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });
    console.log(res);
    if (!res?.results) throw new Error("property not found");
    return res;
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
}
