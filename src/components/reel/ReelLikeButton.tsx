import { useMutation } from "@tanstack/react-query";
import { Icon, useResolvedTheme } from "../ui";
import { likeProperty } from "@/actions/property";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { useStore } from "@/store";
import { openSignInModal } from "@/components/globals/AuthModals";
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
  const { hasAuth, updateLike } = useStore();
  const { mutate } = useMutation({
    mutationFn: () => likeProperty({ id }),
  });

  function hnadleLike() {
    if (!hasAuth) {
      return openSignInModal({
        visible: true,
        onLoginSuccess: () => {
          updateLike(id);
          mutate();
        },
      });
    } else {
      updateLike(id);
      mutate();
    }
  }
  return (
    <AnimatedPressable onPress={hnadleLike} className={cn("px-2", className)}>
      <Icon
        as={Heart}
        className={cn(
          "text-white  w-8 h-8",
          hasScrolledToDetails && theme == "light" && "text-black",
          liked && "text-primary fill-primary"
        )}
      />
    </AnimatedPressable>
  );
};

export default memo(PropertyLikeButton);
