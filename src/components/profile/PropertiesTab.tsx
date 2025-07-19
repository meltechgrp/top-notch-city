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
  listRef: any;
  scrollY?: SharedValue<number>;
};
export default function PropertiesTabView(props: IProps) {
  const { profileId, onScroll, scrollY, headerHeight, scrollElRef, listRef } =
    props;
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
          refetch={refetch}
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
