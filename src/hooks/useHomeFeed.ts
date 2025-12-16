import { useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useStore, useTempStore } from "@/store";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import { Fetch } from "@/actions/utills";

async function getTotal() {
  return (await Fetch("/chats/unread-count")) as {
    total_unread: number;
  };
}
export function useHomeFeed() {
  const { nearbyProperties, setNearbyProperties, location } = useStore();
  const { updatetotalUnreadChat, totalUnreadChat } = useTempStore();

  /** --- featured Properties --- */
  const {
    data: allFeatured,
    refetch: refetchFeatured,
    isLoading: loadingFeatured,
    isRefetching: refetchingFeatured,
  } = useInfinityQueries({
    type: "featured",
    perPage: 10,
  });

  const featured = useMemo(
    () => allFeatured?.pages.flatMap((page) => page.results) || [],
    [allFeatured]
  );

  /** --- trending lands Properties --- */
  const {
    data: allLands,
    refetch: refetchLands,
    isLoading: loadingLand,
    isRefetching: refetchingLand,
  } = useInfinityQueries({
    type: "trending-lands",
    perPage: 10,
  });

  const lands = useMemo(
    () => allLands?.pages.flatMap((page) => page.results) || [],
    [allLands]
  );

  /** --- Apartments Properties --- */
  const {
    data: allLatest,
    refetch: refetchLatest,
    isLoading: loadingLatest,
    isRefetching: refetchingLatest,
  } = useInfinityQueries({
    type: "latest",
    perPage: 10,
  });

  const latest = useMemo(
    () => allLatest?.pages.flatMap((page) => page.results) || [],
    [allLatest]
  );

  const {
    data: nearbyData,
    refetch: refetchNearby,
    isRefetching: refetchingNearby,
  } = useInfinityQueries({
    type: "search",
    filter: {
      latitude: location?.latitude?.toString(),
      longitude: location?.longitude?.toString(),
    },
    key: "nearby",
  });

  const nearby = useMemo(
    () => nearbyData?.pages.flatMap((page) => page.results) || [],
    [nearbyData]
  );
  useEffect(() => {
    if (!nearby.length) return;
    setNearbyProperties(nearby);
  }, [nearby]);

  useEffect(() => {
    if (nearby?.length < 4 && location) {
      refetchNearby();
    }
  }, [location, nearby]);
  const { data: totalCount, refetch: getTotalCount } = useQuery({
    queryKey: ["total"],
    queryFn: getTotal,
  });
  const {
    data: allShortlet,
    refetch: refetchShortlet,
    isLoading: loadingShortlet,
    isRefetching: refetchingShortlet,
  } = useInfinityQueries({
    type: "shortlet",
    perPage: 10,
  });

  const shortlets = useMemo(
    () => allShortlet?.pages.flatMap((page) => page.results) || [],
    [allShortlet]
  );

  const refreshAll = useCallback(async () => {
    await Promise.all([
      refetchFeatured(),
      refetchLands(),
      refetchLatest(),
      refetchNearby(),
      getTotalCount(),
      refetchShortlet(),
    ]);
  }, [
    refetchFeatured,
    refetchLands,
    refetchLatest,
    refetchFeatured,
    refetchNearby,
    getTotalCount,
  ]);
  useEffect(() => {
    updatetotalUnreadChat(totalCount?.total_unread || 0);
  }, [totalCount]);
  return {
    lands,
    latest,
    featured,
    nearby: nearbyProperties || [],
    loadingFeatured,
    loadingLand,
    loadingShortlet,
    loadingLatest,
    refetchingFeatured,
    refetchingLand,
    refetchingLatest,
    refreshAll,
    refetching: refetchingNearby,
    total: totalUnreadChat,
    getTotalCount,
    updatetotalUnreadChat,
    refetchingShortlet,
    shortlets,
  };
}
