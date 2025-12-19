import { useQuery } from "@tanstack/react-query";
import { syncPropertyLists } from "@/db/sync/properties";
import { searchProperties } from "@/actions/search";
import { useDbStore } from "@/store/dbStore";
import { useEffect } from "react";
import { shouldSync } from "@/hooks/useLiveQuery";
import { normalizePropertyList } from "@/db/normalizers/property";
import { clearAllData } from "@/db";

export function useHomeSync() {
  const { lastSync, load, update } = useDbStore();
  useEffect(() => {
    load();
  }, []);
  const enabled = shouldSync(lastSync);
  const { refetch, error } = useQuery({
    queryKey: ["sync-home-sync"],
    queryFn: async () => {
      await clearAllData();
      const res = await searchProperties(1, 100, {
        country: "Nigeria",
        useGeoLocation: false,
      });
      const data = res.results?.map((p) => normalizePropertyList(p));
      await syncPropertyLists(data);
      await update();
      return true;
    },
    enabled,
  });
  return { refetch };
}
