import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import PropertyListItem from "@/components/property/PropertyListItem";
import { View } from "@/components/ui";
import { useHomeFeed } from "@/hooks/useHomeFeed";
import { router } from "expo-router";
import { memo } from "react";
import { ScrollView } from "react-native";

function RecentProperties() {
  const { latest } = useHomeFeed();
  return (
    <SectionHeaderWithRef
      title="Recently Added"
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
          contentContainerClassName="gap-x-4 pl-4"
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={238 + 4}
          snapToAlignment="center"
          decelerationRate="fast"
        >
          {latest.map((data) => (
            <PropertyListItem
              key={data.id}
              showLike
              listType="latest"
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
}

export default memo(RecentProperties);
