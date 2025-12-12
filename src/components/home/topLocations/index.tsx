import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import { router } from "expo-router";
import { memo } from "react";
import { useStore } from "@/store";
import HorizontalListItem from "@/components/property/HorizontalListItem";
import { ScrollView } from "react-native";

const TopLocations = () => {
  const { nearbyProperties: properties } = useStore();
  return (
    <SectionHeaderWithRef
      title="Properties around you"
      titleClassName="text-gray-400 text-base"
      subTitle="Explore"
      className=""
      hasData={properties && properties?.length > 1}
      onSeeAllPress={() => {
        router.push({
          pathname: "/explore",
          params: {
            locate: "true",
          },
        });
      }}
    >
      <ScrollView
        horizontal
        contentContainerClassName="gap-x-4 pl-4"
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={180}
        snapToAlignment="center"
        decelerationRate="fast"
      >
        {properties?.map((property) => {
          if (!property) return null;
          return <HorizontalListItem key={property.id} data={property} />;
        })}
      </ScrollView>
    </SectionHeaderWithRef>
  );
};

export default memo(TopLocations);
