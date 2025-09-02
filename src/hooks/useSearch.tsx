import useGetLocation from "@/hooks/useGetLocation";
import { useStore } from "@/store";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import { useReducer, useMemo, useEffect, useCallback } from "react";

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
      return { use_geo_location: "true", perPage: 100000 };
    default:
      return state;
  }
}

// Hook
export function useSearch() {
  const { retryGetLocation, location } = useGetLocation();
  const { searchProperties, updateSearchProperties } = useStore();
  const [search, dispatch] = useReducer(searchReducer, {
    use_geo_location: "true",
    perPage: 100000,
    latitude: location?.latitude?.toString(),
    longitude: location?.longitude?.toString(),
  });
  const {
    data,
    refetch,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinityQueries({
    type: "search",
    filter: search,
    enabled: false,
    perPage: search.perPage,
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
    updateSearchProperties(properties || []);
  }
  async function refetchAndApply() {
    let { data } = await refetch();
    const properties = data?.pages.flatMap((page) => page.results) || [];
    updateSearchProperties(properties || []);
  }
  async function useMyLocation() {
    const locate = await retryGetLocation();
    if (locate) {
      setFilters({
        latitude: locate.latitude.toString(),
        longitude: locate.longitude.toString(),
        use_geo_location: "true",
      });
      refetchAndApply();
    }
  }
  useEffect(() => {
    refetch();
  }, [search]);
  useEffect(() => {
    if (properties?.length > 0 && searchProperties?.length < 1) {
      updateSearchProperties(properties || []);
    }
  }, [searchProperties, properties]);
  return {
    search: {
      setFilter,
      setFilters,
      resetSome,
      resetFilters,
      useMyLocation,
      filter: search,
    },
    results: { total, available },
    query: {
      refetch,
      fetchNextPage,
      hasNextPage,
      loading: isLoading || isFetchingNextPage,
      applyCachedResults,
      refetchAndApply,
    },
    properties: searchProperties,
  };
}
