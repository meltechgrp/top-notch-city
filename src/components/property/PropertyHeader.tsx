import { Icon, Pressable, View } from "@/components/ui";
import { PropertyLikeButton } from "./PropertyLikeButton";
import { PropertyWishListButton } from "./PropertyWishListButton";
import { PropertyShareButton } from "./PropertyShareButton";
import PropertyActionsBottomSheet from "../modals/property/PropertyActionsBottomSheet";
import { ConfirmationModal } from "../modals/ConfirmationModal";
import { useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import { Colors } from "@/constants/Colors";
import { usePropertyActions } from "@/hooks/usePropertyActions";
import { router } from "expo-router";
import { Edit } from "lucide-react-native";

interface Props {
  property: Property;
}

export default function PropertyHeader({ property }: Props) {
  const [isActions, setIsActions] = useState(false);
  const { actions, isAdmin, isOwner } = usePropertyActions({ property });
  const ActionButton = () => (
    <Pressable
      both
      onPress={() => {
        setIsActions(true);
      }}
      className=""
    >
      <Entypo name="dots-three-horizontal" size={28} color={Colors.primary} />
    </Pressable>
  );
  return (
    <>
      {isAdmin && (
        <View className="pr-4 flex-row items-center gap-4">
          <PropertyShareButton property={property} />
          <PropertyLikeButton property={property} />
          <ActionButton />
        </View>
      )}
      {!isAdmin && isOwner && (
        <View className="pr-4 flex-row items-center gap-4">
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
            <Icon as={Edit} />
          </Pressable>
          <ActionButton />
        </View>
      )}
      {!isAdmin && !isOwner && (
        <View className="pr-4 flex-row items-center gap-4">
          <PropertyShareButton property={property} />
          <PropertyLikeButton property={property} />
          <PropertyWishListButton property={property} />
        </View>
      )}
      <PropertyActionsBottomSheet
        isOpen={isActions}
        onDismiss={() => setIsActions(false)}
        withBackground={false}
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
            iconClassName={option.iconClassName}
            propertyId={property.id}
            className={option.className}
            onDismiss={() => setIsActions(false)}
            onPress={onPress}
          />
        )}
      />
    </>
  );
}
