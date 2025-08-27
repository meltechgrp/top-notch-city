import { Icon, Pressable, useResolvedTheme } from "../ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToWishList, removeFromWishList } from "@/actions/property";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { memo, useMemo } from "react";
import { Colors } from "@/constants/Colors";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";
import { openSignInModal } from "@/components/globals/AuthModals";
import { Bookmark } from "lucide-react-native";

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
  const { hasAuth } = useStore();
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
    if (!hasAuth) {
      return openSignInModal({
        visible: true,
        onLoginSuccess: () => mutate(),
      });
    }
    if (isAdded) {
      mutate();
    } else {
      mutate2();
    }
  }
  return (
    <Pressable both onPress={hnadleWishList} className={cn("px-2", className)}>
      <Icon
        as={Bookmark}
        className={cn(
          "text-white fill-white w-8 h-8",
          hasScrolledToDetails && theme == "light" && "text-black fill-black",
          isAdded && "text-primary fill-primary"
        )}
      />
    </Pressable>
  );
};

export default memo(PropertyWishListButton);
