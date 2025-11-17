import { cn, fullName } from "@/lib/utils";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Button,
  ButtonText,
  Icon,
  Text,
  View,
} from "../ui";
import { getImageUrl } from "@/lib/api";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import {
  openAccessModal,
  openAgentModal,
  openEnquiryModal,
} from "@/components/globals/AuthModals";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followAgent, unFollowAgent } from "@/actions/agent";
import { useStore } from "@/store";
import { useMemo } from "react";
import { router } from "expo-router";

export function ProfileTopSection({
  userData: agent,
  showAgents,
  setShowAgents,
}: {
  userData: Me;
  showAgents: boolean;
  setShowAgents: (data: boolean) => void;
}) {
  const client = useQueryClient();
  const { me } = useStore.getState();
  const { mutate } = useMutation({
    mutationFn: () =>
      agent?.is_following ? unFollowAgent(agent.id) : followAgent(agent.id),

    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["user", agent.id] });
    },
  });
  const handlePress = () => {
    if (!agent) {
      return openAccessModal({ visible: true });
    }
    mutate();
  };
  const isOwner = useMemo(() => me?.id == agent?.id, [me, agent]);
  return (
    <View className={"px-4 py-2 mt-2 bg-background"}>
      <View className={"flex-row gap-4"}>
        <Avatar className=" w-28 h-28 rounded-full">
          <AvatarFallbackText>{fullName(agent)}</AvatarFallbackText>
          <AvatarImage
            className="rounded-full"
            source={getImageUrl(agent?.profile_image)}
          />
        </Avatar>
        <View className="flex-1">
          <View className="">
            <Text className="text-lg font-semibold">{fullName(agent)}</Text>
          </View>
          <View className="flex-row gap-4 mt-3">
            <View className="flex-1 gap-1">
              <Text className="text-xl font-bold">
                {agent?.followers_count}
              </Text>
              <Text className="text-sm font-light">Following</Text>
            </View>
            <View className="flex-1 gap-1">
              <Text className="text-xl font-bold">
                {agent?.total_properties}
              </Text>
              <Text className="text-sm font-light">Listings</Text>
            </View>
            <View className="flex-1 gap-1">
              <Text className="text-xl font-bold">{agent?.likes_count}</Text>
              <Text className="text-sm font-light">Likes</Text>
            </View>
          </View>
        </View>
      </View>
      {!isOwner ? (
        <View className="flex-row mt-6 gap-4 justify-center items-center">
          <Button onPress={handlePress} className=" h-10 flex-1">
            <ButtonText>
              {agent?.is_following ? "Following" : "Follow"}
            </ButtonText>
          </Button>
          <Button
            onPress={() => openEnquiryModal({ visible: true })}
            className="bg-gray-500 h-10 flex-1"
          >
            <ButtonText>Report</ButtonText>
          </Button>
          {/* <Button
            onPress={() => setShowAgents(!showAgents)}
            className="bg-gray-500 active:bg-gray-600 h-10 px-4"
          >
            <Icon
              as={showAgents ? ChevronUp : ChevronDown}
              className={cn(" w-6 h-6", showAgents ? "text-primary" : "")}
            />
          </Button> */}
        </View>
      ) : (
        <View className="flex-row mt-6 gap-4 justify-center items-center">
          <Button
            onPress={() =>
              router.push({
                pathname: "/agents/[user]/account",
                params: {
                  user: agent.id,
                },
              })
            }
            className=" h-10 flex-1"
          >
            <ButtonText>Edit Profile</ButtonText>
          </Button>
          <Button
            onPress={() =>
              router.push({
                pathname: "/agents/[user]/qrcode",
                params: {
                  user: me?.id!,
                },
              })
            }
            className="bg-gray-500 h-10 flex-1"
          >
            <ButtonText>Share Profile</ButtonText>
          </Button>
        </View>
      )}
    </View>
  );
}
