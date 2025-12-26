import { generateMediaUrl } from "@/lib/api";
import { composeFullAddress, generateTitle } from "@/lib/utils";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import { useMemo } from "react";

export function useReels() {
  const {
    data,
    refetch,
    fetchNextPage,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinityQueries({ type: "reels" });
  const videos = useMemo(() => {
    return propertyToReelVideo(
      data?.pages.flatMap((page) => page.results) || []
    );
  }, [data]);
  return {
    reels: videos,
    fetchNextPage,
    loading: isLoading,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  };
}

export function propertyToReelVideo(properties: Property[]) {
  return properties
    .map((p) => {
      let v = p.media.find((m) => m.media_type === "VIDEO");
      if (v) {
        return {
          id: p.id,
          video: generateMediaUrl(v).uri,
          photos: [],
          slug: p.slug,
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
          is_following: p.is_following || false,
          location: p.address?.display_address || composeFullAddress(p.address),
          purpose: p.purpose,
        } as Reel;
      }
    })
    .filter((p) => !!p);
}
