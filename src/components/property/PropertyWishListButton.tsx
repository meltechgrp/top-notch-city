import { Pressable, useResolvedTheme } from "../ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToWishList, removeFromWishList } from "@/actions/property";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { memo, useMemo } from "react";
import { Colors } from "@/constants/Colors";
import { cn } from "@/lib/utils";

interface Props {
  property: Property;
  className?: string;
  hasScrolledToDetails?: boolean;
}

const PropertyWishListButton = ({
  property,
  hasScrolledToDetails,
  className,
}: Props) => {
  const client = useQueryClient();
  const theme = useResolvedTheme();
  function invalidate() {
    client.invalidateQueries({ queryKey: ["properties", property.id] });
    client.invalidateQueries({ queryKey: ["properties"] });
    client.invalidateQueries({ queryKey: ["wishlist"] });
  }
  const isAdded = useMemo(
    () => !!property.owner_interaction?.added_to_wishlist,
    [property]
  );
  const { mutate } = useMutation({
    mutationFn: () => removeFromWishList({ id: property.id }),
    onSuccess: () => invalidate(),
  });
  const { mutate: mutate2 } = useMutation({
    mutationFn: () => addToWishList({ id: property.id }),
    onSuccess: () => invalidate(),
  });
  function hnadleWishList() {
    if (isAdded) {
      mutate();
    } else {
      mutate2();
    }
  }
  return (
    <Pressable both onPress={hnadleWishList} className={cn("px-2", className)}>
      <FontAwesome
        name={isAdded ? "bookmark" : "bookmark-o"}
        size={24}
        color={
          isAdded
            ? Colors.primary
            : hasScrolledToDetails && theme == "light"
              ? "text-black"
              : "white"
        }
      />
    </Pressable>
  );
};

export default memo(PropertyWishListButton);
