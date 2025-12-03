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
  BadgeCheck,
  Check,
  ChevronDown,
  Dot,
  Edit,
  MessageCircle,
  Share2,
} from "lucide-react-native";
import { openAccessModal } from "@/components/globals/AuthModals";
import { router } from "expo-router";
import { useFollowAgent } from "@/hooks/useFollowAgent";
import { UserType } from "@/components/profile/ProfileWrapper";
import { Rating } from "@/components/agent/Rating";
import {
  ImageViewerProvider,
  ProfileImageTrigger,
} from "@/components/custom/ImageViewerProvider";

export function ProfileTopSection({
  user,
  userType,
  isAgent,
  setShowActions,
}: {
  user: Me;
  userType: UserType;
  isAgent?: boolean;
  setShowActions: () => void;
}) {
  const { mutateAsync } = useFollowAgent({
    queryKey: ["user", user.id],
    agentId: user.id,
    is_following: user.is_following || false,
  });
  const handlePress = () => {
    if (!user) {
      return openAccessModal({ visible: true });
    }
    mutateAsync();
  };

  const ActionButtons = {
    visitor: [
      {
        action: handlePress,
        label: user?.is_following ? "Unfollow" : "Follow",
        icon: Check,
      },
      {
        action: handlePress,
        label: "Message",
        icon: MessageCircle,
      },
    ],
    admin: [
      {
        action: setShowActions,
        label: user.role.toUpperCase(),
        icon: ChevronDown,
      },
      {
        action: () =>
          router.push({
            pathname: "/agents/[userId]/qrcode",
            params: {
              userId: user.id,
            },
          }),
        label: "Share",
        icon: Share2,
      },
    ],
    owner: [
      ...[
        isAgent
          ? {
              action: () =>
                router.push({
                  pathname: "/agents/[userId]/qrcode",
                  params: {
                    userId: user.id,
                  },
                }),
              label: "Share",
              icon: Share2,
            }
          : {
              action: () =>
                router.push({
                  pathname: "/agents/[userId]/activities",
                  params: {
                    userId: user.id,
                  },
                }),
              label: "Following",
              icon: ChevronDown,
            },
      ],
      {
        action: () =>
          router.push({
            pathname: "/agents/[userId]/account",
            params: {
              userId: user.id,
            },
          }),
        label: "Edit",
        icon: Edit,
      },
    ],
  };
  return (
    <>
      <View className={"px-4 py-2 mt-2"}>
        <View className={"flex-row gap-4 rounded-2xl"}>
          <ImageViewerProvider>
            <ProfileImageTrigger
              image={[
                {
                  url: user?.profile_image!,
                  id: user.id,
                  media_type: "IMAGE",
                },
              ]}
            >
              <Avatar className="w-24 h-24 rounded-full">
                <AvatarFallbackText>{fullName(user)}</AvatarFallbackText>
                <AvatarImage
                  className="rounded-full"
                  source={getImageUrl(user?.profile_image)}
                />
              </Avatar>
            </ProfileImageTrigger>
          </ImageViewerProvider>

          <View className="flex-1">
            <View className="">
              <View className="flex-row justify-between items-center">
                <Text
                  numberOfLines={1}
                  className="text-lg flex-1 font-semibold"
                >
                  {fullName(user)}
                </Text>
                {userType == "admin" && user.verified && (
                  <Icon
                    as={BadgeCheck}
                    className="fill-green-500 text-background-muted"
                  />
                )}
              </View>
              {userType == "visitor" ? (
                <View className="flex-row gap-1 items-center">
                  <Text className="text-sm">
                    {user?.agent_profile?.years_of_experience || "-"}
                  </Text>
                  <Text className="text-sm text-typography/80">
                    Years of Experience
                  </Text>
                </View>
              ) : (
                <Text className="text-xs text-typography/80">{user.email}</Text>
              )}
            </View>
            {!isAgent && (
              <Rating
                size={14}
                rating={user.agent_profile?.average_rating || 0}
                total={user.agent_profile?.total_reviews || 0}
              />
            )}
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
          </View>
        </View>
        <View className="flex-row mt-6 gap-4 justify-center items-center">
          {ActionButtons[userType].map((a, i) => (
            <Button
              key={a.label}
              onPress={a.action}
              className={cn(" h-10 flex-1", i == 0 && "bg-background-muted")}
            >
              <ButtonText>{a.label}</ButtonText>
              <Icon as={a.icon} className="w-4 h-4" />
            </Button>
          ))}
        </View>
      </View>
    </>
  );
}
