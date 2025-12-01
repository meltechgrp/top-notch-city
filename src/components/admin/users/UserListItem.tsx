import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
  Icon,
  Pressable,
  Text,
  View,
} from "@/components/ui";
import { ChevronRight } from "lucide-react-native";
import { getImageUrl } from "@/lib/api";
import { fullName } from "@/lib/utils";

type Props = {
  user: Me;
  onPress: (user: Props["user"]) => void;
};

export default function UserListItem({ user, onPress }: Props) {
  return (
    <>
      <Pressable
        both
        onPress={() => onPress(user)}
        className={
          "flex-row items-center px-4 py-3 bg-background-muted rounded-xl"
        }
      >
        <Avatar className=" w-12 h-12">
          <AvatarFallbackText>{fullName(user)}</AvatarFallbackText>
          {user.status == "online" && <AvatarBadge size="md" />}
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
    </>
  );
}
