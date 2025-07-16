import { Icon, Pressable, useResolvedTheme, View } from "@/components/ui";
import PropertyLikeButton from "./PropertyLikeButton";
import PropertyWishListButton from "./PropertyWishListButton";
import PropertyShareButton from "./PropertyShareButton";
import { usePropertyActions } from "@/hooks/usePropertyActions";
import { router } from "expo-router";
import { Edit } from "lucide-react-native";
import { cn } from "@/lib/utils";

interface Props {
  property: Property;
  hasScrolledToDetails?: boolean;
}

export default function PropertyHeader({
  property,
  hasScrolledToDetails,
}: Props) {
  const theme = useResolvedTheme();
  const { isAdmin, isOwner, isAgent } = usePropertyActions({ property });
  return (
    <>
      {isAgent && isOwner ? (
        <View className="pr-4 flex-row items-center gap-2">
          <PropertyShareButton property={property} />
          <PropertyLikeButton
            hasScrolledToDetails={hasScrolledToDetails}
            property={property}
          />
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
            <Icon
              size="xl"
              as={Edit}
              className={cn(
                " text-white w-7 h-7",
                hasScrolledToDetails && theme == "light" && "text-black"
              )}
            />
          </Pressable>
        </View>
      ) : (
        <View className="pr-4 flex-row items-center gap-4">
          <PropertyShareButton
            hasScrolledToDetails={hasScrolledToDetails}
            property={property}
          />
          <PropertyLikeButton
            hasScrolledToDetails={hasScrolledToDetails}
            property={property}
          />
          <PropertyWishListButton
            hasScrolledToDetails={hasScrolledToDetails}
            property={property}
          />
        </View>
      )}
    </>
  );
}
