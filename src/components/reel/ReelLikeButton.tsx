import { Pressable } from "../ui";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { openAccessModal } from "@/components/globals/AuthModals";
import { useLike } from "@/hooks/useLike";
import { AnimatedLikeButton } from "@/components/custom/AnimatedLikeButton";
import { useMe } from "@/hooks/useMe";

interface Props {
  liked: boolean;
  id: string;
  className?: string;
  isLand?: boolean;
}

const ReelLikeButton = ({ liked, id, className, isLand }: Props) => {
  const { me } = useMe();
  const { toggleLike, isPending } = useLike({
    queryKey: [isLand ? "lands" : "reels"],
  });

  function handleLike() {
    if (!me) {
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
