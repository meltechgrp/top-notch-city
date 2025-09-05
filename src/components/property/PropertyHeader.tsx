import { Icon, Pressable, useResolvedTheme, View } from "@/components/ui";
import ReelLikeButton from "../reel/ReelLikeButton";
import ReelWishListButton from "../reel/ReelWishListButton";
import ReelShareButton from "../reel/ReelShareButton";
import { usePropertyActions } from "@/hooks/usePropertyActions";
import { router } from "expo-router";
import { Edit, Trash2 } from "lucide-react-native";
import { cn, generateTitle } from "@/lib/utils";
import { useMemo } from "react";
import { Alert } from "react-native";
import { usePropertyStatusMutations } from "@/tanstack/mutations/usePropertyStatusMutations";

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
  const { mutate } = usePropertyStatusMutations().softDeleteMutation;
  const isLiked = useMemo(
    () => !!property.owner_interaction?.liked,
    [property]
  );
  const wishlisted = useMemo(
    () => !!property.owner_interaction?.added_to_wishlist,
    [property]
  );
  async function onDelete() {
    Alert.alert(
      "Delete",
      "Are you sure you want to delete this property?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            mutate(
              { propertyId: property.id },
              {
                onSuccess: () => {
                  router.back();
                },
              }
            );
          },
        },
      ],
      {}
    );
  }
  return (
    <>
      {isAgent && isOwner ? (
        <View className="pr-4 flex-row items-center gap-2">
          <ReelShareButton title={generateTitle(property)} id={property.id} />
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
          <Pressable
            both
            onPress={onDelete}
            className={
              "px-4 h-14 flex-row border-outline border-b justify-between rounded-xl items-center"
            }
          >
            <Icon size="xl" as={Trash2} className={cn(" text-white w-7 h-7")} />
          </Pressable>
        </View>
      ) : (
        <View className="pr-4 flex-row items-center gap-4">
          <ReelShareButton
            hasScrolledToDetails={hasScrolledToDetails}
            id={property.id}
            title={generateTitle(property)}
          />
          <ReelLikeButton
            liked={isLiked}
            id={property.id}
            hasScrolledToDetails={hasScrolledToDetails}
          />
          <ReelWishListButton
            id={property.id}
            isAdded={wishlisted}
            hasScrolledToDetails={hasScrolledToDetails}
          />
        </View>
      )}
    </>
  );
}
