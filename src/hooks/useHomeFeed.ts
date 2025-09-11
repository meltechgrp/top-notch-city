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
  } = useQuery({
    queryKey: ["locations"],
    queryFn: fetchTopLocations,
  });

  const locations = useMemo(
    () => locationsData?.slice() || [],
    [locationsData?.length]
  );

  /** --- featured Properties --- */
  const { data: allFeatured, refetch: refetchFeatured } = useInfinityQueries({
    type: "featured",
    perPage: 5,
  });

  const featured = useMemo(
    () => allFeatured?.pages.flatMap((page) => page.results) || [],
    [allFeatured]
  );

  /** --- trending Properties --- */
  const { data: allTrending, refetch: refetchTrending } = useInfinityQueries({
    type: "trending",
    perPage: 5,
  });

  const trending = useMemo(
    () => allTrending?.pages.flatMap((page) => page.results) || [],
    [allTrending]
  );
  /** --- trending lands Properties --- */
  const { data: allLands, refetch: refetchLands } = useInfinityQueries({
    type: "trending-lands",
    perPage: 5,
  });

  const lands = useMemo(
    () => allLands?.pages.flatMap((page) => page.results) || [],
    [allLands]
  );

  /** --- latest Properties --- */
  const { data: allLatest, refetch: refetchLatest } = useInfinityQueries({
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
    enabled: false,
  });

  const nearby = useMemo(
    () => nearbyData?.pages.flatMap((page) => page.results) || [],
    [nearbyData]
  );
  useEffect(() => {
    if (!nearby.length) return;
    setNearbyProperties(nearby);
  }, [nearby, setNearbyProperties]);

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
    refreshAll,
    refetching: refetchingLocations || refetchingNearby,
    total: totalUnreadChat,
    getTotalCount,
    updatetotalUnreadChat,
  };
}
