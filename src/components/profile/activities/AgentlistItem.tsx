import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { Avatar, AvatarFallbackText, AvatarImage, View } from "@/components/ui";
import {
  BadgeCheck,
  Check,
  Dot,
  Heart,
  House,
  Users,
} from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { generateMediaUrlSingle } from "@/lib/api";
import { profileDefault } from "@/store";
import { fullName } from "@/lib/utils";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
import { router } from "expo-router";
import { useFollowAgent } from "@/hooks/useFollowAgent";
import { openAccessModal } from "@/components/globals/AuthModals";
import { useMe } from "@/hooks/useMe";

export default function AgentListItem({
  data,
  queryKey,
}: {
  data: Agent;
  queryKey?: string[];
}) {
  const { agent } = data;
  const { me } = useMe();
  const { mutateAsync } = useFollowAgent({
    queryKey: queryKey || ["agents"],
    agentId: agent.id,
    is_following: data.is_following,
  });
  const handlePress = () => {
    if (!me) {
      return openAccessModal({ visible: true });
    }
    mutateAsync();
  };
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: "/agents/[userId]",
            params: {
              userId: agent?.id!,
            },
          });
        }}
        className="flex-row rounded-xl bg-background-muted items-center justify-between px-4 py-3"
      >
        <Avatar size="lg">
          {agent?.profile_image ? (
            <AvatarImage
              source={{
                uri: generateMediaUrlSingle(agent?.profile_image),
                cache: "force-cache",
              }}
            />
          ) : (
            <AvatarImage source={profileDefault} />
          )}
          <AvatarFallbackText>
            {agent.first_name} {agent.last_name}
          </AvatarFallbackText>
        </Avatar>

        <View className="flex-1 ml-3">
          <View className="flex-row items-center">
            <Text className="text-base">{fullName(agent)}</Text>
            <Icon
              as={BadgeCheck}
              size="md"
              className="fill-green-500 text-background-muted"
            />
          </View>
          <View className="flex flex-row gap-1 items-center">
            <View className="flex flex-row gap-2 items-center">
              <Icon as={House} size="sm" />
              <Text>{data.total_properties}</Text>
            </View>
            <Icon as={Dot} />
            <View className="flex flex-row items-center gap-2">
              <Icon as={Users} size="sm" />
              <Text className=" text-sm">{data.total_followers}</Text>
            </View>
            <Icon as={Dot} />
            <View className="flex flex-row items-center gap-2">
              <Icon as={Heart} size="sm" />
              <Text className=" text-sm">{data.total_likes}</Text>
            </View>
          </View>
        </View>
        <AnimatedPressable
          onPress={handlePress}
          className={`px-5 py-1.5 rounded-md ${
            data.is_following ? "bg-gray-500" : "bg-primary"
          }`}
        >
          <Text className={`font-semibold text-xs`}>
            {data.is_following ? "Following" : "Follow"}
          </Text>
        </AnimatedPressable>
      </TouchableOpacity>
    </>
  );
}
