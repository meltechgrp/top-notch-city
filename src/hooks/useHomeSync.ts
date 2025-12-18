import { useQuery } from "@tanstack/react-query";
import {
  fetchFeaturedProperties,
  fetchTrendingLandsProperties,
  fetchShortletProperties,
  fetchProperties,
} from "@/actions/property/list";
import { syncProperties } from "@/db/sync/properties";
import { searchProperties } from "@/actions/search";
import { useStore } from "@/store";
import { useShallow } from "zustand/react/shallow";
import { useDbStore } from "@/store/dbStore";
import { useEffect } from "react";
import { shouldSync } from "@/hooks/useLiveQuery";

export function useHomeSync() {
  const location = useStore(useShallow((s) => s.location));
  const { lastSync, load, update } = useDbStore();

  useEffect(() => {
    load();
  }, []);
  const enabled = false;
  useQuery({
    queryKey: ["home-sync"],
    enabled,
    staleTime: Infinity,
    queryFn: async () => {
      const [featured, lands, shortlet, latest] = await Promise.all([
        fetchFeaturedProperties({ pageParam: 1, perPage: 20 }),
        fetchTrendingLandsProperties({ pageParam: 1, perPage: 10 }),
        fetchShortletProperties({ pageParam: 1, perPage: 10 }),
        fetchProperties({ pageParam: 1, perPage: 10 }),
      ]);

      await Promise.all([
        syncProperties("featured", featured.results),
        syncProperties("lands", lands.results),
        syncProperties("shortlet", shortlet.results),
        syncProperties("latest", latest.results),
      ]);

      await update();
      return true;
    },
  });

  useQuery({
    queryKey: ["sync-nearby"],
    queryFn: async () => {
      const res = await searchProperties(1, 30, {
        latitude: location?.latitude?.toString(),
        longitude: location?.longitude?.toString(),
      });
      await syncProperties("nearby", res.results);
      await update();
      return true;
    },
    enabled: enabled && !!location?.latitude && !!location?.longitude,
  });
}
