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
  switch (type) {
    case "latest": {
      return useInfiniteQuery({
        queryKey: ["latest"],
        queryFn: ({ pageParam = 1 }) => fetchProperties({ pageParam, perPage }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
          const { page, pages } = lastPage;
          return page < pages ? page + 1 : undefined;
        },
        enabled,
      });
    }
    case "featured": {
      return useInfiniteQuery({
        queryKey: ["featured"],
        queryFn: ({ pageParam = 1 }) =>
          fetchFeaturedProperties({ pageParam, perPage }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
          const { page, pages } = lastPage;
          return page < pages ? page + 1 : undefined;
        },
        enabled,
      });
    }
    case "shortlet": {
      return useInfiniteQuery({
        queryKey: ["shortlet"],
        queryFn: ({ pageParam = 1 }) =>
          fetchShortletProperties({ pageParam, perPage }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
          const { page, pages } = lastPage;
          return page < pages ? page + 1 : undefined;
        },
        enabled,
      });
    }
    case "trending-lands": {
      return useInfiniteQuery({
        queryKey: ["trending-lands"],
        queryFn: ({ pageParam = 1 }) =>
          fetchTrendingLandsProperties({ pageParam, perPage }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
          const { page, pages } = lastPage;
          return page < pages ? page + 1 : undefined;
        },
        enabled,
      });
    }
    case "reels": {
      return useInfiniteQuery({
        queryKey: ["reels"],
        queryFn: ({ pageParam = 1 }) => fetchReels({ pageParam }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
          const { page, pages } = lastPage;
          return page < pages ? page + 1 : undefined;
        },
        enabled,
      });
    }
    case "lands": {
      return useInfiniteQuery({
        queryKey: ["lands"],
        queryFn: ({ pageParam = 1 }) => fetchLands({ pageParam }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
          const { page, pages } = lastPage;
          return page < pages ? page + 1 : undefined;
        },
        enabled,
      });
    }
    case "pending": {
      return useInfiniteQuery({
        queryKey: ["pending-properties"],
        queryFn: ({ pageParam = 1 }) => fetchPendingProperties({ pageParam }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
          const { page, pages } = lastPage;
          return page < pages ? page + 1 : undefined;
        },
        enabled,
      });
    }
    case "user": {
      return useInfiniteQuery({
        queryKey: ["properties", profileId],
        queryFn: ({ pageParam = 1 }) =>
          fetchUserProperties({ userId: profileId!, pageParam }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
          const { page, pages } = lastPage;
          return page < pages ? page + 1 : undefined;
        },
        enabled: !!profileId && enabled,
      });
    }
    case "agent-property": {
      return useInfiniteQuery({
        queryKey: ["properties", profileId],
        queryFn: ({ pageParam = 1 }) => fetchAgentProperties({ pageParam }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
          const { page, pages } = lastPage;
          return page < pages ? page + 1 : undefined;
        },
      });
    }
    case "admin": {
      return useInfiniteQuery({
        queryKey: ["admins-properties"],
        queryFn: ({ pageParam = 1 }) => fetchAdminProperties({ pageParam }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
          const { page, pages } = lastPage;
          return page < pages ? page + 1 : undefined;
        },
        enabled,
      });
    }
    case "search": {
      return useInfiniteQuery({
        queryKey: ["search", filter],
        queryFn: ({ pageParam = 1 }) =>
          searchProperties(pageParam, perPage, filter),
        getNextPageParam: (lastPage) => {
          const { page, pages } = lastPage;
          return page < pages ? page + 1 : undefined;
        },
        initialPageParam: 1,
        enabled,
      });
    }
    case "state": {
      return useInfiniteQuery({
        queryKey: ["state", state],
        queryFn: ({ pageParam = 1 }) =>
          fetchLocationProperties({ pageParam, state }),
        getNextPageParam: (lastPage) => {
          const { page, pages } = lastPage;
          return page < pages ? page + 1 : undefined;
        },
        initialPageParam: 1,
        enabled,
      });
    }
    default:
      throw new Error("Invalid product query type");
  }
}
