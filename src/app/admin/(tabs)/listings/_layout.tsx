import MainLayout from "@/components/admin/shared/MainLayout";
import CustomTopBar from "@/components/layouts/CustomTopBar";
import { MaterialTopTabs } from "@/components/layouts/MaterialTopTabs";
import NotificationBadge from "@/components/notifications/NotificationBadge";
import { useResolvedTheme } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import Layout from "@/constants/Layout";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import { useMemo } from "react";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function ListingLayoutsComponent() {
  const theme = useResolvedTheme();
  const { data: pending } = useInfinityQueries({ type: "pending" });
  const propertyData = useMemo(
    () => pending?.pages.flatMap((page) => page.results) || [],
    [pending]
  );
  return (
    <MainLayout>
      <MaterialTopTabs
        initialRouteName="index"
        tabBar={(props) => <CustomTopBar {...props} />}
        screenOptions={{
          swipeEnabled: false,
          lazy: true,
          tabBarStyle: {
            backgroundColor:
              theme == "dark"
                ? Colors.light.background
                : Colors.dark.background,
          },
          tabBarItemStyle: {
            flexDirection: "row",
            alignItems: "center",
            // Use the width of the screen divided by the number of tabs
            width: Layout.window.width / 3,
          },
        }}
      >
        <MaterialTopTabs.Screen
          name="index"
          options={{
            title: "Properties",
          }}
        />
        <MaterialTopTabs.Screen
          name="peding"
          options={{
            title: "Pending",
            tabBarBadge: () => (
              <NotificationBadge
                className="bg-background"
                textClassName="text-typography"
                count={propertyData.length}
              />
            ),
          }}
        />
        <MaterialTopTabs.Screen
          name="category"
          options={{
            title: "Category List",
          }}
        />
      </MaterialTopTabs>
    </MainLayout>
  );
}
