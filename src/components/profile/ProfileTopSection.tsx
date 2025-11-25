import { formatNumberCompact, fullName } from "@/lib/utils";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Button,
  ButtonText,
  Icon,
  Pressable,
  Text,
  View,
} from "../ui";
import { getImageUrl } from "@/lib/api";
import { ChevronDown, Dot, Edit, Share } from "lucide-react-native";
import { openAccessModal } from "@/components/globals/AuthModals";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followAgent, unFollowAgent } from "@/actions/agent";
import { useMemo, useState } from "react";
import { router } from "expo-router";

export function ProfileTopSection({ userData: user }: { userData: Me }) {
  const [imageBottomSheet, setImageBottomSheet] = useState(false);
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
    <>
      <View className={"px-4 py-2 mt-2 bg-background"}>
        <View className={"flex-row gap-4 bg-background-muted p-4 rounded-2xl"}>
          <Pressable
            onPress={() => setImageBottomSheet(true)}
            className=" relative"
          >
            <Avatar className=" w-24 h-24 rounded-full">
              <AvatarFallbackText>{fullName(user)}</AvatarFallbackText>
              <AvatarImage
                className="rounded-full"
                source={getImageUrl(user?.profile_image)}
              />
            </Avatar>
            <View className=" absolute bottom-3 right-3">
              <Icon size="sm" as={Edit} />
            </View>
          </Pressable>
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
                  onPress={() =>
                    router.push({
                      pathname: "/agents/[userId]/activities",
                      params: {
                        userId: user.id,
                      },
                    })
                  }
                  className=" bg-background h-8 flex-1"
                >
                  <ButtonText>Following</ButtonText>
                  <Icon as={ChevronDown} className="w-5 h-5" />
                </Button>
                <Button
                  size={"sm"}
                  onPress={() =>
                    router.push({
                      pathname: "/agents/[userId]/account",
                      params: {
                        userId: user.id,
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
          <View className="flex-row mt-6 gap-4 justify-center items-center">
            <Button
              onPress={() =>
                router.push({
                  pathname: "/agents/[userId]/account",
                  params: {
                    userId: user.id,
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
                  pathname: "/agents/[userId]/qrcode",
                  params: {
                    userId: user.id,
                  },
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
      {/* <ProfileImageBottomSheet
        visible={imageBottomSheet}
        onDismiss={() => setImageBottomSheet(false)}
      /> */}
    </>
  );
}
