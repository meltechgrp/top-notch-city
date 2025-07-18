import { useEffect } from "react";
import { ScrollView } from "react-native";
import { View } from "@/components/ui";
import { useRefresh } from "@react-native-community/hooks";
import eventBus from "@/lib/eventBus";
import HorizontalListItem from "../property/HorizontalListItem";

type Props = {
  data?: Property[];
  refetch: () => Promise<any>;
};

export default function FoundHorizontalList(props: Props) {
  const { data, refetch } = props;

  const { onRefresh } = useRefresh(refetch);

  useEffect(() => {
    onRefresh();
    eventBus.addEventListener("PROPERTY_HORIZONTAL_LIST_REFRESH", onRefresh);

    return () => {
      eventBus.removeEventListener(
        "PROPERTY_HORIZONTAL_LIST_REFRESH",
        onRefresh
      );
    };
  }, []);

  return (
    <View>
      <ScrollView
        horizontal
        contentContainerClassName="gap-x-4 pl-4"
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={238 + 4}
        snapToAlignment="center"
        decelerationRate="fast"
      >
        {data?.map((property) => (
          <HorizontalListItem key={property.id} data={property} />
        ))}
      </ScrollView>
    </View>
  );
}
