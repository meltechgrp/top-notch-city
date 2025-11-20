import { useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useStore, useTempStore } from "@/store";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import { fetchTopLocations } from "@/actions/property/locations";
import { Fetch } from "@/actions/utills";

async function getTotal() {
  return (await Fetch("/chats/unread-count")) as {
    total_unread: number;
  };
}
export function useHomeFeed() {
  const { nearbyProperties, setNearbyProperties, location } = useStore();
  const { updatetotalUnreadChat, totalUnreadChat } = useTempStore();

  /** --- Top Locations --- */
  const {
    data: locationsData,
    refetch: refetchLocations,
    isRefetching: refetchingLocations,
    isLoading: loadingLocations,
  } = useQuery({
    queryKey: ["locations"],
    queryFn: fetchTopLocations,
  });

  const locations = useMemo(
    () => locationsData?.slice() || [],
    [locationsData?.length]
  );

  /** --- featured Properties --- */
  const {
    data: allFeatured,
    refetch: refetchFeatured,
    isLoading: loadingFeatured,
    isRefetching: refetchingFeatured,
  } = useInfinityQueries({
    type: "featured",
    perPage: 5,
  });

  const featured = useMemo(
    () => allFeatured?.pages.flatMap((page) => page.results) || [],
    [allFeatured]
  );

  /** --- trending Properties --- */
  const {
    data: allTrending,
    refetch: refetchTrending,
    isLoading: loadingTrending,
    isRefetching: refetchingTrending,
  } = useInfinityQueries({
    type: "trending",
    perPage: 5,
  });

  const trending = useMemo(
    () => allTrending?.pages.flatMap((page) => page.results) || [],
    [allTrending]
  );
  /** --- trending lands Properties --- */
  const {
    data: allLands,
    refetch: refetchLands,
    isLoading: loadingLand,
    isRefetching: refetchingLand,
  } = useInfinityQueries({
    type: "trending-lands",
    perPage: 5,
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
    perPage: 5,
  });

  const latest = useMemo(
    () => allLatest?.pages.flatMap((page) => page.results) || [],
    [allLatest]
  );

  /** --- Nearby Properties --- */
  const {
    data: nearbyData,
    refetch: refetchNearby,
    isRefetching: refetchingNearby,
  } = useInfinityQueries({
    type: "search",
    filter: {
      latitude: location?.latitude?.toString(),
      longitude: location?.longitude?.toString(),
      use_geo_location: "true",
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
  /* Total unread count */
  const { data: totalCount, refetch: getTotalCount } = useQuery({
    queryKey: ["total"],
    queryFn: getTotal,
  });

  /** --- Combined Refresh --- */
  const refreshAll = useCallback(async () => {
    await Promise.all([
      refetchFeatured(),
      refetchLands(),
      refetchLatest(),
      refetchTrending(),
      refetchLocations(),
      refetchNearby(),
      getTotalCount(),
    ]);
  }, [
    refetchFeatured,
    refetchLands,
    refetchLatest,
    refetchFeatured,
    refetchTrending,
    refetchLocations,
    refetchNearby,
    getTotalCount,
  ]);
  useEffect(() => {
    updatetotalUnreadChat(totalCount?.total_unread || 0);
  }, [totalCount]);
  return {
    trending,
    lands,
    latest,
    featured,
    locations,
    nearby: nearbyProperties || [],
    loadingFeatured,
    loadingLand,
    loadingLatest,
    loadingTrending,
    refetchingFeatured,
    refetchingLand,
    refetchingLatest,
    refetchingTrending,
    loadingLocations,
    refetchingLocations,
    refreshAll,
    refetching: refetchingNearby,
    total: totalUnreadChat,
    getTotalCount,
    updatetotalUnreadChat,
  };
}
