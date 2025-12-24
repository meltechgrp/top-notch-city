import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addToWishList,
  likeProperty,
  removeFromWishList,
} from "@/actions/property";
import { memo } from "react";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";
import { openAccessModal } from "@/components/globals/AuthModals";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
import { AnimatedLikeButton } from "@/components/custom/AnimatedLikeButton";

interface Props {
  isAdded: boolean;
  id: string;
  slug: string;
  className?: string;
  hasScrolledToDetails?: boolean;
}

const PropertyWishListButton = ({ isAdded, id, className, slug }: Props) => {
  const client = useQueryClient();
  const { me } = useStore();
  const { mutate } = useMutation({
    mutationFn: async () => {
      await likeProperty({ id });
      isAdded ? await removeFromWishList({ id }) : await addToWishList({ id });
    },

    onMutate: async () => {
      await client.cancelQueries({ queryKey: ["properties", slug] });

      const previousData = client.getQueryData<any | undefined>([
        "properties",
        slug,
      ]);

      client.setQueryData<any | undefined>(["properties", slug], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          owner_interaction: {
            ...old.owner_interaction,
            liked: !old.owner_interaction?.liked,
          },
          interaction: {
            ...old.interaction,
            liked: old.owner_interaction?.liked
              ? old.interaction.liked - 1
              : old.interaction.liked + 1,
          },
        };
      });

      return { previousData };
    },
    onError: (_err, _vars, ctx) => {
      console.log(_err);
      if (ctx?.previousData) {
        client.setQueryData(["properties", slug], ctx.previousData);
      }
    },
  });
  function hnadleWishList() {
    if (!me) {
      return openAccessModal({ visible: true });
    } else {
      mutate();
    }
  }
  return (
    <AnimatedPressable
      onPress={hnadleWishList}
      className={cn("px-2", className)}
    >
      <AnimatedLikeButton className="h-7 w-7" liked={isAdded} />
    </AnimatedPressable>
  );
};

export default memo(PropertyWishListButton);
