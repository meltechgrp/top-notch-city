import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import { router } from "expo-router";
import { memo } from "react";

function ApartmentsProperties({ data = [] }: { data: PropertyListItem[] }) {
  return (
    <SectionHeaderWithRef
      title="Properties"
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
        isRefetching={false}
        listType={["latest"]}
      />
    </SectionHeaderWithRef>
  );
}

export default memo(ApartmentsProperties);
