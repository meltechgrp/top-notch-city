import { fullName } from "@/lib/utils";
import { Avatar, AvatarFallbackText, AvatarImage, Text, View } from "../ui";
import AgentRating from "@/components/agent/Rating";
import { getImageUrl } from "@/lib/api";
import { useStore } from "@/store";
import { Eye, Heart, House } from "lucide-react-native";

export function ProfileTopSection() {
  const { me } = useStore();
  return (
    <View className={"px-4 py-2 mt-2 bg-background"}>
      <View className={"flex-row items-center"}>
        <Avatar className=" w-24 h-24 rounded-xl">
          <AvatarFallbackText>{fullName(me)}</AvatarFallbackText>
          <AvatarImage
            className="rounded-xl"
            source={getImageUrl(me?.profile_image)}
          />
        </Avatar>
        <View className="flex-1 pl-3">
          <Text className="text-xl font-medium">{fullName(me)}</Text>
          <Text className="text-sm text-typography/80">{me?.email}</Text>
          <AgentRating average={0} total={0} />
        </View>
      </View>
      <View className="flex-row gap-4 mt-4">
        <View className="flex-1 bg-background-muted gap-3 rounded-xl p-4">
          <View className="flex-row items-center gap-1">
            <House color={"#F16000F0"} size={18} />
            <Text size="xs">Properties</Text>
          </View>
          <Text size="2xl">0</Text>
        </View>
        <View className="flex-1 bg-background-muted gap-3 rounded-xl p-4">
          <View className="flex-row items-center gap-1">
            <Eye color={"#F16000F0"} size={18} />
            <Text size="xs">Views</Text>
          </View>
          <Text size="2xl">0</Text>
        </View>
        <View className="flex-1 bg-background-muted gap-3 rounded-xl p-4">
          <View className="flex-row items-center gap-1">
            <Heart color={"#F16000F0"} size={18} />
            <Text size="xs">Likes</Text>
          </View>
          <Text size="2xl">0</Text>
        </View>
      </View>
    </View>
  );
}
