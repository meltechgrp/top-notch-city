import React, { memo } from "react";
import { View } from "react-native";
import VerticalProperties from "../property/VerticalProperties";

type IProps = {
  properties: Property[];
  isLoading: boolean;
  hasNextPage: boolean;
  refetch: () => Promise<any>;
  fetchNextPage: () => Promise<any>;
  headerOnlyHeight: number;
};
function SearchListView(props: IProps) {
  const {
    properties,
    isLoading,
    fetchNextPage,
    hasNextPage,
    refetch,
    headerOnlyHeight,
  } = props;

  return (
    <>
      <View className="flex-1 px-4">
        <VerticalProperties
          isLoading={isLoading}
          data={properties}
          profileId=""
          className="pb-24"
          refetch={refetch}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          headerHeight={headerOnlyHeight}
        />
      </View>
    </>
  );
}
export default memo(SearchListView);
