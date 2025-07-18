import { Share2 } from "lucide-react-native";
import { Icon, Pressable, useResolvedTheme } from "../ui";
import { Share } from "react-native";
import { cn, FindAmenity } from "@/lib/utils";
import { memo } from "react";
import { onInvite } from "@/actions/share";

interface Props {
  property: Property;
  hasScrolledToDetails?: boolean;
}

const PropertyShareButton = ({ property, hasScrolledToDetails }: Props) => {
  const theme = useResolvedTheme();
  return (
    <Pressable
      both
      onPress={async () => {
        await onInvite({
          title: `${FindAmenity("Bedroom", property.amenities)} Bedroom ${property.subcategory?.name}`,
          imageUrl: property.media.find((item) => item.media_type == "IMAGE")
            ?.url!,
          link: property.id,
        });
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
