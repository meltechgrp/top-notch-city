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
  search,
  status,
  agentId,
}: {
  type: QueryType;
  profileId?: string;
  filter?: SearchFilters;
  enabled?: boolean;
  key?: string; // optional key for query
  state?: string;
  audioUrl?: string;
  perPage?: number;
  search?: string;
  status?: string;
  agentId?: string;
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
            fetchProperties({ pageParam, perPage, search, status }),
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
          queryKey: ["pending-properties", search],
          queryFn: ({ pageParam = 1 }) =>
            fetchPendingProperties({ pageParam, perPage, search }),
          enabled,
        };
      }
      case "user": {
        return {
          queryKey: ["properties", profileId, status, search],
          queryFn: ({ pageParam = 1 }) =>
            fetchUserProperties({
              userId: profileId!,
              pageParam,
              perPage,
              status,
              search,
            }),
          enabled: !!profileId && enabled,
        };
      }
      case "agent-property": {
        return {
          queryKey: ["agent-properties", profileId ?? agentId, status, search],
          queryFn: ({ pageParam = 1 }) =>
            fetchAgentProperties({
              pageParam,
              perPage,
              agentId: agentId ?? profileId,
              status,
              search,
            }),
          enabled,
        };
      }
      case "admin": {
        return {
          queryKey: ["admin-properties", status, search, agentId],
          queryFn: ({ pageParam = 1 }) =>
            fetchAdminProperties({
              pageParam,
              perPage,
              status,
              search,
              agentId,
            }),
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
