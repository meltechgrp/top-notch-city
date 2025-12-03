import { Icon, Pressable, useResolvedTheme, View } from "@/components/ui";
import ReelShareButton from "../reel/ReelShareButton";
import { usePropertyActions } from "@/hooks/usePropertyActions";
import { router } from "expo-router";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react-native";
import { cn, generateTitle } from "@/lib/utils";
import { useMemo, useState } from "react";
import { Alert } from "react-native";
import { usePropertyStatusMutations } from "@/tanstack/mutations/usePropertyStatusMutations";
import LikeButton from "@/components/property/LikeButton";
import WishListButton from "@/components/property/WishListButton";
import PropertyActionsBottomSheet from "@/components/modals/property/PropertyActionsBottomSheet";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";

interface Props {
  property: Property;
  hasScrolledToDetails?: boolean;
}

export default function PropertyHeader({
  property,
  hasScrolledToDetails,
}: Props) {
  const theme = useResolvedTheme();
  const { isAdmin, isOwner, isAgent, actions } = usePropertyActions({
    property,
  });
  const [openActions, setOpenActions] = useState(false);
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
          text: "Delete",
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
          <ReelShareButton title={generateTitle(property)} id={property.slug} />
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
            id={property.slug}
            title={generateTitle(property)}
          />
          <LikeButton
            liked={isLiked}
            id={property.id}
            hasScrolledToDetails={hasScrolledToDetails}
          />
          {property.status == "approved" && !isAdmin ? (
            <WishListButton
              id={property.id}
              isAdded={wishlisted}
              hasScrolledToDetails={hasScrolledToDetails}
            />
          ) : (
            <Pressable className="p-2" onPress={() => setOpenActions(true)}>
              <Icon className="w-7 h-7" as={MoreHorizontal} />
            </Pressable>
          )}
        </View>
      )}
      <PropertyActionsBottomSheet
        isOpen={openActions}
        onDismiss={() => setOpenActions(false)}
        options={actions.filter((action) => action.visible)}
        OptionComponent={({ index, option, onPress }) => (
          <ConfirmationModal
            key={index}
            visible={option.visible}
            index={index}
            header={option.header}
            description={option.description}
            actionText={option.actionText}
            requireReason={option.requireReason}
            onConfirm={option.onConfirm}
            propertyId={property.id}
            className={option.className}
            onDismiss={() => setOpenActions(false)}
            onPress={onPress}
          />
        )}
      />
    </>
  );
}
