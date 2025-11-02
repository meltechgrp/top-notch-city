import { Fetch } from "../utills";

const API_KEY = process.env.EXPO_PUBLIC_ANDROID_MAPS_API_KEY;

export async function fetchProperty({ id }: { id: string }) {
  try {
    const res = await Fetch(`/properties/${id}`, {});

    if (res?.detail) {
      throw new Error("Failed to fetch property");
    }

    return res as Property;
  } catch (error) {
    throw new Error("Failed to fetch property");
  }
}
export async function fetchWishlist() {
  try {
    const res = await Fetch(`/mywhishlist`, {});
    if (res?.detail) {
      throw new Error("Failed to fetch wishlist");
    }

    return res as Wishlist[];
  } catch (error) {
    throw new Error("Failed to fetch wishlist");
  }
}

const GEOAPIFY_API_KEY = "438412e74fa84ff7ac9693e83e9ff154";
const BASE_URL = "https://api.geoapify.com/v2/places";

export async function getNearbyPlaces(
  options: GetNearbyOptions
): Promise<NearbyPOI[]> {
  const { latitude, longitude, radiusMeters = 1000, limit = 10 } = options;
  if (!latitude || !longitude) return [];
  const categories: POICategory[] = [
    "religion",
    "education",
    "catering",
    "healthcare",
    "commercial",
  ];

  const fetchPlacesByCategory = async (
    category: POICategory
  ): Promise<NearbyPOI[]> => {
    const url = new URL(BASE_URL);
    url.searchParams.append("categories", category);
    url.searchParams.append(
      "filter",
      `circle:${longitude},${latitude},${radiusMeters}`
    );
    url.searchParams.append("limit", limit.toString());
    url.searchParams.append("apiKey", GEOAPIFY_API_KEY);

    try {
      const response = await fetch(url.toString());
      if (!response.ok) {
        console.error(`Failed to fetch ${category}:`, response.statusText);
        return [];
      }

      const data = (await response.json()) as GeoapifyPlacesResponse;
      return (
        data?.features?.map((f: GeoapifyPlaceFeature) => ({
          name: f.properties.name ?? "Unnamed Place",
          lat: f.properties.lat,
          lon: f.properties.lon,
          address:
            f.properties.formatted ??
            f.properties.address_line1 ??
            "Address unavailable",
          category,
        })) ?? []
      );
    } catch (error) {
      console.error(`Error fetching ${category}:`, error);
      return [];
    }
  };

  const allResults = await Promise.all(categories.map(fetchPlacesByCategory));
  return allResults.flat();
}

export async function addToWishList({ id }: { id: string }) {
  try {
    const res = await Fetch(`/properties/${id}/wishlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ property_id: id }),
    });

    if (res?.detail) {
      throw new Error("Failed to add wishlist item");
    }

    return res;
  } catch (error) {
    throw new Error("Failed to add wishlist item");
  }
}
export async function removeFromWishList({ id }: { id: string }) {
  try {
    const res = await Fetch(`/remove/${id}`, {
      method: "DELETE",
    });

    if (res?.detail) {
      throw new Error("Failed to remove wishlist item");
    }
    return res;
  } catch (error) {
    throw new Error("Failed to remove wishlist item");
  }
}
export async function likeProperty({ id }: { id: string }) {
  try {
    const res = await Fetch(`/properties/${id}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ property_id: id }),
    });
    return res;
  } catch (error) {
    throw new Error("Failed to like");
  }
}

export async function viewProperty({ id }: { id: string }) {
  try {
    const res = await Fetch(`/properties/${id}/view`, {
      method: "POST",
    });
    return res;
  } catch (error) {
    throw new Error("Failed to view");
  }
}
