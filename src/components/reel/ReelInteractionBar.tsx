import { startChat } from "@/actions/message";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import ReelLikeButton from "@/components/reel/ReelLikeButton";
import ReelShareButton from "@/components/reel/ReelShareButton";
import ReelWishListButton from "@/components/reel/ReelWishListButton";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Icon,
  Text,
  View,
} from "@/components/ui";
import { generateMediaUrl } from "@/lib/api";
import { fullNameLocal } from "@/lib/utils";
import { profileDefault } from "@/store";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { MessageSquareMore, MoreHorizontal } from "lucide-react-native";
import { memo, useMemo } from "react";

function ReelInteractionBar({
  reel,
  showChat = true,
  showShare = true,
  showMuted = false,
  isLand,
  setShowBottomSheet,
}: ReelInteractionBar) {
  const { mutateAsync } = useMutation({
    mutationFn: startChat,
  });
  const isLiked = useMemo(
    () => !!reel?.owner_interaction?.liked,
    [reel?.owner_interaction]
  );
  const isAdded = useMemo(
    () => !!reel?.owner_interaction?.added_to_wishlist,
    [reel?.owner_interaction]
  );
  const record = useMemo(() => reel?.interations, [reel?.interations]);
  return (
    <View className=" gap-4 ml-auto items-center">
      <AnimatedPressable
        className=" relative"
        onPress={() => {
          router.push({
            pathname: "/agents/[userId]",
            params: {
              userId: reel?.owner?.id!,
            },
          });
        }}
      >
        <Avatar>
          {reel?.owner?.profileImage ? (
            <AvatarImage
              source={
                {
                  uri: generateMediaUrl({
                    url: reel.owner.profileImage,
                    id: "",
                    mediaType: "IMAGE",
                  }),
                }.uri
              }
            />
          ) : (
            <AvatarImage source={profileDefault} />
          )}
          <AvatarFallbackText>{fullNameLocal(reel?.owner)}</AvatarFallbackText>
        </Avatar>
      </AnimatedPressable>
      <View className=" items-center">
        <ReelLikeButton liked={isLiked} isLand={isLand} id={reel.id} />
        <Text className=" text-white">{record?.liked || 0}</Text>
      </View>
      <View className=" items-center">
        <ReelWishListButton isAdded={isAdded} isLand={isLand} id={reel.id} />
        <Text className=" text-white">{record?.addedToWishlist || 0}</Text>
      </View>
      {showChat && (
        <View className=" items-center">
          <AnimatedPressable
            onPress={async () => {
              await mutateAsync(
                {
                  property_id: reel.id!,
                  member_id: reel?.owner?.id!,
                },
                {
                  onError: (e) => {
                    showErrorAlert({
                      title: "Unable to start chat",
                      alertType: "error",
                    });
                  },
                  onSuccess: (data) => {
                    router.replace({
                      pathname: "/chats/[chatId]",
                      params: {
                        chatId: data,
                      },
                    });
                  },
                }
              );
            }}
          >
            <Icon as={MessageSquareMore} className=" text-white w-7 h-7" />
          </AnimatedPressable>
          <Text className="text-xs text-white">Chat</Text>
        </View>
      )}
      {showShare && (
        <View className=" items-center">
          <ReelShareButton title={reel.title} id={reel.slug} />
          <Text className="text-xs text-white">Share</Text>
        </View>
      )}

      {showMuted && (
        <AnimatedPressable
          onPress={setShowBottomSheet}
          className=" w-12 h-12 rounded-full bg-gray-500/60 items-center justify-center"
        >
          <Icon as={MoreHorizontal} className="text-white w-7 h-7" />
        </AnimatedPressable>
      )}
    </View>
  );
}

export default memo(ReelInteractionBar);
