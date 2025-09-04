import { Fetch } from "../utills";

// 🏠 Fetch all top locations
export async function fetchTopLocations() {
  try {
    const res = await Fetch(`/top/state`, {});
    if (res?.detail) throw new Error("Failed to top locations");
    return res as TopLocation[];
  } catch (error) {
    throw new Error("Failed to top locations");
  }
}

export async function fetchLocationProperties({
  pageParam,
  state,
}: {
  pageParam: number;
  state?: string;
}) {
  try {
    const res = await Fetch(`/properties/state/${state}?page=${pageParam}`, {});
    if (res?.detail) throw new Error("Failed to fetch location data");
    return res as Result;
  } catch (error) {
    throw new Error("Failed to fetch location data");
  }
}
