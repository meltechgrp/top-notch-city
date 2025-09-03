import { Icon, useResolvedTheme } from "../ui";
import { useMutation } from "@tanstack/react-query";
import { addToWishList, removeFromWishList } from "@/actions/property";
import { memo } from "react";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";
import { openSignInModal } from "@/components/globals/AuthModals";
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
  const { hasAuth, updateWishlist } = useStore();
  const { mutate } = useMutation({
    mutationFn: () => removeFromWishList({ id }),
    onSuccess: () => updateWishlist(id),
  });
  const { mutate: mutate2 } = useMutation({
    mutationFn: () => addToWishList({ id }),
    onSuccess: () => updateWishlist(id),
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
    <AnimatedPressable
      onPress={hnadleWishList}
      className={cn("px-2", className)}
    >
      <Icon
        as={Bookmark}
        className={cn(
          "text-white w-8 h-8",
          hasScrolledToDetails && theme == "light" && "text-black",
          isAdded && "text-primary fill-primary"
        )}
      />
    </AnimatedPressable>
  );
};

export default memo(PropertyWishListButton);
