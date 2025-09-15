import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import { router } from "expo-router";
import { View } from "@/components/ui";
import { memo } from "react";
import { useHomeFeed } from "@/hooks/useHomeFeed";
import { ScrollView } from "react-native";
import PropertyListItem from "@/components/property/PropertyListItem";

const TopProperties = () => {
  const { trending } = useHomeFeed();

  return (
    <SectionHeaderWithRef
      title="Trending Properties"
      titleClassName="text-gray-400 text-base"
      subTitle="See More"
      onSeeAllPress={() => {
        router.push({
          pathname: "/search",
          params: {
            list: "true",
          },
        });
      }}
    >
      <View className="">
        <ScrollView
          horizontal
          contentContainerClassName="gap-x-4 px-4"
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={344}
          snapToAlignment="center"
          decelerationRate="fast"
        >
          {trending?.map((data) => (
            <PropertyListItem
              key={data.id}
              showLike
              listType="trending"
              onPress={(data) => {
                router.push({
                  pathname: `/property/[propertyId]`,
                  params: {
                    propertyId: data.id,
                  },
                });
              }}
              isHorizontal={true}
              data={data}
              rounded={true}
            />
          ))}
        </ScrollView>
      </View>
    </SectionHeaderWithRef>
  );
};

export default memo(TopProperties);
