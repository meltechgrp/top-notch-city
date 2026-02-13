import { Property } from "@/db/models/properties";
import { transformServerProperty } from "@/db/normalizers/property";
import useGetLocation from "@/hooks/useGetLocation";
import { getReverseGeocode } from "@/hooks/useReverseGeocode";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import { useReducer, useMemo, useCallback, useEffect, useState } from "react";

type SearchAction =
  | { type: "SET"; payload: Partial<SearchFilters> }
  | { type: "RESET" }
  | { type: "RESET_FIELDS"; fields: (keyof SearchFilters)[] };

function searchReducer(
  state: SearchFilters,
  action: SearchAction,
): SearchFilters {
  switch (action.type) {
    case "SET":
      return { ...state, ...action.payload };

    case "RESET_FIELDS": {
      const next = { ...state };
      action.fields.forEach((k) => delete next[k]);
      return next;
    }

    case "RESET":
      return {};

    default:
      return state;
  }
}

/* ---------------- Hook ---------------- */

export function useSearch() {
  const [committedProperties, setcommittedProperties] = useState<Property[]>(
    [],
  );
  const { location, retryGetLocation } = useGetLocation();

  const [search, dispatch] = useReducer(searchReducer, {
    useGeoLocation: true,
  });

  /* ----------- PREVIEW QUERY (NO STORE WRITE) ----------- */

  const {
    data,
    refetch,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
  } = useInfinityQueries({
    type: "search",
    filter: search,
    enabled: true,
  });

  const previewProperties = useMemo(
    () => data?.pages.flatMap((p) => p.results) ?? [],
    [data],
  );

  const total = data?.pages?.[0]?.total ?? 0;

  /* ---------------- Commit APIs ---------------- */

  const applyCachedResults = useCallback(() => {
    setcommittedProperties(transformServerProperty(previewProperties));
  }, [previewProperties]);

  const refetchAndApply = useCallback(async () => {
    const { data } = await refetch();
    const results = data?.pages.flatMap((p) => p.results) ?? [];

    setcommittedProperties(transformServerProperty(results));
  }, [refetch]);

  /* ---------------- Location ---------------- */

  const useMyLocation = useCallback(async () => {
    const coords = location ?? (await retryGetLocation());
    if (!coords) return;

    dispatch({
      type: "SET",
      payload: {
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
    });

    const address = await getReverseGeocode(coords);

    dispatch({
      type: "SET",
      payload: {
        country: address?.addressComponents?.country,
        state: address?.addressComponents?.state,
        city: address?.addressComponents?.city,
      },
    });

    // IMPORTANT: location commits immediately
    await refetchAndApply();
  }, [location, retryGetLocation, refetchAndApply]);

  /* ---------------- Filters API ---------------- */

  const setFilter = useCallback(
    (key: keyof SearchFilters, value: any) =>
      dispatch({ type: "SET", payload: { [key]: value } }),
    [],
  );

  const setFilters = useCallback(
    (values: Partial<SearchFilters>) =>
      dispatch({ type: "SET", payload: values }),
    [],
  );

  const resetSome = useCallback(
    (fields: (keyof SearchFilters)[]) =>
      dispatch({ type: "RESET_FIELDS", fields }),
    [],
  );
  useEffect(() => {
    if (!location && !committedProperties.length) {
      useMyLocation();
    }
  }, [location]);
  const resetFilters = useCallback(() => dispatch({ type: "RESET" }), []);
  useEffect(() => {
    if (committedProperties?.length < 0) {
      setcommittedProperties(transformServerProperty(previewProperties));
    }
  }, [previewProperties, committedProperties]);
  const isLocation =
    search.latitude === location?.latitude &&
    search.longitude === location?.longitude;
  console.log(committedProperties?.length, "here");
  return {
    search: {
      filter: search,
      setFilter,
      setFilters,
      resetSome,
      resetFilters,
      useMyLocation,
      isLocation,
    },

    results: {
      total,
      available: committedProperties.length,
    },
    properties: committedProperties,

    query: {
      loading: isLoading || isFetching,
      refetch,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      applyCachedResults,
      refetchAndApply,
    },
  };
}
