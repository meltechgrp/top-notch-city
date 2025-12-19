import { searchProperties } from "@/actions/search";
import { normalizePropertyList } from "@/db/normalizers/property";
import { getSearchList } from "@/db/queries/search";
import { syncPropertyLists } from "@/db/sync/properties";
import useGetLocation from "@/hooks/useGetLocation";
import { useLiveQuery } from "@/hooks/useLiveQuery";
import { getReverseGeocode } from "@/hooks/useReverseGeocode";
import { mapPropertyList } from "@/lib/utils";
import { useReducer, useMemo, useCallback } from "react";

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
      return { perPage: 90 };
    default:
      return state;
  }
}

// Hook
export function useSearch() {
  const { retryGetLocation, location } = useGetLocation();
  const [search, dispatch] = useReducer(searchReducer, {
    perPage: 90,
    purpose: "rent",
    latitude: location?.latitude,
    longitude: location?.longitude,
  });

  const { data, isLoading } =
    useLiveQuery(
      () =>
        getSearchList({
          filter: search,
          limit: search.perPage,
          page: 1,
        }),
      [search]
    ) ?? [];

  const properties = useMemo(() => mapPropertyList(data || []), [data]);

  const hydrateFromServer = useCallback(async () => {
    if (!search.country) return;

    const res = await searchProperties(1, 100, {
      country: search.country,
      useGeoLocation: false,
    });

    if (res?.results?.length) {
      await syncPropertyLists(res.results.map(normalizePropertyList));
    }
  }, [search.country]);
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

  async function useMyLocation() {
    const loc = location ?? (await retryGetLocation());
    if (!loc) return;

    setFilters({
      latitude: loc.latitude,
      longitude: loc.longitude,
      useGeoLocation: true,
    });

    const address = await getReverseGeocode(loc);
    setFilters({
      country: address?.addressComponents?.country,
      state: address?.addressComponents?.state,
      city: address?.addressComponents?.city,
    });

    await hydrateFromServer();
  }
  return {
    search: {
      filter: search,
      setFilter,
      setFilters,
      resetFilters,
      useMyLocation,
      resetSome,
    },
    results: {
      total: properties.length,
      available: properties.length,
    },
    query: {
      hydrateFromServer,
      isLoading,
    },
    properties,
  };
}
