import * as React from "react";

import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cn } from "@/lib/utils";
import MainLogo from "@/assets/images/notification.png";
import NotificationBarButton from "@/components/notifications/NotificationBarButton";
import { Avatar, AvatarImage, Icon, Pressable, Text } from "@/components/ui";
import { Home } from "lucide-react-native";
import { useRouter } from "expo-router";

type Props = View["props"] & {
  topbarClassName?: string;
  isAgent?: boolean;
  showNotification?: boolean;
  rightHeaderComponent?: React.ReactNode;
  leftHeaderComponent?: React.ReactNode;
};
export default function MainLayout(props: Props) {
  const {
    children,
    style,
    topbarClassName,
    isAgent = false,
    rightHeaderComponent,
    showNotification = true,
    leftHeaderComponent,
  } = props;
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView
        edges={["top"]}
        style={{ flex: 1 }}
        className=" bg-transparent"
      >
        <View style={style} className="flex-1">
          <View
            className={cn(
              "w-full bg-background border-b border-outline h-[64px]",
              topbarClassName
            )}
          >
            <View className="flex-row h-14 pt-3 pl-4 gap-2 items-center">
              {leftHeaderComponent ? (
                leftHeaderComponent
              ) : (
                <View className="flex-row gap-2 flex-1 items-center">
                  <Avatar size="sm">
                    <AvatarImage source={MainLogo} />
                  </Avatar>
                  <View className="flex-1">
                    <Text size="xl">Top-Notch {isAgent ? "" : "Admin"}</Text>
                  </View>
                </View>
              )}
              <View className=" px-4 flex-row items-center">
                {rightHeaderComponent ? (
                  rightHeaderComponent
                ) : (
                  <Pressable onPress={() => router.dismissTo("/home")}>
                    <Icon size="xl" as={Home} />
                  </Pressable>
                )}
                {showNotification && (
                  <NotificationBarButton
                    isAdmin
                    className=" bg-transparent rounded-none"
                  />
                )}
              </View>
            </View>
          </View>
          <View className={cn("flex-1 relative", props.className)}>
            {children}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
