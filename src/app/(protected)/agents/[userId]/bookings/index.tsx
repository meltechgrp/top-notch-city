import { Box } from "@/components/ui";
import React, { useCallback, useMemo, useState } from "react";
import { Dimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Colors } from "@/constants/Colors";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Bookings } from "@/actions/bookings";
import { format } from "date-fns";
import BookingList from "@/components/bookings/BookingList";
import VisitationList from "@/components/bookings/VisitationList";
import { useStore } from "@/store";
import { useShallow } from "zustand/react/shallow";

export default function BookingHistory() {
  const layout = Dimensions.get("window");
  const { isAgent } = useStore(useShallow((s) => s.getCurrentUser()));
  const { data, isLoading, refetch, isRefetching } = useInfiniteQuery({
    queryKey: ["bookings"],
    queryFn: ({}) => Bookings(isAgent),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage;
      return page < pages ? page + 1 : undefined;
    },
  });
  const bookings = useMemo(
    () => data?.pages.flatMap((page) => page.results) || [],
    [data]
  );
  const sections = useCallback(
    (key: string) => {
      if (!bookings.length) return [];

      const groups: { [date: string]: Booking[] } = {};
      bookings
        .filter((booking) => booking.booking_type == key)
        .forEach((item) => {
          const dateKey = format(new Date(item.created_at), "yyyy-MM-dd");
          if (!groups[dateKey]) groups[dateKey] = [];
          groups[dateKey].push(item);
        });

      return Object.entries(groups)
        .map(([dateKey, items]) => ({
          title: format(new Date(dateKey), "MMMM d, yyyy"),
          data: items,
        }))
        .sort(
          (a, b) => new Date(b.title).getTime() - new Date(a.title).getTime()
        );
    },
    [bookings]
  );
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "reservation", title: "Reservation" },
    { key: "inspection", title: "Inspection" },
  ]);
  const renderScene = SceneMap({
    reservation: () => (
      <BookingList
        bookings={sections("reservation")}
        isLoading={isLoading}
        isRefreshing={isRefetching}
        refetch={refetch}
      />
    ),
    inspection: () => (
      <VisitationList
        bookings={sections("inspection")}
        isLoading={isLoading}
        isRefreshing={isRefetching}
        refetch={refetch}
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
