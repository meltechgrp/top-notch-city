import { BodyScrollView } from "@/components/layouts/BodyScrollView";
import { MenuListItem } from "@/components/menu/MenuListItem";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Heading,
  Text,
  useResolvedTheme,
  View,
} from "@/components/ui";
import { Divider } from "@/components/ui/divider";
import { getImageUrl } from "@/lib/api";
import { cn, fullName } from "@/lib/utils";
import { useStore } from "@/store";
import { ScrollText, Settings } from "lucide-react-native";

export default function AgentSettings() {
  const me = useStore((s) => s.me);
  const theme = useResolvedTheme();
  return (
    <BodyScrollView withBackground className="flex-1">
      <View
        className={cn(
          "px-4 py-4 flex-row gap-4 items-center border-b border-outline/70"
        )}
      >
        <Avatar className=" w-14 h-14">
          <AvatarFallbackText>Humphrey Joshua</AvatarFallbackText>
          <AvatarImage source={getImageUrl(me?.profile_image)} />
        </Avatar>
        <Heading size="xl" className="">
          {fullName(me)}
        </Heading>
      </View>

      <View className="pt-2 flex-1 px-4">
        <Divider className=" h-[0.3px] bg-background-info mb-4" />
        <MenuListItem
          title="Bookings"
          description="Change your theme and other settings"
          icon={ScrollText}
          iconColor="gray-500"
          className=" py-2 pb-3"
        />

        <Divider className=" h-[0.3px] bg-background-info mb-4" />
        <MenuListItem
          title="Settings"
          description="Change your theme and other settings"
          //   onPress={() => {
          //     router.push("/settings");
          //   }}
          icon={Settings}
          iconColor="gray-500"
          className=" py-2 pb-3"
        />
      </View>
    </BodyScrollView>
  );
}
