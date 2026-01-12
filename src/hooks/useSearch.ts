import { Property } from "@/db/models/properties";
import { transformServerProperty } from "@/db/normalizers/property";
import useGetLocation from "@/hooks/useGetLocation";
import { getReverseGeocode } from "@/hooks/useReverseGeocode";
import { searchStore } from "@/store/searchStore";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import { useValue } from "@legendapp/state/react";
import { useReducer, useMemo, useEffect, useCallback, useState } from "react";

type SearchAction =
  | { type: "SET_FILTERS"; payload: Partial<SearchFilters> }
  | { type: "RESET_FILTERS" }
  | { type: "RESET_SOME"; fields: (keyof SearchFilters)[] };

// Reducer
function searchReducer(
  state: SearchFilters,
  action: SearchAction
): SearchFilters {
  switch (action.type) {
    case "SET_FILTERS":
      return { ...state, ...action.payload };
    case "RESET_SOME": {
      const newState = { ...state };
      action.fields.forEach((field) => {
        delete newState[field];
      });
      return newState;
    }
    case "RESET_FILTERS":
      return {};
    default:
      return state;
  }
}

// Hook
export function useSearch() {
  const { retryGetLocation, location } = useGetLocation();
  const [searchProperties, updateSearchProperties] = useState<Property[]>([]);
  const [search, dispatch] = useReducer(searchReducer, {
    purpose: "rent",
    useGeoLocation: true,
    latitude: location?.latitude,
    longitude: location?.longitude,
  });
  const {
    data,
    refetch,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfinityQueries({
    type: "search",
    filter: search,
    enabled: false,
  });
  const setFilter = useCallback(
    (field: keyof SearchFilters, value: string | string[] | undefined) =>
      dispatch({ type: "SET_FILTERS", payload: { [field]: value } }),
    []
  );

  const setFilters = useCallback(
    (values: Partial<SearchFilters>) =>
      dispatch({ type: "SET_FILTERS", payload: values }),
    []
  );
  const resetSome = (fields: (keyof SearchFilters)[]) => {
    dispatch({ type: "RESET_SOME", fields });
  };

  const resetFilters = () => {
    dispatch({ type: "RESET_FILTERS" });
  };

  const properties = useMemo(() => {
    return data?.pages.flatMap((page) => page.results) || [];
  }, [data]);
  const total = useMemo(() => data?.pages?.[0]?.total ?? 0, [data]);
  const available = useMemo(
    () => searchProperties?.length || 0,
    [searchProperties]
  );
  function applyCachedResults() {
    updateSearchProperties(transformServerProperty(properties || []));
  }
  async function refetchAndApply() {
    let { data } = await refetch();
    const properties = data?.pages.flatMap((page) => page.results) || [];
    updateSearchProperties(transformServerProperty(properties || []));
  }
  const isLocation = useMemo(
    () =>
      search?.latitude == location?.latitude &&
      search?.longitude == location?.longitude,
    [search, location]
  );
  async function useMyLocation() {
    if (location) {
      setFilters({
        latitude: location.latitude,
        longitude: location.longitude,
      });
      refetchAndApply();
      const address = await getReverseGeocode(location);
      setFilters({
        country: address?.addressComponents?.country,
        state: address?.addressComponents?.state,
        city: address?.addressComponents?.city,
      });
    } else {
      const locate = await retryGetLocation();
      setFilters({
        latitude: locate?.latitude,
        longitude: locate?.longitude,
      });
      refetchAndApply();
      if (locate) {
        const address = await getReverseGeocode(locate);
        setFilters({
          country: address?.addressComponents?.country,
          state: address?.addressComponents?.state,
          city: address?.addressComponents?.city,
        });
      }
    }
  }
  useEffect(() => {
    refetch();
  }, [search]);
  useEffect(() => {
    if (!location || properties?.length == 0) {
      useMyLocation();
    } else {
      updateSearchProperties(transformServerProperty(properties || []));
    }
    applyCachedResults();
  }, [location, properties]);
  return {
    search: {
      setFilter,
      setFilters,
      resetSome,
      resetFilters,
      useMyLocation,
      filter: search,
      isLocation,
    },
    results: { total, available },
    query: {
      refetch,
      fetchNextPage,
      hasNextPage,
      loading: isLoading || isFetching,
      applyCachedResults,
      refetchAndApply,
    },
    properties: searchProperties,
  };
}
