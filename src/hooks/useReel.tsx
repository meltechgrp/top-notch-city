import { generateMediaUrl } from "@/lib/api";
import { composeFullAddress, generateTitle } from "@/lib/utils";
import { useStore } from "@/store";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import { useEffect, useMemo } from "react";

export function useReels() {
  const { reels, setReels, clearReels } = useStore();
  const {
    data,
    refetch,
    fetchNextPage,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinityQueries({ type: "reels", enabled: !reels?.length });

  const properties = useMemo(
    () => data?.pages.flatMap((page) => page.results) || [],
    [data]
  );
  const videos = useMemo(() => {
    return propertyToReel(properties);
  }, [properties]);
  async function forceRefresh() {
    clearReels();
    const { data } = await refetch();
    if (data) {
      const vs = data?.pages.flatMap((page) => page.results) || [];
      setReels(propertyToReel(vs));
    }
  }
  async function fetchNextReels() {
    const { data } = await fetchNextPage();
    if (data) {
      const vs = data?.pages.flatMap((page) => page.results) || [];
      setReels(propertyToReel(vs));
    }
  }
  return {
    reels: reels,
    videos,
    fetchNextPage: fetchNextReels,
    loading: isLoading,
    hasNextPage,
    isFetchingNextPage,
    forceRefresh,
  };
}

export function propertyToReel(properties: Property[]) {
  return properties
    .map((p) => {
      let v = p.media.find((m) => m.media_type === "VIDEO");
      if (v) {
        return {
          id: p.id,
          uri: generateMediaUrl(v).uri,
          title: generateTitle(p),
          description: p.description || "",
          interations: {
            liked: p.interaction?.liked || 0,
            added_to_wishlist: p.interaction?.added_to_wishlist || 0,
            viewed: p.interaction?.viewed || 0,
          },
          owner_interaction: {
            liked: p.owner_interaction?.liked || false,
            added_to_wishlist: p.owner_interaction?.added_to_wishlist || false,
            viewed: p.owner_interaction?.viewed || false,
          },
          created_at: p.created_at,
          owner: p?.owner,
          price: p.price,
          location: composeFullAddress(p.address, false, "short"),
          purpose: p.purpose,
        };
      }
    })
    .filter((p) => !!p);
}
