import { View } from "@/components/ui";
import Map from "../location/map";
import HomeNavigation from "./HomeNavigation";
import { router } from "expo-router";
import { toUiProperties } from "@/lib/propertyAdapter";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import { useMemo } from "react";

type Props = {
  className?: string;
  mapHeight: number;
  latitude?: number;
  longitude?: number;
};
const DiscoverProperties = (props: Props) => {
  const { className, mapHeight, latitude, longitude } = props;
  const filter = useMemo(
    () => ({
      latitude,
      longitude,
    }),
    [latitude, longitude],
  );
  const { data } = useInfinityQueries({
    type: "search",
    filter,
    perPage: 30,
  });
  const properties = useMemo(
    () =>
      toUiProperties(
        (data?.pages ?? []).flatMap((page) => page?.results ?? []),
      ),
    [data],
  );

  return (
    <View style={{ flex: 1, height: mapHeight }} className={className}>
      <View className="overflow-hidden relative flex-1">
        <View className="absolute top-16 w-full z-10">
          <HomeNavigation />
        </View>
        <Map
          markers={properties || []}
          onDoublePress={() =>
            router.push({
              pathname: "/explore",
            })
          }
          height={mapHeight}
        />
      </View>
    </View>
  );
};

export default DiscoverProperties;
