import { Box } from "@/components/ui";
import React, { useState } from "react";
import { Dimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Colors } from "@/constants/Colors";
import BookingList from "@/components/bookings/BookingList";
import VisitationList from "@/components/bookings/VisitationList";

export default function BookingHistory() {
  const layout = Dimensions.get("window");
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "reservation", title: "Reservation" },
    { key: "inspection", title: "Inspection" },
  ]);
  const renderScene = SceneMap({
    reservation: () => <BookingList />,
    inspection: () => <VisitationList />,
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
              backgroundColor: Colors.primary,
              height: "88%",
              margin: 3,
              borderRadius: 12,
            }}
            style={{
              backgroundColor: "#333333",
              marginHorizontal: 12,
              borderRadius: 12,
              marginBottom: 8,
              marginTop: 3,
            }}
            activeColor={"#fff"}
            inactiveColor="#ccc"
          />
        )}
      />
    </Box>
  );
}
