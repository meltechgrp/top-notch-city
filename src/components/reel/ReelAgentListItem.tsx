import React, { memo } from "react";
import { View, TouchableOpacity } from "react-native";
import { Check, Dot } from "lucide-react-native";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Icon,
  Text,
} from "@/components/ui";
import { generateMediaUrlSingle } from "@/lib/api";
import { profileDefault, useStore } from "@/store";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
import { router } from "expo-router";
import { openAccessModal } from "@/components/globals/AuthModals";
import { useFollowAgent } from "@/hooks/useFollowAgent";

const ReelAgentListItem = ({ account }: { account: AgentInfo }) => {
  const { me } = useStore();
  const { mutateAsync } = useFollowAgent({
    queryKey: ["agents"],
    agentId: account.id,
    is_following: account.is_following,
  });
  const handlePress = () => {
    if (!me) {
      return openAccessModal({ visible: true });
    }
    mutateAsync();
  };
  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/agents/[userId]",
          params: {
            userId: account?.id!,
          },
        });
      }}
      className="flex-row bg-background-muted items-center justify-between px-4 py-3"
    >
      <Avatar size="lg">
        {account?.profile_image ? (
          <AvatarImage
            source={{
              uri: generateMediaUrlSingle(account?.profile_image),
            }}
          />
        ) : (
          <AvatarImage source={profileDefault} />
        )}
        <AvatarFallbackText>
          {account.first_name} {account.last_name}
        </AvatarFallbackText>
      </Avatar>

      {/* Info */}
      <View className="flex-1 ml-3">
        <View className="flex-row items-center">
          <Text className="text-base">
            {account.first_name} {account.last_name}
          </Text>
          <View className="ml-1 bg-green-500 rounded-full p-px">
            <Icon as={Check} size="xs" />
          </View>
        </View>
        <View className="flex flex-row gap-2 items-center">
          <Text>{account.total_property_count}</Text>
          <Text className=" text-xs text-gray-400">Properties</Text>
        </View>
        <View className="flex flex-row items-center">
          <View className="flex flex-row items-center gap-2">
            <Text className=" text-sm">{account.followers_count}</Text>
            <Text className=" text-xs text-gray-400">Followers</Text>
          </View>
          <Icon as={Dot} />
          <View className="flex flex-row items-center gap-2">
            <Text className=" text-sm">{account.total_likes}</Text>
            <Text className=" text-xs text-gray-400">Likes</Text>
          </View>
        </View>
      </View>

      {/* Follow Button */}
      <AnimatedPressable
        onPress={handlePress}
        className={`px-5 py-1.5 rounded-full ${
          account.is_following ? "bg-gray-500" : "bg-primary"
        }`}
      >
        <Text className={`font-semibold text-xs`}>
          {account.is_following ? "Following" : "Follow"}
        </Text>
      </AnimatedPressable>
    </TouchableOpacity>
  );
};

export default memo(ReelAgentListItem);
