import { formatNumberCompact, fullName } from "@/lib/utils";
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
import { ChevronDown, Dot, Edit, Share } from "lucide-react-native";
import { openAccessModal } from "@/components/globals/AuthModals";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followAgent, unFollowAgent } from "@/actions/agent";
import { useMemo } from "react";
import { router } from "expo-router";

export function ProfileTopSection({ userData: user }: { userData: Me }) {
  const client = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: () =>
      user?.is_following ? unFollowAgent(user.id) : followAgent(user.id),

    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["user", user.id] });
    },
  });
  const handlePress = () => {
    if (!user) {
      return openAccessModal({ visible: true });
    }
    mutate();
  };
  const isAgent = useMemo(() => {
    if (user?.role == "agent" || user?.role == "staff_agent") {
      return true;
    } else {
      return false;
    }
  }, [user]);
  return (
    <View className={"px-4 py-2 mt-2 bg-background"}>
      <View className={"flex-row gap-4 bg-background-muted p-4 rounded-2xl"}>
        <Avatar className=" w-24 h-24 rounded-full">
          <AvatarFallbackText>{fullName(user)}</AvatarFallbackText>
          <AvatarImage
            className="rounded-full"
            source={getImageUrl(user?.profile_image)}
          />
        </Avatar>
        <View className="flex-1">
          <View className="">
            <Text numberOfLines={1} className="text-lg font-semibold">
              {fullName(user)}
            </Text>
          </View>
          <View className="flex-row gap-2 mt-3 items-center">
            <View className="gap-1 items-center flex-row">
              <Text className="text-sm font-medium">
                {formatNumberCompact(user?.followers_count || 0)}
              </Text>
              <Text className="text-xs">Following</Text>
            </View>
            <Icon as={Dot} className="w-3 h-3" />
            <View className="gap-1 items-center flex-row">
              <Text className="text-sm font-medium">
                {formatNumberCompact(user?.total_properties || 0)}
              </Text>
              <Text className="text-xs">Listings</Text>
            </View>
            <Icon as={Dot} className="w-3 h-3" />
            <View className="gap-1 items-center flex-row">
              <Text className="text-sm font-medium">
                {formatNumberCompact(user?.likes_count || 0)}
              </Text>
              <Text className="text-xs">Likes</Text>
            </View>
          </View>
          {!isAgent && (
            <View className="flex-row mt-4 gap-6 justify-center items-center">
              <Button
                size={"sm"}
                onPress={handlePress}
                className=" bg-background h-8 flex-1"
              >
                <ButtonText>Following</ButtonText>
                <Icon as={ChevronDown} className="w-5 h-5" />
              </Button>
              <Button
                size={"sm"}
                onPress={() =>
                  router.push({
                    pathname: "/profile/account",
                    params: {
                      user: user.id,
                    },
                  })
                }
                className=" h-8 flex-1"
              >
                <Icon as={Edit} className="w-4 h-4" />
                <ButtonText>Edit</ButtonText>
              </Button>
            </View>
          )}
        </View>
      </View>
      {isAgent && (
        <View className="mt-2">
          <Text className="text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio odio
            explicabo dolore aperiam repellendus corporis.
          </Text>
        </View>
      )}
      {isAgent && (
        <View className="flex-row mt-6 gap-4 justify-center items-center">
          <Button
            onPress={() =>
              router.push({
                pathname: "/profile/account",
                params: {
                  user: user.id,
                },
              })
            }
            className=" h-10 flex-1"
          >
            <Icon as={Edit} className="w-4 h-4" />
            <ButtonText>Edit</ButtonText>
          </Button>
          <Button
            onPress={() =>
              router.push({
                pathname: "/profile/qrcode",
              })
            }
            className="bg-gray-500 h-10 flex-1"
          >
            <Icon as={Share} className="w-4 h-4" />
            <ButtonText>Share</ButtonText>
          </Button>
        </View>
      )}
    </View>
  );
}
