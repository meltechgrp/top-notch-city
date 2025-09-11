import React, { memo } from "react";
import { Dimensions, View } from "react-native";
import VerticalProperties from "../property/VerticalProperties";
import { Box, Button, ButtonText, Heading, Text } from "@/components/ui";
import BackgroundView from "@/components/layouts/BackgroundView";

const { height } = Dimensions.get("window");

type IProps = {
  properties: Property[];
  isLoading: boolean;
  hasNextPage: boolean;
  refetch: () => Promise<any>;
  fetchNextPage: () => Promise<any>;
  headerOnlyHeight: number;
  setShowFilter: () => void;
};
function SearchListView(props: IProps) {
  const {
    properties,
    isLoading,
    fetchNextPage,
    hasNextPage,
    refetch,
    headerOnlyHeight,
    setShowFilter,
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
          ListEmptyComponent={<ListEmptyComponent onPress={setShowFilter} />}
        />
      </View>
    </>
  );
}
export default memo(SearchListView);

interface ListEmptyComponentProps {
  onPress: () => void;
}

function ListEmptyComponent({ onPress }: ListEmptyComponentProps) {
  return (
    <BackgroundView style={{ height: height / 1.6 }}>
      <View className="flex-1 justify-center items-center gap-2">
        <Heading className="text-2xl font-bold">No results found</Heading>
        <Text className="text-center w-[80%]">
          Change or remove some of your filters or modify your search area.
        </Text>
        <Button onPress={onPress} className="mt-4">
          <ButtonText>Edit filters</ButtonText>
        </Button>
      </View>
    </BackgroundView>
  );
}
