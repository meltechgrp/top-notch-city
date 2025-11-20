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
} from "@/components/ui";
import { getImageUrl } from "@/lib/api";
import { ChevronDown, Dot, Share } from "lucide-react-native";
import { router } from "expo-router";

export function AdminProfileTopSection({
  userData: user,
  setShowActions,
}: {
  userData: Me;
  setShowActions: () => void;
}) {
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
          <View className="flex-row mt-4 gap-6 justify-center items-center">
            <Button
              size={"sm"}
              onPress={setShowActions}
              className=" bg-background h-8 flex-1"
            >
              <ButtonText className="capitalize">{user.role}</ButtonText>
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
              <Icon as={Share} className="w-4 h-4" />
              <ButtonText>Share</ButtonText>
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}
