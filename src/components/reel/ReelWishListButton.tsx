import { Icon, useResolvedTheme } from "../ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToWishList, removeFromWishList } from "@/actions/property";
import { memo } from "react";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";
import { openAccessModal } from "@/components/globals/AuthModals";
import { Bookmark } from "lucide-react-native";
import AnimatedPressable from "@/components/custom/AnimatedPressable";

interface Props {
  isAdded: boolean;
  id: string;
  className?: string;
  isLand?: boolean;
}

const ReelWishListButton = ({ isAdded, id, isLand, className }: Props) => {
  const theme = useResolvedTheme();
  const client = useQueryClient();
  const { hasAuth } = useStore();
  const { mutate } = useMutation({
    mutationFn: () =>
      isAdded ? removeFromWishList({ id }) : addToWishList({ id }),

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
                  added_to_wishlist: !isAdded,
                },
                interaction: {
                  ...reel?.interaction,
                  added_to_wishlist: reel.interaction
                    ? reel.interaction.added_to_wishlist + (isAdded ? -1 : 1)
                    : isAdded
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
    // onSettled: () => {
    //   client.invalidateQueries({ queryKey: ["reels"] });
    // },
  });
  const { mutate: mutateLand } = useMutation({
    mutationFn: () =>
      isAdded ? removeFromWishList({ id }) : addToWishList({ id }),

    onMutate: async () => {
      await client.cancelQueries({ queryKey: ["lands"] });

      const previousData = client.getQueryData<{
        pages: Result[];
        pageParams: unknown[];
      }>(["lands"]);

      client.setQueryData<{
        pages: Result[];
        pageParams: unknown[];
      }>(["lands"], (old) => {
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
                  added_to_wishlist: !isAdded,
                },
                interaction: {
                  ...reel?.interaction,
                  added_to_wishlist: reel.interaction
                    ? reel.interaction.added_to_wishlist + (isAdded ? -1 : 1)
                    : isAdded
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
        client.setQueryData(["lands"], ctx.previousData);
      }
    },

    // After success, refetch in background to ensure sync
    // onSettled: () => {
    //   client.invalidateQueries({ queryKey: ["lands"] });
    // },
  });
  function hnadleWishList() {
    if (!hasAuth) {
      return openAccessModal({ visible: true });
    }
    if (isLand) {
      mutateLand();
    } else {
      mutate();
    }
  }
  return (
    <AnimatedPressable
      onPress={hnadleWishList}
      className={cn("px-2", className)}
    >
      <Icon
        as={Bookmark}
        className={cn(
          "text-white w-9 h-9",
          isAdded && "text-primary fill-primary"
        )}
      />
    </AnimatedPressable>
  );
};

export default memo(ReelWishListButton);
