import { useMutation } from "@tanstack/react-query";
import { addToWishList, removeFromWishList } from "@/actions/property";
import { memo } from "react";
import { cn } from "@/lib/utils";
import { openAccessModal } from "@/components/globals/AuthModals";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
import { Icon } from "@/components/ui";
import { Bookmark } from "lucide-react-native";
import { Property } from "@/db/models/properties";

interface Props {
  property: Property;
  className?: string;
  me: Account;
}

const PropertyWishListButton = ({ property, className, me }: Props) => {
  const { mutate } = useMutation({
    mutationFn: async () => {
      property?.added
        ? await removeFromWishList({ id: property.property_server_id })
        : await addToWishList({ id: property.property_server_id });
    },
  });
  async function hnadleWishList() {
    if (!me) {
      return openAccessModal({ visible: true });
    } else {
      await property.addToWishlist();
      mutate();
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
          "w-8 h-8",
          property?.added ? "text-info-100 fill-info-100" : "text-white"
        )}
      />
    </AnimatedPressable>
  );
};

export default memo(PropertyWishListButton);
