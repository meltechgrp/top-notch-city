"use client";

import { useQueryClient, useMutation } from "@tanstack/react-query";
import { addToWishList, removeFromWishList } from "@/actions/property";

interface UseWishlistOptions {
  queryKey?: QueryType[];
}

export function useWishlist({ queryKey = ["reels"] }: UseWishlistOptions = {}) {
  const queryClient = useQueryClient();

  const { mutate: toggleWishlist, isPending } = useMutation({
    mutationFn: ({ id, isAdded }: { id: string; isAdded: boolean }) => {
      return isAdded ? removeFromWishList({ id }) : addToWishList({ id });
    },

    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old?.pages) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            results: page.results.map((r: any) => {
              if (r.id !== id) return r;

              const prev = r.owner_interaction?.added_to_wishlist ?? false;

              return {
                ...r,
                owner_interaction: {
                  ...r.owner_interaction,
                  added_to_wishlist: !prev,
                },
                interaction: {
                  ...r.interaction,
                  added_to_wishlist: prev
                    ? r.interaction.added_to_wishlist - 1
                    : r.interaction.added_to_wishlist + 1,
                },
              };
            }),
          })),
        };
      });

      return { previousData };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previousData) {
        queryClient.setQueryData(queryKey, ctx.previousData);
      }
    },

    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey });
    // },
  });

  return { toggleWishlist, isPending };
}
