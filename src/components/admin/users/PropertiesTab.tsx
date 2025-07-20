import React, { useMemo, useState } from "react";
import { NativeScrollEvent, View } from "react-native";
import VerticalProperties from "@/components/property/VerticalProperties";
import { SharedValue } from "react-native-reanimated";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import PropertyDetailsBottomSheet from "@/components/admin/properties/PropertyDetailsBottomSheet";
import { useStore } from "@/store";

type IProps = {
  profileId: string;
  onScroll?: (e: NativeScrollEvent) => any;
  headerHeight: number;
  scrollElRef: any;
  refetch: any;
  listRef: any;
  scrollY?: SharedValue<number>;
};
export default function PropertiesTabView(props: IProps) {
  const {
    profileId,
    onScroll,
    scrollY,
    headerHeight,
    refetch: reload,
    scrollElRef,
    listRef,
  } = props;
  const { me } = useStore();
  const [activeProperty, setActiveProperty] = useState<Property | null>(null);
  const [propertyBottomSheet, setPropertyBottomSheet] = useState(false);
  const {
    data,
    refetch,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinityQueries({ type: "user", profileId });
  const list = useMemo(
    () => data?.pages.flatMap((page) => page.results) || [],
    [data]
  );

  useRefreshOnFocus(refetch);
  return (
    <>
      <View className="flex-1 p-4">
        <VerticalProperties
          isLoading={isLoading}
          data={list}
          onScroll={onScroll}
          scrollElRef={scrollElRef}
          headerHeight={headerHeight}
          listRef={listRef}
          showStatus
          refetch={async () => {
            await refetch();
            await reload();
          }}
          onPress={(data) => {
            setActiveProperty(data);
            setPropertyBottomSheet(true);
          }}
          scrollY={scrollY}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          className="pb-24"
          profileId={profileId}
        />
      </View>
      {activeProperty && me && (
        <PropertyDetailsBottomSheet
          visible={propertyBottomSheet}
          property={activeProperty}
          user={me}
          onDismiss={() => setPropertyBottomSheet(false)}
        />
      )}
    </>
  );
}
