import { format } from "date-fns";
import { Fetch } from "../utills";

export async function searchProperties(
  page: number,
  perPage: number,
  filters?: SearchFilters
): Promise<Result> {
  const query = new URLSearchParams();
  if (filters?.keyword) query.append("title", filters.keyword);
  // if (filters?.city) query.append("city", filters.city);
  // if (filters?.state) query.append("state", filters.state);
  if (filters?.latitude) query.append("latitude", filters.latitude);
  if (filters?.longitude) query.append("longitude", filters.longitude);
  // if (filters?.country) query.append("country", filters.country);
  if (filters?.purpose) query.append("purpose", filters.purpose);
  if (filters?.min_price && filters.min_price !== "No min")
    query.append("min_price", filters.min_price);
  if (filters?.max_price && filters.max_price !== "No max")
    query.append("max_price", filters.max_price);
  if (filters?.category) query.append("category", filters.category);
  if (filters?.tour) query.append("virtual_tour", "true");
  filters?.sub_category?.forEach((sub) => {
    query.append("sub_category", sub);
  });
  if (filters?.min_bedroom && filters.min_bedroom !== "No min")
    query.append("min_bedroom", filters.min_bedroom);
  if (filters?.max_bedroom && filters.max_bedroom !== "No max")
    query.append("max_bedroom", filters.max_bedroom);
  if (filters?.min_bathroom && filters.min_bathroom !== "No min")
    query.append("min_bathroom", filters.min_bathroom);
  if (filters?.max_bathroom && filters.max_bathroom !== "No max")
    query.append("max_bathroom", filters.max_bathroom);
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
  query.append("per_page", "90");
  query.append("sort_by", "created_at");
  query.append("use_geo_location", "true");
  query.append("radius_km", "20");
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

  query.append("sort_by", "created_at");
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
