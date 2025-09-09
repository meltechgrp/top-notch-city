import { useInfiniteQuery } from "@tanstack/react-query";
import {
  fetchProperties,
  fetchUserProperties,
  fetchAdminProperties,
  fetchPendingProperties,
  fetchReels,
  fetchLands,
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
  type:
    | "all"
    | "user"
    | "admin"
    | "search"
    | "state"
    | "pending"
    | "reels"
    | "lands";
  profileId?: string;
  filter?: SearchFilters;
  enabled?: boolean;
  key?: string; // optional key for query
  state?: string;
  audioUrl?: string;
  perPage?: number;
}) {
  switch (type) {
    case "all": {
      return useInfiniteQuery({
        queryKey: ["properties"],
        queryFn: ({ pageParam = 1 }) => fetchProperties({ pageParam, perPage }),
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
        queryKey: [key || "search", filter],
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
