import { Camera, Search } from "lucide-react-native";
import { Icon, Pressable, Text, View } from "../ui";
import { useRouter } from "expo-router";
import NotificationBarButton from "../notifications/NotificationBarButton";
import React, { memo } from "react";
import MediaPicker, { MediaPickerRef } from "@/components/media/MediaPicker";

function HomeNavigation() {
  const router = useRouter();
  const mediaPickerRef = React.useRef<MediaPickerRef>(null);
  return (
    <>
      <View className="flex-row justify-end items-center px-4 gap-4">
        <View className="flex-1 h-14 p-2 pl-2 flex-row bg-background-muted rounded-full items-center gap-2">
          <Pressable
            onPress={() => mediaPickerRef.current?.open?.()}
            className=" p-2 bg-background rounded-full border border-outline-100"
          >
            <Icon as={Camera} color="white" />
          </Pressable>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/explore",
                params: {
                  locate: "true",
                },
              })
            }
            className="flex-1 flex-row rounded-full items-center gap-1"
          >
            <Text
              size="md"
              numberOfLines={1}
              className="flex-1 text-typography/70"
            >
              Search state, city or location...
            </Text>

            <View className=" p-2 bg-primary rounded-full">
              <Icon as={Search} color="white" />
            </View>
          </Pressable>
        </View>
        <NotificationBarButton />
      </View>
      <MediaPicker ref={mediaPickerRef as any} onSend={()=> {}} />
    </>
  );
}

export default memo(HomeNavigation);
