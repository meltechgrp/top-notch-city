import DiscoverProperties from "@/components/home/DiscoverProperties";
import TopProperties from "@/components/home/properties";
import TopLocations from "@/components/home/topLocations";
import { Box, View } from "@/components/ui";
import eventBus from "@/lib/eventBus";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import React, { useMemo, useState } from "react";
import { Dimensions, Platform, RefreshControl } from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const MAP_HEIGHT = height / 1.8;

export default function HomeScreen() {
  const { data, refetch } = useInfinityQueries({ type: "all" });
  const scrollY = useSharedValue(0);
  const [refreshing, setRefreshing] = useState(false);

  const feedList = useMemo(() => {
    return [
      { id: "locations", _typename: "Locations" },
      { id: "properties", _typename: "Properties" },
      { id: "bottomPlaceHolder", __typename: "bottomPlaceHolder" },
    ];
  }, []);

  const properties = useMemo(
    () => data?.pages.flatMap((page) => page.results) || [],
    [data]
  );

  async function onRefresh() {
    try {
      setRefreshing(true);
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  const mapAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [-MAP_HEIGHT, 0, MAP_HEIGHT],
            [-MAP_HEIGHT / 2, 0, MAP_HEIGHT * 0.4]
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [-MAP_HEIGHT, 0, MAP_HEIGHT],
            [1.1, 1, 1]
          ),
        },
      ],
    };
  });

  return (
    <Box className="flex-1 overflow-visible">
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              onRefresh();
              eventBus.dispatchEvent("PROPERTY_HORIZONTAL_LIST_REFRESH", null);
            }}
          />
        }
      >
        {/* Parallax header */}
        {Platform.OS === "android" ? (
          <View style={{ width, height: MAP_HEIGHT }}>
            <DiscoverProperties mapHeight={MAP_HEIGHT} />
          </View>
        ) : (
          <Animated.View
            style={[{ width, height: MAP_HEIGHT }, mapAnimatedStyle]}
          >
            <DiscoverProperties mapHeight={MAP_HEIGHT} />
          </Animated.View>
        )}

        {/* Feed items */}
        <View className=" flex-1 bg-background">
          {feedList.map((item) => {
            if (item.id === "locations") {
              return <TopLocations key={item.id} />;
            }
            if (item.id === "properties") {
              return (
                <TopProperties
                  key={item.id}
                  data={properties}
                  refetch={refetch}
                />
              );
            }
            if (item.id === "bottomPlaceHolder") {
              return <View key={item.id} className="h-24" />;
            }
            return null;
          })}
        </View>
      </Animated.ScrollView>
    </Box>
  );
}
