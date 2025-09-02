import { generateMediaUrl } from "@/lib/api";
import { composeFullAddress, generateTitle } from "@/lib/utils";
import { useStore } from "@/store";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import { useEffect, useMemo } from "react";

export function useReels() {
  const { data, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfinityQueries({ type: "reels" });

  const { reels, setReels } = useStore();

  const properties = useMemo(
    () => data?.pages.flatMap((page) => page.results) || [],
    [data]
  );

  const videos = useMemo(() => {
    return properties
      .map((p) => {
        let v = p.media.find((m) => m.media_type === "VIDEO");
        if (v) {
          return {
            id: p.id,
            uri: generateMediaUrl(v).uri,
            title: generateTitle(p),
            description: p.description || "",
            interations: p.interaction,
            owner_interaction: p.owner_interaction,
            created_at: p.created_at,
            owner: p?.owner,
            price: p.price,
            location: composeFullAddress(p.address, false, "short"),
            purpose: p.purpose,
          };
        }
      })
      .filter((p) => !!p);
  }, [properties]);

  // Sync Zustand when data changes
  useEffect(() => {
    if (videos.length > 0) {
      setReels(videos);
    }
  }, [videos]);

  return {
    reels,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
