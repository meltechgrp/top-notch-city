import { useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/store";
import { shallowCompareProperties } from "@/lib/utils";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import { fetchTopLocations } from "@/actions/property/locations";
import { Fetch } from "@/actions/utills";

async function getTotal() {
  return (await Fetch("/chats/unread-count")) as {
    total_unread: number;
  };
}
export function useHomeFeed() {
  const {
    topProperties,
    setTopProperties,
    nearbyProperties,
    setNearbyProperties,
    location,
  } = useStore();

  /** --- All Properties --- */
  const {
    data: allData,
    refetch: refetchAll,
    isRefetching: refetchingAll,
  } = useInfinityQueries({ type: "all" });

  const { data: totalCount, refetch: getTotalCount } = useQuery({
    queryKey: ["total"],
    queryFn: getTotal,
  });

  const allProperties = useMemo(
    () => allData?.pages.flatMap((page) => page.results) || [],
    [allData]
  );
  /** --- Top Locations --- */
  const {
    data: locationsData,
    refetch: refetchLocations,
    isRefetching: refetchingLocations,
  } = useQuery({
    queryKey: ["locations"],
    queryFn: fetchTopLocations,
  });

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
  /** --- Sync with Store only when changed --- */
  useEffect(() => {
    if (!allProperties.length) return;
    if (!shallowCompareProperties(topProperties || [], allProperties)) {
      setTopProperties(allProperties);
    }
  }, [allProperties, topProperties, setTopProperties]);
  const total = useMemo(() => totalCount?.total_unread, [totalCount]);
  useEffect(() => {
    if (!nearby.length) return;
    if (!shallowCompareProperties(nearbyProperties || [], nearby)) {
      setNearbyProperties(nearby);
    }
  }, [nearby, nearbyProperties, setNearbyProperties]);

  /** --- Combined Refresh --- */
  const refreshAll = useCallback(async () => {
    await Promise.all([
      refetchAll(),
      refetchLocations(),
      refetchNearby(),
      getTotalCount(),
    ]);
  }, [refetchAll, refetchLocations, refetchNearby, getTotalCount]);
  const locations = useMemo(
    () => locationsData?.slice() || [],
    [locationsData?.length]
  );
  useEffect(() => {
    getTotal();
  }, []);
  return {
    allProperties: topProperties || [],
    locations,
    nearby: nearbyProperties || [],
    refreshAll,
    refetching: refetchingAll || refetchingLocations || refetchingNearby,
    total,
    getTotalCount,
  };
}
