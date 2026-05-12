import { useInfiniteQuery } from "@tanstack/react-query";
import {
  fetchProperties,
  fetchUserProperties,
  fetchAdminProperties,
  fetchPendingProperties,
  fetchReels,
  fetchLands,
  fetchFeaturedProperties,
  fetchTrendingLandsProperties,
  fetchAgentProperties,
  fetchShortletProperties,
} from "@/actions/property/list";
import { searchProperties } from "@/actions/search";
import { fetchLocationProperties } from "@/actions/property/locations";

export function useInfinityQueries({
  type,
  profileId,
  filter,
  enabled = true,
  key,
  state,
  perPage = 20,
}: {
  type: QueryType;
  profileId?: string;
  filter?: SearchFilters;
  enabled?: boolean;
  key?: string; // optional key for query
  state?: string;
  audioUrl?: string;
  perPage?: number;
}) {
  const getNextPageParam = (lastPage: { page: number; pages: number }) => {
    const { page, pages } = lastPage;
    return page < pages ? page + 1 : undefined;
  };

  const queryOptions = (() => {
    switch (type) {
      case "latest": {
        return {
          queryKey: ["latest"],
          queryFn: ({ pageParam = 1 }) =>
            fetchProperties({ pageParam, perPage }),
          enabled,
        };
      }
      case "featured": {
        return {
          queryKey: ["featured"],
          queryFn: ({ pageParam = 1 }) =>
            fetchFeaturedProperties({ pageParam, perPage }),
          enabled,
        };
      }
      case "shortlet": {
        return {
          queryKey: ["shortlet"],
          queryFn: ({ pageParam = 1 }) =>
            fetchShortletProperties({ pageParam, perPage }),
          enabled,
        };
      }
      case "trending-lands": {
        return {
          queryKey: ["trending-lands"],
          queryFn: ({ pageParam = 1 }) =>
            fetchTrendingLandsProperties({ pageParam, perPage }),
          enabled,
        };
      }
      case "reels": {
        return {
          queryKey: ["reels"],
          queryFn: ({ pageParam = 1 }) => fetchReels({ pageParam }),
          enabled,
        };
      }
      case "lands": {
        return {
          queryKey: ["lands"],
          queryFn: ({ pageParam = 1 }) => fetchLands({ pageParam }),
          enabled,
        };
      }
      case "pending": {
        return {
          queryKey: ["pending-properties"],
          queryFn: ({ pageParam = 1 }) => fetchPendingProperties({ pageParam }),
          enabled,
        };
      }
      case "user": {
        return {
          queryKey: ["properties", profileId],
          queryFn: ({ pageParam = 1 }) =>
            fetchUserProperties({ userId: profileId!, pageParam }),
          enabled: !!profileId && enabled,
        };
      }
      case "agent-property": {
        return {
          queryKey: ["properties", profileId],
          queryFn: ({ pageParam = 1 }) => fetchAgentProperties({ pageParam }),
          enabled,
        };
      }
      case "admin": {
        return {
          queryKey: ["admins-properties"],
          queryFn: ({ pageParam = 1 }) => fetchAdminProperties({ pageParam }),
          enabled,
        };
      }
      case "search": {
        return {
          queryKey: ["search", filter],
          queryFn: ({ pageParam = 1 }) =>
            searchProperties(pageParam, perPage, filter),
          enabled,
        };
      }
      case "state": {
        return {
          queryKey: ["state", state],
          queryFn: ({ pageParam = 1 }) =>
            fetchLocationProperties({ pageParam, state }),
          enabled,
        };
      }
      default:
        throw new Error("Invalid product query type");
    }
  })();

  return useInfiniteQuery({
    ...queryOptions,
    initialPageParam: 1,
    getNextPageParam,
  });
}
