import { ScrollView } from "react-native";
import TopLocation from "./TopLocation";
import { useHomeFeed } from "@/hooks/useHomeFeed";
import { memo, useMemo } from "react";
import { TopLocationSkeleton } from "@/components/home/topLocations/TopLocationSkeleton";

type Props = {
  category?: string;
  fullWidth?: boolean;
  emptyState?: React.ReactNode;
};

function TopLocationsHorizontalList(props: Props) {
  const { locations, loadingLocations, refetchingLocations } = useHomeFeed();

  const skeletonItems = useMemo(() => Array.from({ length: 5 }), []);
  const isBusy = loadingLocations || refetchingLocations;
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
      {isBusy
        ? skeletonItems.map((_, i) => <TopLocationSkeleton key={i} />)
        : locations.map((location) => (
            <TopLocation key={location.state} location={location} />
          ))}
    </ScrollView>
  );
}

export default memo(TopLocationsHorizontalList);
