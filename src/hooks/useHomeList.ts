import {
  getCategories,
  getFeatured,
  getNearby,
} from "@/db/queries/property-list";
import useGetLocation from "@/hooks/useGetLocation";
import { useLiveQuery } from "@/hooks/useLiveQuery";
import { mapPropertyList } from "@/lib/utils";

export function useHomeList(limit?: number) {
  const { location } = useGetLocation();
  const { data: featured } =
    useLiveQuery(() => getFeatured({}), ["featured"]) ?? [];
  const { data: lands } =
    useLiveQuery(() => getCategories({ categories: ["Land"] })) ?? [];
  const { data: latest } =
    useLiveQuery(
      () => getCategories({ categories: ["Commercial", "Residential"] }),
      ["Commercial", "Residential"]
    ) ?? [];
  const { data: shortlet } =
    useLiveQuery(
      () => getCategories({ categories: ["Shortlet", "Hotel"] }),
      ["Shortlet", "Hotel"]
    ) ?? [];
  const { data: nearby } = useLiveQuery(
    () =>
      location
        ? getNearby({
            lat: location.latitude,
            long: location.longitude,
            limit: limit || 10,
          })
        : Promise.resolve([]),
    [location?.latitude, location?.longitude]
  );

  return {
    featured: featured ? mapPropertyList(featured) : [],
    lands: lands ? mapPropertyList(lands) : [],
    latest: latest ? mapPropertyList(latest) : [],
    shortlet: shortlet ? mapPropertyList(shortlet) : [],
    nearby: nearby ? mapPropertyList(nearby) : [],
  };
}
