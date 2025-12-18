import { getCategories, getFeatured, getNearby } from "@/db/queries";
import useGetLocation from "@/hooks/useGetLocation";
import { useLiveQuery } from "@/hooks/useLiveQuery";
import { mapPropertyList } from "@/lib/utils";

export function useHomeList() {
  const { location } = useGetLocation();
  const featured = useLiveQuery(() => getFeatured({})) ?? [];
  const lands =
    useLiveQuery(() => getCategories({ categories: ["Land"] })) ?? [];
  const latest =
    useLiveQuery(() =>
      getCategories({ categories: ["Commercial", "Residential"] })
    ) ?? [];
  const shortlet =
    useLiveQuery(() => getCategories({ categories: ["Shortlet", "Hotel"] })) ??
    [];
  const nearby = location
    ? useLiveQuery(() =>
        getNearby({ lat: location.latitude, long: location.longitude })
      )
    : null;

  return {
    featured: mapPropertyList(featured),
    lands: mapPropertyList(lands),
    latest: mapPropertyList(latest),
    shortlet: mapPropertyList(shortlet),
    nearby: nearby ? mapPropertyList(nearby) : [],
  };
}
