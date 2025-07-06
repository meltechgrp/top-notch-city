import { Share2 } from "lucide-react-native";
import { Icon, Pressable, useResolvedTheme } from "../ui";
import { Share } from "react-native";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface Props {
  property: Property;
  hasScrolledToDetails?: boolean;
}

const PropertyShareButton = ({ property, hasScrolledToDetails }: Props) => {
  const theme = useResolvedTheme();
  async function onInvite() {
    try {
      const result = await Share.share({
        message: `Share ${property.title} property to friends or family.`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      alert(error.message);
    }
  }
  return (
    <Pressable
      both
      onPress={async () => {
        await onInvite();
      }}
      style={{ padding: 8 }}
    >
      <Icon
        as={Share2}
        className={cn(
          " text-white w-7 h-7",
          hasScrolledToDetails && theme == "light" && "text-black"
        )}
      />
    </Pressable>
  );
};

export default memo(PropertyShareButton);
