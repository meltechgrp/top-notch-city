import React, { useMemo } from "react";
import { NativeScrollEvent, View } from "react-native";
import VerticalProperties from "../property/VerticalProperties";
import { SharedValue } from "react-native-reanimated";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";

type IProps = {
  profileId: string;
  refetch: any;
};
export default function PropertiesTabView(props: IProps) {
  const { profileId, refetch: reload } = props;
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
          scrollEnabled={false}
          showLike={false}
          refetch={async () => {
            await refetch();
            await reload();
          }}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          className="pb-24"
          profileId={profileId}
        />
      </View>
    </>
  );
}
