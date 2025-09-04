import { startChat } from "@/actions/message";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import ReelLikeButton from "@/components/reel/ReelLikeButton";
import ReelShareButton from "@/components/reel/ReelShareButton";
import ReelWishListButton from "@/components/reel/ReelWishListButton";
import { Avatar, AvatarImage, Icon, Text, View } from "@/components/ui";
import { generateMediaUrl } from "@/lib/api";
import { profileDefault } from "@/store";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { MessageSquareMore, MoreHorizontal } from "lucide-react-native";
import { useMemo } from "react";

export function ReelInteractionBar({
  reel,
  showChat = true,
  showShare = true,
  showMuted = false,
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
  const record = useMemo(() => reel?.interations, [reel.interations]);
  return (
    <View className=" gap-6 ml-auto items-center">
      <AnimatedPressable
        onPress={() => {
          router.push({
            pathname: "/profile/[user]",
            params: {
              user: reel?.owner?.id!,
            },
          });
        }}
      >
        <Avatar>
          {reel?.owner?.profile_image ? (
            <AvatarImage
              source={
                {
                  uri: generateMediaUrl({
                    url: reel.owner.profile_image,
                    id: "",
                    media_type: "IMAGE",
                  }),
                }.uri
              }
            />
          ) : (
            <AvatarImage source={profileDefault} />
          )}
        </Avatar>
      </AnimatedPressable>
      <View className=" items-center">
        <ReelLikeButton liked={isLiked} id={reel.id} />
        <Text className=" text-white">{record?.liked || 0}</Text>
      </View>
      <View className=" items-center">
        <ReelWishListButton isAdded={isAdded} id={reel.id} />
        <Text className=" text-white">{record?.added_to_wishlist || 0}</Text>
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
                      pathname: "/messages/[chatId]",
                      params: {
                        chatId: data,
                      },
                    });
                  },
                }
              );
            }}
          >
            <Icon as={MessageSquareMore} className=" text-white w-8 h-8" />
          </AnimatedPressable>
          <Text className="text-xs text-white">Chat</Text>
        </View>
      )}
      {showShare && (
        <View className=" items-center">
          <ReelShareButton title={reel.title} id={reel.id} />
          <Text className="text-xs text-white">Share</Text>
        </View>
      )}

      {showMuted && (
        <AnimatedPressable
          onPress={setShowBottomSheet}
          className=" w-12 h-12 rounded-full bg-gray-500/60 items-center justify-center"
        >
          <Icon as={MoreHorizontal} className="text-white w-8 h-8" />
        </AnimatedPressable>
      )}
    </View>
  );
}
