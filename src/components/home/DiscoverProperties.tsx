import { View } from "@/components/ui";
import Map from "../location/map";
import FoundHorizontalList from "./FoundProperties";
import HomeNavigation from "./HomeNavigation";
import { useRouter } from "expo-router";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import { memo, useMemo } from "react";

type Props = {
  className?: string;
  mapHeight?: number;
};
const DiscoverProperties = (props: Props) => {
  const { className, mapHeight } = props;
  const router = useRouter();
  const { data, refetch } = useInfinityQueries({
    type: "search",
    filter: { use_geo_location: "true" },
    key: "nearby",
    enabled: false,
  });

  const properties = useMemo(
    () => data?.pages.flatMap((page) => page.results) || [],
    [data]
  );
  return (
    <View style={{ flex: 1 }} className={className}>
      <View className="overflow-hidden relative flex-1">
        <View className="  absolute top-16 w-full z-10">
          <HomeNavigation />
        </View>
        <View className="absolute bottom-8 z-10">
          <FoundHorizontalList data={properties} refetch={refetch} />
        </View>
        <Map
          markers={properties || []}
          scrollEnabled={false}
          onDoublePress={() =>
            router.push({
              pathname: "/search",
            })
          }
          height={mapHeight}
          onMarkerPress={(data) =>
            router.push({
              pathname: "/search",
              params: {
                propertyId: data.id,
              },
            })
          }
        />
      </View>
    </View>
  );
};

export default memo(DiscoverProperties);
