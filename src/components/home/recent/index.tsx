import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import { useHomeList } from "@/hooks/useHomeList";
import { router } from "expo-router";
import { memo } from "react";

function ApartmentsProperties() {
  const { latest, isLoading } = useHomeList();
  return (
    <SectionHeaderWithRef
      title="Properties"
      titleClassName="text-gray-400 text-base"
      subTitle="See More"
      hasData={isLoading || latest?.length > 0}
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
        data={latest}
        isLoading={isLoading}
        isRefetching={false}
        listType={["latest"]}
      />
    </SectionHeaderWithRef>
  );
}

export default memo(ApartmentsProperties);
