import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import { router } from "expo-router";
import { memo } from "react";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import { useHomeList } from "@/hooks/useHomeList";
import { deduplicate } from "@/lib/utils";

const Lands = () => {
  const { lands } = useHomeList();
  return (
    <SectionHeaderWithRef
      title="Lands"
      titleClassName="text-gray-400 text-base"
      subTitle="See More"
      hasData={lands?.length > 0}
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
        data={deduplicate(lands, "id")}
        isLoading={false}
        listType={["trending-lands"]}
        isRefetching={false}
      />
    </SectionHeaderWithRef>
  );
};

export default memo(Lands);
