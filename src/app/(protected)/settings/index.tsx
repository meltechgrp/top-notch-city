import * as React from "react";

import { Pressable, View } from "react-native";
import { router, useNavigation } from "expo-router";
import SettingsItemList from "@/components/settings/SettingsItemList";
import { useStore } from "@/store";
import { Box } from "@/components/ui";
import { storage } from "@/lib/asyncStorage";

export default function SettingsScreen() {
  const { hasAuth } = useStore();
  const [tapCount, setTapCount] = React.useState(0);
  const navigation = useNavigation();
  React.useEffect(() => {
    const handleBlur = (e: any) => {
      setTapCount(0);
    };

    navigation.addListener("blur", handleBlur);

    return () => {
      navigation.removeListener("blur", handleBlur);
    };
  }, [navigation]);
  const handleClick = (e: any) => {
    if (tapCount < 4) {
      setTapCount((prev) => prev + 1);
    }
  };
  return (
    <>
      <Box className=" flex-1">
        <Pressable
          onPress={handleClick}
          className="flex-1 gap-6 w-full py-8 p-4"
        >
          <View className="bg-background-muted pl-4 rounded-xl">
            <SettingsItemList
              title="Notifcations"
              onPress={async () => {
                // showBounceNotification({
                //   title: "Hello",
                //   description: "i am here",
                //   theme,
                // });
                // showErrorAlert({
                //   title: "Hello",
                //   description: "i am here",
                //   alertType: "success",
                // });
                // router.push('/settings/email-address');
              }}
            />
            <SettingsItemList
              title="Chats"
              onPress={() => {
                // router.push('/settings/change-phone-number');
              }}
            />
            <SettingsItemList
              title="Theme"
              withBorder={false}
              onPress={() => {
                router.push("/settings/theme");
              }}
            />
          </View>
          {tapCount > 3 && (
            <View className="bg-background-muted pl-4 rounded-xl">
              <SettingsItemList onPress={() => {}} title="Clear Basic Cache" />
              <SettingsItemList
                onPress={() => {
                  useStore.getState().resetStore();
                  storage.clearAll();
                }}
                title="Clear All Cache"
                withBorder={false}
              />
            </View>
          )}
          <View className="bg-background-muted pl-4 rounded-xl">
            {hasAuth && (
              <SettingsItemList
                onPress={() =>
                  router.push("/(protected)/settings/change-password")
                }
                title="Change Password"
              />
            )}
            {hasAuth && (
              <SettingsItemList
                title="Delete My Account"
                withBorder={false}
                onPress={() =>
                  router.push("/(protected)/settings/delete-account")
                }
                textColor="text-primary"
              />
            )}
          </View>
        </Pressable>
      </Box>
    </>
  );
}
