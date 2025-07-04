import { Search } from "lucide-react-native";
import { Icon, Pressable, Text, View } from "../ui";
import { useRouter } from "expo-router";
import NotificationBarButton from "../notifications/NotificationBarButton";

export default function HomeNavigation() {
  const router = useRouter();
  return (
    <View className="flex-row justify-end items-center px-4 gap-4">
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/search",
          })
        }
        className="flex-1 h-14 p-2 pl-4 flex-row bg-background-muted rounded-full items-center gap-1"
      >
        <Text size="md" numberOfLines={1} className="flex-1 text-typography/70">
          Search property, city or everything...
        </Text>

        <View className=" p-2 bg-primary rounded-full">
          <Icon as={Search} color="white" />
        </View>
      </Pressable>
      {/* <NotificationBarButton /> */}
    </View>
  );
}
