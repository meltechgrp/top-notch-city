import { Text } from "@/components/ui/text";
import { Avatar, AvatarFallbackText, AvatarImage, View } from "@/components/ui";
import { TouchableOpacity } from "react-native";
import { generateMediaUrlSingle } from "@/lib/api";
import { profileDefault, useStore } from "@/store";
import { fullName } from "@/lib/utils";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
import { openAccessModal } from "@/components/globals/AuthModals";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unBlockedUser } from "@/actions/user";
import { useMe } from "@/hooks/useMe";

export function BlockListItem({ user }: { user: Blocked }) {
  const { me, isAdmin, isAgent } = useMe();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => unBlockedUser(user.id),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["blocked"],
      });
    },
  });
  const handlePress = () => {
    if (!me) {
      return openAccessModal({ visible: true });
    }
    mutateAsync();
  };
  return (
    <>
      <TouchableOpacity className="flex-row bg-background-muted items-center justify-between px-4 py-3">
        <Avatar size="lg">
          {user?.profile_image ? (
            <AvatarImage
              source={{
                uri: generateMediaUrlSingle(user?.profile_image),
              }}
            />
          ) : (
            <AvatarImage source={profileDefault} />
          )}
          <AvatarFallbackText>
            {user.first_name} {user.last_name}
          </AvatarFallbackText>
        </Avatar>

        <View className="flex-1 ml-3">
          <View className="flex-row items-center">
            <Text className="text-base">{fullName(user)}</Text>
          </View>
        </View>
        <AnimatedPressable
          onPress={handlePress}
          className={`px-5 py-1.5 rounded-md  bg-primary`}
        >
          <Text className={`font-semibold text-xs`}>Unblock</Text>
        </AnimatedPressable>
      </TouchableOpacity>
    </>
  );
}
