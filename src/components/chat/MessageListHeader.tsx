import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Heading,
  Icon,
  Image,
  Text,
  View,
} from "@/components/ui";
import { User } from "@/db/models/users";
import { generateMediaUrlSingle } from "@/lib/api";
import { cn, fullName } from "@/lib/utils";
import { Dot } from "lucide-react-native";
import { memo } from "react";

function MessageListHeader({ receiver }: { receiver: User }) {
  return (
    <View
      className={cn(
        "hidden justify-center items-center my-16 opacity-50 gap-4",
        (receiver.role == "agent" || receiver.role == "staff-agent") && "flex"
      )}
    >
      {receiver?.profile_image ? (
        <View className="w-32 h-32 rounded-full overflow-hidden">
          <Image
            source={{
              uri: generateMediaUrlSingle(receiver?.profile_image),
              cacheKey: receiver?.profile_image,
            }}
            rounded
          />
        </View>
      ) : (
        <Avatar className="bg-gray-500 w-32 h-32">
          <AvatarFallbackText className="text-typography text-xl">
            {fullName(receiver)}
          </AvatarFallbackText>
          {receiver?.profile_image && (
            <AvatarImage
              source={{
                uri: generateMediaUrlSingle(receiver?.profile_image),
                cache: "force-cache",
              }}
            />
          )}
        </Avatar>
      )}
      <View className="items-center">
        <Heading size="lg" numberOfLines={1} className="">
          {fullName(receiver)}
        </Heading>
        <View className="flex-row gap-2 items-center">
          <Text>{receiver.followers_count} followers</Text>
          <Icon as={Dot} />
          <Text>{receiver.total_properties} properties</Text>
        </View>
      </View>
    </View>
  );
}

export default memo(MessageListHeader);
