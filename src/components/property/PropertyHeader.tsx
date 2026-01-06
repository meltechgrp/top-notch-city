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
import { Property } from "@/db/models/properties";
import { AnimatedLikeButton } from "@/components/custom/AnimatedLikeButton";
import { openAccessModal } from "@/components/globals/AuthModals";
import { useLike } from "@/hooks/useLike";

interface Props {
  property: Property;
  hasScrolledToDetails?: boolean;
  me: Account;
}

export default function PropertyHeader({
  property,
  hasScrolledToDetails,
  me,
}: Props) {
  const theme = useResolvedTheme();
  const { isOwner, actions } = usePropertyActions({
    property,
  });
  const { toggleLike } = useLike();
  const [openActions, setOpenActions] = useState(false);

  async function handleLike() {
    if (!me) {
      return openAccessModal({ visible: true });
    } else {
      await property.markAsLiked();
      toggleLike({ id: property.id });
    }
  }
  return (
    <>
      <View className="pr-4 flex-row bg-background/60 px-4 rounded-full mr-4 items-center gap-2">
        {property.status == "approved" && (
          <Pressable onPress={handleLike}>
            <AnimatedLikeButton
              liked={property?.liked || false}
              className="w-8 h-8 text-white"
            />
          </Pressable>
        )}
        {property.status == "approved" && !isOwner && (
          <WishListButton property={property} me={me} />
        )}
        {isOwner && (
          <Pressable
            both
            onPress={() =>
              router.push({
                pathname: "/property/[propertyId]/edit",
                params: {
                  propertyId: property.id,
                  userId: property.server_user_id,
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
