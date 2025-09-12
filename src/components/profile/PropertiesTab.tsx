import React, { useMemo } from "react";
import { NativeScrollEvent, View } from "react-native";
import VerticalProperties from "../property/VerticalProperties";
import { SharedValue } from "react-native-reanimated";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";

type IProps = {
  profileId: string;
  onScroll?: (e: NativeScrollEvent) => any;
  headerHeight: number;
  scrollElRef: any;
  refetch: any;
  type?: boolean;
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
    type = true,
  } = props;
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
  const newData = useMemo(
    () =>
      list?.filter((p) =>
        type ? p.category.name != "Land" : p.category.name == "Land"
      ),
    [list]
  );
  useRefreshOnFocus(refetch);
  return (
    <>
      <View className="flex-1 p-4">
        <VerticalProperties
          isLoading={isLoading}
          data={newData}
          showLike={false}
          onScroll={onScroll}
          scrollElRef={scrollElRef}
          headerHeight={headerHeight}
          listRef={listRef}
          refetch={async () => {
            await refetch();
            await reload();
          }}
          scrollY={scrollY}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          className="pb-24"
          profileId={profileId}
        />
      </View>
    </>
  );
}
