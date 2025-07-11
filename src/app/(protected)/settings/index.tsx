import * as React from "react";

import { View } from "react-native";
import { router } from "expo-router";
import SettingsItemList from "@/components/settings/SettingsItemList";
import { BodyScrollView } from "@/components/layouts/BodyScrollView";
import { useStore } from "@/store";

export default function SettingsScreen() {
  const hasAuth = useStore((s) => s.hasAuth);
  return (
    <>
      <BodyScrollView withBackground={true}>
        <View className="flex-1 gap-6 w-full py-8 p-4">
          <View className="bg-background-muted pl-4 rounded-xl">
            <SettingsItemList
              title="Notifcations"
              onPress={() => {
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
        </View>
      </BodyScrollView>
    </>
  );
}
