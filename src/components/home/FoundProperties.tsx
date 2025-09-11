import { memo } from "react";
import { ScrollView } from "react-native";
import { View } from "@/components/ui";
import HorizontalListItem from "../property/HorizontalListItem";

type Props = {
  data?: Property[];
  refetch: () => Promise<any>;
};

const FoundHorizontalList = (props: Props) => {
  const { data, refetch } = props;

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
};

export default memo(FoundHorizontalList);
