import { composeFullAddress, generateTitle } from "@/lib/utils";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import { useMemo } from "react";

export function usePhotos() {
  const {
    data,
    refetch,
    fetchNextPage,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinityQueries({ type: "reels" });

  const photos = useMemo(() => {
    return propertyToReelPhoto(
      data?.pages.flatMap((page) => page.results) || []
    );
  }, [data]);

  return {
    photos,
    fetchNextPage,
    loading: isLoading,
    hasNextPage,
    fetching: isFetchingNextPage,
    refetch,
  };
}

export function propertyToReelPhoto(properties: Property[]) {
  return properties
    .map((p) => {
      let v = p.media.filter((m) => m.media_type === "IMAGE");
      if (v?.length > 0) {
        return {
          id: p.id,
          video: "",
          photos: v,
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
