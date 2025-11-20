import { cn, formatNumberCompact, fullName } from "@/lib/utils";
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
import { Dot } from "lucide-react-native";
import { Rating } from "@/components/agent/Rating";

export function ProfileTopSection({ userData: agent }: { userData: Me }) {
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
  const isAgent = useMemo(() => {
    if (agent?.role == "agent" || agent?.role == "staff_agent") {
      return true;
    } else {
      return false;
    }
  }, [agent]);
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
            {isAgent ? (
              <View className="flex-row gap-1 items-center">
                <Text className="text-sm">
                  {me?.years_of_experience || "-"}
                </Text>
                <Text className="text-sm text-typography/80">
                  Years of Experience
                </Text>
              </View>
            ) : (
              <Text className="text-sm text-typography/80">{agent.email}</Text>
            )}
          </View>
          {isAgent && <Rating size={14} rating={0} total={0} />}
          <View className="flex-row gap-2 mt-3 items-center">
            <View className="gap-1 items-center flex-row">
              <Text className="text-sm font-medium">
                {formatNumberCompact(agent?.followers_count || 0)}
              </Text>
              <Text className="text-xs">Following</Text>
            </View>
            <Icon as={Dot} className="w-3 h-3" />
            <View className="gap-1 items-center flex-row">
              <Text className="text-sm font-medium">
                {formatNumberCompact(agent?.total_properties || 0)}
              </Text>
              <Text className="text-xs">Listings</Text>
            </View>
            <Icon as={Dot} className="w-3 h-3" />
            <View className="gap-1 items-center flex-row">
              <Text className="text-sm font-medium">
                {formatNumberCompact(agent?.likes_count || 0)}
              </Text>
              <Text className="text-xs">Likes</Text>
            </View>
          </View>
        </View>
      </View>
      {isAgent && agent?.about && (
        <View className="mt-2">
          <Text className="text-sm">{agent.about}</Text>
        </View>
      )}
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
        </View>
      ) : (
        <View className="flex-row mt-6 gap-4 justify-center items-center">
          <Button
            onPress={() =>
              router.push({
                pathname: "/profile/account",
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
                pathname: "/agents/[userId]/qrcode",
                params: {
                  userId: me?.id!,
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
