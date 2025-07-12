import { Pressable } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { useStore } from "@/store";
import { Box, Text, Icon, View } from "@/components/ui";
import { Repeat } from "lucide-react-native";
import { useMemo } from "react";
import Platforms from "@/constants/Plaforms";

export function RoleSwitchPill() {
  const pathname = usePathname();
  const router = useRouter();
  const { me, setSavedPath } = useStore();

  const role = useMemo(() => me?.role, [me]);

  // Show only if agent or admin is logged in
  if (role !== "admin") return null;

  // ✅ Allowed main tabs
  const MAIN_TABS = ["/home", "/message", "/sell"];

  const isMainTab = MAIN_TABS.includes(pathname);

  // ✅ Allowed agent/admin tab root screens only
  const segments = pathname.split("/").filter(Boolean);
  const isAdminTabsRoot =
    pathname.startsWith("/admin/") &&
    segments.length === 2 &&
    !pathname.startsWith("/admin/notification");
  const isAgentTabsRoot =
    pathname.startsWith("/agent/") && segments.length === 2;

  // ✅ Show pill only if matches the criteria
  const shouldShow =
    (isMainTab && role === "admin") || (isAdminTabsRoot && role === "admin");
  if (!shouldShow) return null;

  // Determine target route and label
  let targetPath = "/";
  let label = "";
  if (pathname.startsWith("/admin")) {
    targetPath = "/home";
    label = "Switch to Main";
  } else if (role === "admin") {
    targetPath = "/admin"; // or wherever your admin landing page is
    label = "Switch to Admin";
  }

  function handleSwitch() {
    setSavedPath(targetPath);
    router.dismissTo(targetPath as any);
  }

  return (
    <Pressable
      onPress={handleSwitch}
      style={{
        position: "absolute",
        bottom: Platforms.isIOS() ? 120 : 100, // adjust to be above your bottom tabs
        alignSelf: "center",
        zIndex: 1000,
      }}
    >
      <View className="flex-row items-center px-4 py-2 bg-primary rounded-full shadow-md">
        <Icon as={Repeat} size="sm" className="text-white mr-2" />
        <Text className="text-white font-medium">{label}</Text>
      </View>
    </Pressable>
  );
}
