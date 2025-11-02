import { memo, useMemo, useState } from "react";
import { Heading, Icon, Text, useResolvedTheme, View } from "../ui";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Colors } from "@/constants/Colors";
import Layout from "@/constants/Layout";
import { ActivityIndicator, ScrollView } from "react-native";
import { usePropertyStore } from "@/store/propertyStore";
import {
  Church,
  Fuel,
  Hospital,
  MapPin,
  School,
  Utensils,
} from "lucide-react-native";
import { getNearbyPlaces } from "@/actions/property";
import { useQuery } from "@tanstack/react-query";

const categories = {
  Restaurants: "catering",
  Schools: "education",
  Hospitals: "healthcare",
  Churches: "religion",
};

const NearbyCategory = ({
  type,
  latitude,
  longitude,
}: {
  type: string;
  latitude: number;
  longitude: number;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: [type, latitude, latitude],
    queryFn: () =>
      getNearbyPlaces({ latitude, longitude, radiusMeters: 5000, limit: 5 }),
  });
  const nearby = useMemo(() => data?.slice() || [], [data]);

  if (isLoading) {
    return (
      <View className="items-center justify-center mt-6">
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (!nearby.length) {
    return (
      <View className="items-center justify-center mt-6">
        <Text className=" text-md">No places found in this category</Text>
      </View>
    );
  }
  const categoryIcons = {
    catering: Utensils,
    education: School,
    healthcare: Hospital,
    religion: Church,
  };
  return (
    <View className="flex-1 py-2">
      <ScrollView className="flex-1 pb-12">
        <View className="flex-1 gap-2">
          {nearby
            .filter((n) => n.category == type)
            .map((item, i) => (
              <View
                key={i}
                className="p-4 py-2 bg-background-muted min-h-16 gap-1 rounded-xl"
              >
                <View className="flex-row gap-2 items-center">
                  <Icon
                    as={categoryIcons[type as keyof typeof categoryIcons]}
                    className="text-primary w-4 h-4"
                  />
                  <Text className="font-medium">{item.name}</Text>
                </View>
                <View className="flex-row gap-2 items-center">
                  <Icon as={MapPin} className="w-4 h-4" />
                  <Text className="text-xs flex-1" numberOfLines={2}>
                    {item.address}
                  </Text>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>
    </View>
  );
};

const PropertyNearbySection = () => {
  const { details } = usePropertyStore();
  const [index, setIndex] = useState(0);
  const theme = useResolvedTheme();
  const routes = Object.keys(categories).map((key) => ({
    key,
    title: key,
  }));
  const renderScene = SceneMap(
    Object.fromEntries(
      routes.map(({ key }) => [
        key,
        () => (
          <NearbyCategory
            type={categories[key as keyof typeof categories]}
            latitude={details?.address.latitude!}
            longitude={details?.address.longitude!}
          />
        ),
      ])
    )
  );
  return (
    <View className=" gap-4">
      <Heading size="lg">Nearby Places</Heading>
      <View>
        <TabView
          style={{ height: 434 }}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: Layout.window.width }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              scrollEnabled
              inactiveColor={Colors[theme].text}
              indicatorStyle={{ backgroundColor: Colors.primary }}
              style={{ backgroundColor: "transparent" }}
              activeColor={Colors.primary}
            />
          )}
        />
      </View>
    </View>
  );
};

export default memo(PropertyNearbySection);
