import { fullName } from "@/lib/utils";
import { Avatar, AvatarFallbackText, AvatarImage, Text, View } from "../ui";
import AgentRating from "@/components/agent/Rating";
import { getImageUrl } from "@/lib/api";
import { Eye, Heart, House } from "lucide-react-native";

export function ProfileTopSection({ userData: me }: { userData: Me }) {
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
        <View className="flex-1 bg-background-muted gap-2 rounded-xl p-4">
          <Text size="lg" className="text-gray-400">
            Listings
          </Text>
          <View className="flex-row justify-between items-center">
            <Text size="2xl">{me?.total_properties}</Text>
            {/* <House color={"#F16000F0"} size={24} /> */}
          </View>
        </View>
        <View className="flex-1 bg-background-muted gap-2 rounded-xl p-4">
          <Text size="lg" className="text-gray-400">
            Views
          </Text>
          <View className="flex-row justify-between items-center">
            <Text size="2xl">{me?.views_count}</Text>
            {/* <Eye color={"#F16000F0"} size={24} /> */}
          </View>
        </View>
        <View className="flex-1 bg-background-muted gap-2 rounded-xl p-4">
          <Text size="lg" className="text-gray-400">
            Likes
          </Text>
          <View className="flex-row justify-between items-center">
            <Text size="2xl">{me?.likes_count}</Text>
            {/* <Heart color={"#F16000F0"} fill={"#F16000F0"} size={24} /> */}
          </View>
        </View>
      </View>
    </View>
  );
}
