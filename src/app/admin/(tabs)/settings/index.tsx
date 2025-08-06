import { BodyScrollView } from "@/components/layouts/BodyScrollView";
import { MenuListItem } from "@/components/menu/MenuListItem";
import SettingsItemList from "@/components/settings/SettingsItemList";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Heading,
  Text,
  View,
} from "@/components/ui";
import { Divider } from "@/components/ui/divider";
import { getImageUrl } from "@/lib/api";
import { fullName } from "@/lib/utils";
import { useStore } from "@/store";
import { router } from "expo-router";
import { List } from "lucide-react-native";

export default function AdminSettings() {
  const me = useStore((s) => s.me);
  return (
    <BodyScrollView>
      <Box className="flex-1 gap-6 w-full pb-8">
        <View className="px-4 py-4 flex-row gap-4 items-center border-b border-outline/70">
          <Avatar className=" w-14 h-14">
            <AvatarFallbackText>Humphrey Joshua</AvatarFallbackText>
            <AvatarImage source={getImageUrl(me?.profile_image)} />
          </Avatar>
          <View className="flex-1">
            <Heading size="xl" className="">
              Hello 👋,
            </Heading>
            <Text className="text-lg text-typography/80">{fullName(me)}</Text>
          </View>
        </View>
        <View className="px-4">
          <MenuListItem
            title="Categories"
            description="Change your theme and other settings"
            onPress={() => {
              router.push("/admin/(tabs)/settings/categories");
            }}
            icon={List}
            iconColor="gray-500"
            className=" py-2 pb-3"
          />
          <Divider className=" h-[0.3px] bg-background-info mb-4" />
          <MenuListItem
            title="Amenities"
            description="Change your theme and other settings"
            onPress={() => {
              router.push("/admin/(tabs)/settings/amenities");
            }}
            icon={List}
            iconColor="gray-500"
            className=" py-2 pb-3"
          />
        </View>
      </Box>
    </BodyScrollView>
  );
}
