import { Icon, Pressable, useResolvedTheme, View } from "@/components/ui";
import ReelShareButton from "../reel/ReelShareButton";
import { usePropertyActions } from "@/hooks/usePropertyActions";
import { router } from "expo-router";
import { Edit, MoreHorizontal, Share } from "lucide-react-native";
import { cn } from "@/lib/utils";
import { useState } from "react";
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
  const { isOwner, actions } = usePropertyActions({
    property,
  });
  const [openActions, setOpenActions] = useState(false);
  return (
    <>
      <View className="pr-4 flex-row bg-background/60 px-4 rounded-full mr-4 items-center gap-2">
        {property.status == "approved" && (
          <WishListButton
            id={property.id}
            slug={property.slug}
            isAdded={!!property.liked}
            hasScrolledToDetails={hasScrolledToDetails}
          />
        )}
        {isOwner && (
          <Pressable
            both
            onPress={() =>
              router.push({
                pathname: "/property/[propertyId]/edit",
                params: {
                  propertyId: property.id,
                  userId: property.ownerId,
                },
              })
            }
            className={
              "px-4 h-12 flex-row border-outline border-b justify-between rounded-xl items-center"
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
        )}
        <ReelShareButton
          icon={Share}
          className="h-7 w-7"
          title={property.title}
          id={property.slug}
        />
        <Pressable className="p-2" onPress={() => setOpenActions(true)}>
          <Icon className="w-7 h-7" as={MoreHorizontal} />
        </Pressable>
      </View>
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
