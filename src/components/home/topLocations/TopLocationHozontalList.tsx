import { useEffect, useMemo } from "react";
import { ImageSourcePropType, ScrollView } from "react-native";
import { useRefresh } from "@react-native-community/hooks";
import eventBus from "@/lib/eventBus";
import TopLocation from "./TopLocation";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { fetchTopLocations } from "@/actions/property/locations";
import { useStore } from "@/store";

type Props = {
  category?: string;
  fullWidth?: boolean;
  emptyState?: React.ReactNode;
};

export type Property = {
  id: string;
  name: string;
  location: string;
  price: number;
  banner: ImageSourcePropType;
  images: string[];
};

export default function TopLocationsHorizontalList(props: Props) {
  const { topLocations: locations } = useStore();

  return (
    <ScrollView
      horizontal
      contentContainerClassName="gap-x-4 px-4 "
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      snapToInterval={240 + 4}
      snapToAlignment="center"
      decelerationRate="fast"
    >
      {locations?.map((location) => (
        <TopLocation key={location.state} location={location} />
      ))}
    </ScrollView>
  );
}
