import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import { useHomeFeed } from "@/hooks/useHomeFeed";
import { router } from "expo-router";
import { memo } from "react";

function ApartmentsProperties() {
  const { latest, loadingLatest, refetchingLatest } = useHomeFeed();
  return (
    <SectionHeaderWithRef
      title="Properties"
      titleClassName="text-gray-400 text-base"
      subTitle="See More"
      hasData={loadingLatest || refetchingLatest || latest?.length > 0}
      onSeeAllPress={() => {
        router.push({
          pathname: "/explore",
          params: {
            category: "Residential",
          },
        });
      }}
    >
      <HorizontalProperties
        data={latest}
        isLoading={loadingLatest}
        isRefetching={refetchingLatest}
        listType={["latest"]}
      />
    </SectionHeaderWithRef>
  );
}

export default memo(ApartmentsProperties);
