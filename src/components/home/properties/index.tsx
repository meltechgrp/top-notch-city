import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import { router } from "expo-router";
import VerticalProperties from "@/components/property/VerticalProperties";
import { View } from "@/components/ui";
import { useStore } from "@/store";
import { memo } from "react";

const TopProperties = () => {
  const { topProperties: properties } = useStore();

  return (
    <SectionHeaderWithRef
      title="Top Properties"
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
      <View className="flex-1 px-4">
        <VerticalProperties
          data={properties || []}
          scrollEnabled={false}
          refetch={async () => {}}
          disableCount={true}
          isLoading={false}
        />
      </View>
    </SectionHeaderWithRef>
  );
};

export default memo(TopProperties);
