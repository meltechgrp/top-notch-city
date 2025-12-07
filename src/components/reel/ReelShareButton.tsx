import { LucideIcon, Share2 } from "lucide-react-native";
import { Icon, Pressable, useResolvedTheme } from "../ui";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { onInvite } from "@/actions/share";

interface Props {
  title: string;
  id: string;
  hasScrolledToDetails?: boolean;
  className?: string;
  icon?: LucideIcon;
}

const PropertyShareButton = ({
  title,
  id,
  hasScrolledToDetails,
  className,
  icon,
}: Props) => {
  const theme = useResolvedTheme();
  return (
    <Pressable
      both
      onPress={async () => {
        await onInvite({
          title,
          link: id,
        });
      }}
      style={{ padding: 8 }}
    >
      <Icon
        as={icon || Share2}
        className={cn(
          " text-white w-7 h-7",
          hasScrolledToDetails && theme == "light" && "text-black",
          className
        )}
      />
    </Pressable>
  );
};

export default memo(PropertyShareButton);
