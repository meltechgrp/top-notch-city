import { likeProperty } from "@/actions/property";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLike({ queryKey = ["reels"] }: { queryKey?: QueryType[] }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: likeProperty,

    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old?.pages) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            results: page.results?.map((r: any) =>
              r.id === id
                ? {
                    ...r,
                    owner_interaction: {
                      ...r.owner_interaction,
                      liked: !r.owner_interaction?.liked,
                    },
                    interaction: {
                      ...r.interaction,
                      liked: r.owner_interaction?.liked
                        ? r.interaction.liked - 1
                        : r.interaction.liked + 1,
                    },
                  }
                : r
            ),
          })),
        };
      });

      return { previous };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(queryKey, ctx.previous);
      }
    },
  });

  return {
    toggleLike: ({ id }: { id: string }) => mutation.mutate({ id }),
    isPending: mutation.isPending,
  };
}
