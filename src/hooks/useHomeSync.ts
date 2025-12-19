import { useQuery } from "@tanstack/react-query";
import { syncPropertyLists } from "@/db/sync/properties";
import { searchProperties } from "@/actions/search";
import { useDbStore } from "@/store/dbStore";
import { useEffect } from "react";
import { shouldSync } from "@/hooks/useLiveQuery";
import { normalizePropertyList } from "@/db/normalizers/property";
import { clearAllData } from "@/db";
import { getActiveAccount } from "@/lib/secureStore";

export function useHomeSync() {
  const { lastSync, load, update } = useDbStore();
  useEffect(() => {
    load();
  }, []);
  const enabled = shouldSync(lastSync);
  const { refetch: refetchProperties } = useQuery({
    queryKey: ["sync-home-sync"],
    queryFn: async () => {
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
  const { refetch: refetchMe } = useQuery({
    queryKey: ["sync-user-sync"],
    queryFn: async () => {
      const currentUser = await getActiveAccount();
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
  const refetch = () => {
    refetchProperties();
    refetchMe();
  };
  return { refetch };
}
