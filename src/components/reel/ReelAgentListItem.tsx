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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followAgent, unFollowAgent } from "@/actions/agent";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
import { router } from "expo-router";
import { openAccessModal } from "@/components/globals/AuthModals";

const ReelAgentListItem = ({ account }: { account: AgentInfo }) => {
  const client = useQueryClient();
  const { me } = useStore();
  const { mutate } = useMutation({
    mutationFn: () =>
      account.is_following
        ? unFollowAgent(account.id)
        : followAgent(account.id),
    onMutate: async () => {
      await client.cancelQueries({ queryKey: ["agents"] });

      const previousData = client.getQueryData<
        | {
            pages: AgentResult2[];
            pageParams: unknown[];
          }
        | undefined
      >(["agents"]);

      client.setQueryData<
        | {
            pages: AgentResult2[];
            pageParams: unknown[];
          }
        | undefined
      >(["agents"], (old) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            results: page.results?.map((agent) => {
              if (agent.id !== account.id) return agent;
              const following = agent.is_following;
              return {
                ...agent,
                is_following: !following,
              };
            }),
          })),
        };
      });

      return { previousData };
    },
    onError: (_err, _vars, ctx) => {
      console.log(_err);
      if (ctx?.previousData) {
        client.setQueryData(["agents"], ctx.previousData);
      }
    },
  });
  const handlePress = () => {
    if (!me) {
      return openAccessModal({ visible: true });
    }
    mutate();
  };
  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/agents/[user]",
          params: {
            user: account?.id!,
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
