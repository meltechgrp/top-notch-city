import { Icon, Pressable, View } from "@/components/ui";
import { PropertyLikeButton } from "./PropertyLikeButton";
import { PropertyWishListButton } from "./PropertyWishListButton";
import { PropertyShareButton } from "./PropertyShareButton";
import { usePropertyActions } from "@/hooks/usePropertyActions";
import { router } from "expo-router";
import { Edit } from "lucide-react-native";

interface Props {
  property: Property;
}

export default function PropertyHeader({ property }: Props) {
  const { isAdmin, isOwner } = usePropertyActions({ property });
  return (
    <>
      {isAdmin && (
        <View className="pr-4 flex-row items-center gap-4">
          <PropertyShareButton property={property} />
          <PropertyLikeButton property={property} />
        </View>
      )}
      {!isAdmin && isOwner && (
        <View className="pr-4 flex-row items-center gap-2">
          <PropertyShareButton property={property} />
          <Pressable
            both
            onPress={() =>
              router.push({
                pathname: "/property/[propertyId]/edit",
                params: {
                  propertyId: property.id,
                },
              })
            }
            className={
              "px-4 h-14 flex-row border-outline border-b justify-between rounded-xl items-center"
            }
          >
            <Icon size="xl" as={Edit} />
          </Pressable>
        </View>
      )}
      {!isAdmin && !isOwner && (
        <View className="pr-4 flex-row items-center gap-4">
          <PropertyShareButton property={property} />
          <PropertyLikeButton property={property} />
          <PropertyWishListButton property={property} />
        </View>
      )}
    </>
  );
}
