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
  hasScrolledToDetails?: boolean;
}

const PropertyWishListButton = ({
  isAdded,
  id,
  hasScrolledToDetails,
  className,
}: Props) => {
  const theme = useResolvedTheme();
  const client = useQueryClient();
  const { hasAuth } = useStore();
  const { mutate } = useMutation({
    mutationFn: () =>
      isAdded ? removeFromWishList({ id }) : addToWishList({ id }),

    onMutate: async () => {
      await client.cancelQueries({ queryKey: ["properties", id] });

      const previousData = client.getQueryData<Property | undefined>([
        "properties",
        id,
      ]);

      client.setQueryData<Property | undefined>(["properties", id], (old) => {
        if (!old) return old;
        const added = old.owner_interaction?.added_to_wishlist ?? false;
        return {
          ...old,
          owner_interaction: {
            ...old?.owner_interaction,
            added_to_wishlist: !added,
          },
          interaction: {
            ...old?.interaction,
            added_to_wishlist: old.interaction
              ? old.interaction.added_to_wishlist + (added ? -1 : 1)
              : added
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
    },
  });
  function hnadleWishList() {
    if (!hasAuth) {
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
      <Icon
        as={Bookmark}
        className={cn(
          "text-white w-9 h-9",
          hasScrolledToDetails && theme == "light" && "text-black",
          isAdded && "text-primary fill-primary"
        )}
      />
    </AnimatedPressable>
  );
};

export default memo(PropertyWishListButton);
