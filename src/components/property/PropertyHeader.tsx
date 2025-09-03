import { Icon, Pressable, useResolvedTheme, View } from "@/components/ui";
import ReelLikeButton from "../reel/ReelLikeButton";
import ReelWishListButton from "../reel/ReelWishListButton";
import ReelShareButton from "../reel/ReelShareButton";
import { usePropertyActions } from "@/hooks/usePropertyActions";
import { router } from "expo-router";
import { Edit } from "lucide-react-native";
import { cn, generateTitle } from "@/lib/utils";

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
          <ReelShareButton title={generateTitle(property)} id={property.id} />
          {/* <PropertyLikeButton
            hasScrolledToDetails={hasScrolledToDetails}
            id={property.id}
          /> */}
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
          <ReelShareButton
            hasScrolledToDetails={hasScrolledToDetails}
            id={property.id}
            title={generateTitle(property)}
          />
          {/* <ReelLikeButton
            hasScrolledToDetails={hasScrolledToDetails}
            property={property}
          />
          <ReelWishListButton
            hasScrolledToDetails={hasScrolledToDetails}
            property={property}
          /> */}
        </View>
      )}
    </>
  );
}
