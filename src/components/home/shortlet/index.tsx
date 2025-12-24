import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import { useHomeList } from "@/hooks/useHomeList";
import { router } from "expo-router";
import { memo } from "react";

function ShortletProperties() {
  const { shortlet, isLoading } = useHomeList();
  return (
    <SectionHeaderWithRef
      title="Shortlet/Hotels"
      titleClassName="text-gray-400 text-base"
      subTitle="See More"
      hasData={isLoading || shortlet?.length > 0}
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
        data={shortlet}
        isLoading={isLoading}
        listType={["shortlet"]}
        isRefetching={false}
      />
    </SectionHeaderWithRef>
  );
}

export default memo(ShortletProperties);
