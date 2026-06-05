import { likeProperty } from "@/actions/property";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UseLikeOptions = {
  queryKey?: unknown[];
};

type PropertyPage = {
  results?: ServerProperty[];
};

function getPropertyId(property: any) {
  const value = property?.property_server_id ?? property?.id;
  return value === undefined || value === null ? "" : String(value);
}

function getLiked(property: any) {
  return Boolean(property?.liked ?? property?.owner_interaction?.liked);
}

function getLikes(property: any) {
  const value = property?.likes ?? property?.interaction?.liked ?? 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function patchPropertyLike(property: any, id: string) {
  if (getPropertyId(property) !== String(id)) return property;

  const liked = !getLiked(property);
  const likes = Math.max(0, getLikes(property) + (liked ? 1 : -1));

  return {
    ...property,
    likes,
    liked,
    interaction: {
      ...property.interaction,
      liked: likes,
    },
    owner_interaction: {
      ...property.owner_interaction,
      liked,
    },
  };
}

function patchLike<T>(data: T | undefined, id: string): T | undefined {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map((property) => patchPropertyLike(property, id)) as T;
  }

  if (typeof data !== "object") return data;

  const record = data as Record<string, any>;

  if (Array.isArray(record.pages)) {
    return {
      ...record,
      pages: record.pages.map((page: PropertyPage) => ({
        ...page,
        results: page.results?.map((property) =>
          patchPropertyLike(property, id),
        ),
      })),
    } as T;
  }

  return {
    ...record,
    results: Array.isArray(record.results)
      ? record.results.map((property: any) => patchPropertyLike(property, id))
      : record.results,
  } as T;
}

export function useLike({ queryKey }: UseLikeOptions = {}) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: likeProperty,
    onMutate: async ({ id }) => {
      if (!queryKey) return;

      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old) => patchLike(old, id));

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      if (queryKey && context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
  });

  return {
    toggleLike: ({ id }: { id: string }) => mutation.mutateAsync({ id }),
    isPending: mutation.isPending,
  };
}
