import React, { useState } from "react";
import { View, Pressable, TouchableOpacity } from "react-native";
import { Check, CheckCircle } from "lucide-react-native";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Icon,
  Text,
} from "@/components/ui";
import { generateMediaUrlSingle } from "@/lib/api";
import { profileDefault } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followAgent, unFollowAgent } from "@/actions/agent";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
import { router } from "expo-router";

export const ReelAgentListItem = ({ account }: { account: AgentInfo }) => {
  const [following, setFollowing] = useState(false);
  const client = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: () =>
      following ? unFollowAgent(account.id) : followAgent(account.id),
    onMutate: async () => {
      await client.cancelQueries({ queryKey: ["reels"] });

      const previousData = client.getQueryData<
        | {
            results: AgentInfo[];
          }
        | undefined
      >(["reels"]);

      client.setQueryData<
        | {
            results: AgentInfo[];
          }
        | undefined
      >(["reels"], (old) => {
        if (!old?.results) return old;
        return {
          ...old,
          results: old.results.map((page) => ({
            ...page,
            // results: page.results?.map((reel) => {
            //   if (reel.id !== id) return reel;
            //   return {
            //     ...reel,
            //     owner_interaction: {
            //       ...reel?.owner_interaction,
            //       viewed: !viewed,
            //     },
            //     interaction: {
            //       ...reel?.interaction,
            //       added_to_wishlist: reel.interaction
            //         ? reel.interaction.added_to_wishlist + (viewed ? -1 : 1)
            //         : viewed
            //           ? -1
            //           : 1,
            //     },
            //   };
            // }),
          })),
        };
      });

      return { previousData };
    },
    // If the request fails, rollback
    onError: (_err, _vars, ctx) => {
      console.log(_err);
      if (ctx?.previousData) {
        client.setQueryData(["reels"], ctx.previousData);
      }
    },

    // After success, refetch in background to ensure sync
    onSettled: () => {
      client.invalidateQueries({ queryKey: ["reels"] });
    },
  });
  const handlePress = () => {
    mutate();
    setFollowing(!following);
  };
  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/profile/[user]",
          params: {
            user: account?.id!,
          },
        });
      }}
      className="flex-row items-center justify-between px-4 py-3"
    >
      {/* Avatar */}
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
          <Text className="text-lg">
            {account.first_name} {account.last_name}
          </Text>
          <View className="ml-1 bg-green-500 rounded-full p-px">
            <Icon as={Check} size="xs" />
          </View>
        </View>
        <Text className=" text-sm">
          {account.total_property_count} Properties
        </Text>
        <Text className=" text-sm">
          {account.followers_count} followers · {account.total_property_views}{" "}
          likes
        </Text>
      </View>

      {/* Follow Button */}
      <AnimatedPressable
        onPress={handlePress}
        className={`px-5 py-1.5 rounded-full ${
          following ? "bg-gray-500" : "bg-primary"
        }`}
      >
        <Text className={`font-semibold`}>
          {following ? "Following" : "Follow"}
        </Text>
      </AnimatedPressable>
    </TouchableOpacity>
  );
};
