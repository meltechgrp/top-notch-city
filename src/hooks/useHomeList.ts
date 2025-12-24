import {
  getCategories,
  getFeatured,
  getNearby,
} from "@/db/queries/property-list";
import useGetLocation from "@/hooks/useGetLocation";
import React from "react";

export function useHomeList(limit: number = 10) {
  const { location } = useGetLocation();

  const featuredQuery = React.useCallback(
    () => getFeatured({ limit }),
    [limit]
  );

  const landsQuery = React.useCallback(
    () => getCategories({ categories: ["Land"], limit }),
    [limit]
  );

  const latestQuery = React.useCallback(
    () => getCategories({ categories: ["Commercial", "Residential"], limit }),
    [limit]
  );

  const shortletQuery = React.useCallback(
    () => getCategories({ categories: ["Shortlet", "Hotel"], limit }),
    [limit]
  );

  const nearbyQuery = React.useCallback(() => {
    if (!location) return Promise.resolve([]);
    return getNearby({
      lat: location.latitude,
      long: location.longitude,
      limit: limit || 10,
    });
  }, [location?.latitude, location?.longitude, limit]);

  return {
    featured: featuredQuery(),
    lands: landsQuery(),
    latest: latestQuery(),
    shortlet: shortletQuery(),
    nearby: nearbyQuery(),
    isLoading: false,
  };
}
