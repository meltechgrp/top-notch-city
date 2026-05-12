import { likeProperty } from "@/actions/property";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UseLikeOptions = {
  queryKey?: unknown[];
};

type PropertyPage = {
  results?: ServerProperty[];
};

type InfinitePropertyData = {
  pages?: PropertyPage[];
  pageParams?: unknown[];
};

function patchLike(data: InfinitePropertyData | undefined, id: string) {
  if (!data?.pages) return data;

  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      results: page.results?.map((property) => {
        if (property.id !== id) return property;

        const liked = !property.owner_interaction?.liked;
        const currentLikes = property.interaction?.liked || 0;

        return {
          ...property,
          interaction: {
            ...property.interaction,
            liked: Math.max(0, currentLikes + (liked ? 1 : -1)),
          },
          owner_interaction: {
            ...property.owner_interaction,
            liked,
          },
        };
      }),
    })),
  };
}

export function useLike({ queryKey }: UseLikeOptions = {}) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: likeProperty,
    onMutate: async ({ id }) => {
      if (!queryKey) return;

      await queryClient.cancelQueries({ queryKey });
      const previousData =
        queryClient.getQueryData<InfinitePropertyData>(queryKey);

      queryClient.setQueryData<InfinitePropertyData>(queryKey, (old) =>
        patchLike(old, id),
      );

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      if (queryKey && context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });

  return {
    toggleLike: ({ id }: { id: string }) => mutation.mutate({ id }),
    isPending: mutation.isPending,
  };
}
