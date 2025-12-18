import { getList } from "@/db/queries";
import { useLiveQuery } from "@/hooks/useLiveQuery";
import { mapPropertyList } from "@/lib/utils";

export function useHomeList() {
  const featured = useLiveQuery(() => getList("featured")) ?? [];
  const lands = useLiveQuery(() => getList("lands")) ?? [];
  const latest = useLiveQuery(() => getList("latest")) ?? [];
  const shortlet = useLiveQuery(() => getList("shortlet")) ?? [];
  const nearby = useLiveQuery(() => getList("nearby")) ?? [];

  return {
    featured: mapPropertyList(featured),
    lands: mapPropertyList(lands),
    latest: mapPropertyList(latest),
    shortlet: mapPropertyList(shortlet),
    nearby: mapPropertyList(nearby),
  };
}
