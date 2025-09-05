import { viewProperty } from "@/actions/property";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memo, useEffect } from "react";

export function ReelViewsController({
  id,
  viewed,
}: {
  id: string;
  viewed: boolean;
}) {
  const client = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: () => viewProperty({ id }),
    onMutate: async () => {
      await client.cancelQueries({ queryKey: ["reels"] });

      const previousData = client.getQueryData<{
        pages: Result[];
        pageParams: unknown[];
      }>(["reels"]);

      client.setQueryData<{
        pages: Result[];
        pageParams: unknown[];
      }>(["reels"], (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            results: page.results?.map((reel) => {
              if (reel.id !== id) return reel;
              return {
                ...reel,
                owner_interaction: {
                  ...reel?.owner_interaction,
                  viewed: !viewed,
                },
                interaction: {
                  ...reel?.interaction,
                  added_to_wishlist: reel.interaction
                    ? reel.interaction.added_to_wishlist + (viewed ? -1 : 1)
                    : viewed
                      ? -1
                      : 1,
                },
              };
            }),
          })),
        };
      });

      return { previousData };
    },
    // If the request fails, rollback
    onError: (_err, _vars, ctx) => {
      console.log(_err);
      if (ctx?.previousData) {
        client.setQueryData(["reels"], ctx.previousData);
      }
    },

    // After success, refetch in background to ensure sync
    onSettled: () => {
      client.invalidateQueries({ queryKey: ["reels"] });
    },
  });

  useEffect(() => {
    if (!viewed) {
      setTimeout(() => {
        mutate();
      }, 50);
    }
  }, [viewed]);
}
