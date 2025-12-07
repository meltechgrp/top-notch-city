import { Icon } from "../ui";
import { memo } from "react";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";
import { openAccessModal } from "@/components/globals/AuthModals";
import { Bookmark } from "lucide-react-native";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
import { useWishlist } from "@/hooks/useWishlist";

interface Props {
  isAdded: boolean;
  id: string;
  className?: string;
  isLand?: boolean;
}

const ReelWishListButton = ({ isAdded, id, isLand, className }: Props) => {
  const { me } = useStore();
  const { toggleWishlist, isPending } = useWishlist({
    queryKey: [isLand ? "lands" : "reels"],
  });
  function hnadleWishList() {
    if (!me) {
      return openAccessModal({ visible: true });
    } else if (!isPending) {
      toggleWishlist({ id, isAdded });
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
          isAdded && "text-primary fill-primary"
        )}
      />
    </AnimatedPressable>
  );
};

export default memo(ReelWishListButton);
