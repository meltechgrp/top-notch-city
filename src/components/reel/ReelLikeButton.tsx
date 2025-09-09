import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Icon, useResolvedTheme } from "../ui";
import { likeProperty } from "@/actions/property";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { useStore } from "@/store";
import { openAccessModal } from "@/components/globals/AuthModals";
import { Heart } from "lucide-react-native";
import AnimatedPressable from "@/components/custom/AnimatedPressable";

interface Props {
  liked: boolean;
  id: string;
  className?: string;
  isLand?: boolean;
}

const ReelLikeButton = ({ liked, id, className, isLand }: Props) => {
  const { hasAuth } = useStore();
  const client = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => likeProperty({ id }),
    // OPTIMISTIC UPDATE
    onMutate: async () => {
      await client.cancelQueries({
        queryKey: ["reels"],
      });

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

              const alreadyLiked = reel.owner_interaction?.liked ?? false;
              return {
                ...reel,
                owner_interaction: {
                  ...reel?.owner_interaction,
                  liked: !alreadyLiked,
                },
                interaction: {
                  ...reel?.interaction,
                  liked: reel.interaction
                    ? reel.interaction.liked + (alreadyLiked ? -1 : 1)
                    : alreadyLiked
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
    mutationFn: () => likeProperty({ id }),
    // OPTIMISTIC UPDATE
    onMutate: async () => {
      await client.cancelQueries({
        queryKey: ["lands"],
      });

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

              const alreadyLiked = reel.owner_interaction?.liked ?? false;
              return {
                ...reel,
                owner_interaction: {
                  ...reel?.owner_interaction,
                  liked: !alreadyLiked,
                },
                interaction: {
                  ...reel?.interaction,
                  liked: reel.interaction
                    ? reel.interaction.liked + (alreadyLiked ? -1 : 1)
                    : alreadyLiked
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

  function handleLike() {
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
    <AnimatedPressable onPress={handleLike} className={cn("px-2", className)}>
      <Icon
        as={Heart}
        className={cn(
          "text-white w-9 h-9",
          liked && "text-primary fill-primary"
        )}
      />
    </AnimatedPressable>
  );
};

export default memo(ReelLikeButton);
