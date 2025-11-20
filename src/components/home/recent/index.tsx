import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import { useHomeFeed } from "@/hooks/useHomeFeed";
import { router } from "expo-router";
import { memo } from "react";

function ApartmentsProperties() {
  const { latest, refetchingLatest, loadingLatest } = useHomeFeed();
  return (
    <SectionHeaderWithRef
      title="Apartments"
      titleClassName="text-gray-400 text-base"
      subTitle="See More"
      hasData={latest?.length > 0 || refetchingLatest || loadingLatest}
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
        isLoading={loadingLatest}
        isRefetching={refetchingLatest}
        listType="latest"
      />
    </SectionHeaderWithRef>
  );
}

export default memo(ApartmentsProperties);
