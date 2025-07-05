import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
  Icon,
  Text,
  View,
} from "@/components/ui";
import SwipeableWrapper from "@/components/shared/SwipeableWrapper";
import { Pressable } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { getImageUrl } from "@/lib/api";
import { fullName } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "@/actions/user";

type Props = {
  user: Me;
  onPress: (user: Props["user"]) => void;
};

export default function UserListItem({ user, onPress }: Props) {
  const query = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      query.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
  return (
    <>
      <SwipeableWrapper
        leftAction={async () =>
          await mutateAsync({
            user_id: user?.id,
          })
        }
        rightAction={() => {}}
      >
        <Pressable
          onPress={() => onPress(user)}
          className={
            "flex-row items-center px-4 py-3 bg-background-muted rounded-xl"
          }
        >
          <Avatar className=" w-12 h-12">
            <AvatarFallbackText>{fullName(user)}</AvatarFallbackText>
            <AvatarBadge size="md" />
            <AvatarImage source={getImageUrl(user?.profile_image)} />
          </Avatar>
          <View className="flex-1 pl-3">
            <Text className="text-base font-medium capitalize">
              {fullName(user)}
            </Text>
            <Text className="text-sm text-typography/80">{user?.email}</Text>
          </View>
          <Icon as={ChevronRight} className="text-primary" />
        </Pressable>
      </SwipeableWrapper>
    </>
  );
}
