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
  hasScrolledToDetails?: boolean;
}

const PropertyLikeButton = ({
  liked,
  id,
  hasScrolledToDetails,
  className,
}: Props) => {
  const theme = useResolvedTheme();
  const { hasAuth } = useStore();
  const client = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => likeProperty({ id }),
    // OPTIMISTIC UPDATE
    onMutate: async () => {
      await client.cancelQueries({
        queryKey: ["properties", id],
      });

      const previousData = client.getQueryData<Property | undefined>([
        "properties",
        id,
      ]);

      client.setQueryData<Property | undefined>(["properties", id], (old) => {
        if (!old) return old;
        const alreadyLiked = old.owner_interaction?.liked ?? false;
        return {
          ...old,
          owner_interaction: {
            ...old?.owner_interaction,
            liked: !alreadyLiked,
          },
          interaction: {
            ...old?.interaction,
            liked: old.interaction
              ? old.interaction.liked + (alreadyLiked ? -1 : 1)
              : alreadyLiked
                ? -1
                : 1,
          },
        };
      });

      return { previousData };
    },
    // If the request fails, rollback
    onError: (_err, _vars, ctx) => {
      console.log(_err);
      if (ctx?.previousData) {
        client.setQueryData(["properties", id], ctx.previousData);
      }
    },

    // After success, refetch in background to ensure sync
    onSettled: () => {
      client.invalidateQueries({ queryKey: ["properties", id] });
      client.invalidateQueries({ queryKey: ["properties"] });
    },
  });

  function handleLike() {
    if (!hasAuth) {
      return openAccessModal({ visible: true });
    }
    mutate();
  }

  return (
    <AnimatedPressable onPress={handleLike} className={cn("px-2", className)}>
      <Icon
        as={Heart}
        className={cn(
          "text-white w-9 h-9",
          hasScrolledToDetails && theme == "light" && "text-black",
          liked && "text-primary fill-primary"
        )}
      />
    </AnimatedPressable>
  );
};

export default memo(PropertyLikeButton);
