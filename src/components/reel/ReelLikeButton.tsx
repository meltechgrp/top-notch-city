import { Pressable } from "../ui";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { useStore } from "@/store";
import { openAccessModal } from "@/components/globals/AuthModals";
import { useLike } from "@/hooks/useLike";
import { AnimatedLikeButton } from "@/components/custom/AnimatedLikeButton";

interface Props {
  liked: boolean;
  id: string;
  className?: string;
  isLand?: boolean;
}

const ReelLikeButton = ({ liked, id, className, isLand }: Props) => {
  const { hasAuth } = useStore();
  const { toggleLike, isPending } = useLike({
    queryKey: [isLand ? "lands" : "reels"],
  });

  function handleLike() {
    if (!hasAuth) {
      return openAccessModal({ visible: true });
    } else if (!isPending) {
      toggleLike({ id });
    }
  }

  return (
    <Pressable onPress={handleLike} className={cn("px-2", className)}>
      <AnimatedLikeButton liked={liked} />
    </Pressable>
  );
};

export default memo(ReelLikeButton);
