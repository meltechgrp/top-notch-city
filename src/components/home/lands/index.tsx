import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import { router } from "expo-router";
import { memo } from "react";
import HorizontalProperties from "@/components/property/HorizontalProperties";

const Lands = ({ data = [] }: { data: PropertyListItem[] }) => {
  return (
    <SectionHeaderWithRef
      title="Lands"
      titleClassName="text-gray-400 text-base"
      subTitle="See More"
      hasData={data?.length > 0}
      onSeeAllPress={() => {
        router.push({
          pathname: "/explore",
          params: {
            list: "true",
          },
        });
      }}
    >
      <HorizontalProperties
        data={data}
        isLoading={false}
        listType={["trending-lands"]}
        isRefetching={false}
      />
    </SectionHeaderWithRef>
  );
};

export default memo(Lands);
