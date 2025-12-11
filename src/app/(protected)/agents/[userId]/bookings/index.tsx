import { Box } from "@/components/ui";
import React, { useState } from "react";
import { Dimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Upcoming from "@/components/bookings/Upcoming";
import Completed from "@/components/bookings/Completed";
import Cancelled from "@/components/bookings/Cancelled";
import { Colors } from "@/constants/Colors";

export default function BookingHistory() {
  const layout = Dimensions.get("window");
  // const { data, isLoading, refetch } = useQuery({
  //   queryKey: ["agent-applications"],
  //   queryFn: ({})=> getAgentBoookings({pageParam}),
  // });
  // const router = useRouter();
  // const { onRefresh, isRefreshing } = useRefresh(refetch);
  // const applications = useMemo(() => data || [], [data]);
  // const sections = useMemo(() => {
  //   if (!applications.length) return [];

  // applications.forEach((item) => {
  //   const dateKey = format(new Date(item.created_at), "yyyy-MM-dd");
  //   if (!groups[dateKey]) groups[dateKey] = [];
  //   groups[dateKey].push(item);
  // });

  // Convert to array of { title, data }
  //   return Object.entries(groups)
  //     .map(([dateKey, items]) => ({
  //       title: format(new Date(dateKey), "MMMM d, yyyy"),
  //       data: items,
  //     }))
  //     .sort(
  //       (a, b) => new Date(b.title).getTime() - new Date(a.title).getTime()
  //     );
  // }, [applications]);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "upcoming", title: "Upcoming" },
    { key: "completed", title: "Completed" },
    { key: "cancelled", title: "Canceled" },
  ]);
  const renderScene = SceneMap({
    upcoming: () => (
      <Upcoming
        bookings={[]}
        isLoading
        isRefreshing={false}
        refetch={async () => {}}
      />
    ),
    completed: () => (
      <Completed
        bookings={[]}
        isLoading
        isRefreshing={false}
        refetch={async () => {}}
      />
    ),
    cancelled: () => (
      <Cancelled
        bookings={[]}
        isLoading
        isRefreshing={false}
        refetch={async () => {}}
      />
    ),
  });
  return (
    <Box className="flex-1">
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{
              backgroundColor: Colors.light.background,
              height: 3,
              marginBottom: 4,
            }}
            style={{ backgroundColor: Colors.light.background }}
            activeColor={Colors.primary}
            inactiveColor="#fff"
          />
        )}
      />
    </Box>
  );
}
