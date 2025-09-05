import { ScrollView } from "react-native";
import TopLocation from "./TopLocation";
import { useHomeFeed } from "@/hooks/useHomeFeed";

type Props = {
  category?: string;
  fullWidth?: boolean;
  emptyState?: React.ReactNode;
};

export default function TopLocationsHorizontalList(props: Props) {
  const { locations } = useHomeFeed();

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
