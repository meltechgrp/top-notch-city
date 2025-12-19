import { Dimensions, StyleSheet, View } from "react-native";
import { useCallback, useMemo, useRef } from "react";
import { Box, Button, Icon, Text } from "@/components/ui";
import BottomSheet, {
  useBottomSheetInternal,
  useBottomSheetScrollableCreator,
} from "@gorhom/bottom-sheet";
import { Colors } from "@/constants/Colors";
import { formatNumber } from "@/lib/utils";
import PropertyListItem from "@/components/property/PropertyListItem";
import { router } from "expo-router";
import { HouseIcon, Layers, MapIcon, Send } from "lucide-react-native";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import AnimatedPressable from "@/components/custom/AnimatedPressable";

import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import eventBus from "@/lib/eventBus";
import DropdownSelect from "@/components/custom/DropdownSelect";
import VerticalPropertyLoaderWrapper from "@/components/loaders/VerticalPropertyLoader";
import { FlashList } from "@shopify/flash-list";
const { width } = Dimensions.get("screen");

type Props = {
  total: number;
  properties: PropertyListItem[];
  isLoading: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => Promise<any>;
  setShowFilter: () => void;
  useMyLocation: () => Promise<void>;
  filter: SearchFilters;
  isTab?: boolean;
  onReset?: () => void;
};

function SearchListBottomSheet({
  properties,
  isLoading,
  fetchNextPage,
  hasNextPage,
  onReset,
  total,
  useMyLocation,
  filter,
  isTab,
}: Props) {
  const BottomSheetScrollable = useBottomSheetScrollableCreator();
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(
    () => (isTab ? ["20%", "40%", "60%", "90%"] : ["10%", "40%", "60%", "90%"]),
    [isTab]
  );

  const renderItem = useCallback(
    ({ item }: { item: PropertyListItem }) => (
      <PropertyListItem
        onPress={(data) => {
          router.push({
            pathname: `/property/[propertyId]`,
            params: {
              propertyId: data.slug,
            },
          });
        }}
        style={styles.itemContainer}
        isList={true}
        data={item}
        rounded={true}
      />
    ),
    []
  );
  return (
    <BottomSheet
      ref={sheetRef}
      index={1}
      snapPoints={snapPoints}
      style={{
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        flex: 1,
        width,
        backgroundColor: Colors.light.background,
      }}
      backgroundComponent={null}
      enableDynamicSizing={false}
      handleComponent={(props) => (
        <CustomHandle
          {...props}
          filter={filter}
          total={total}
          isLoading={isLoading}
          useMyLocation={useMyLocation}
          toggleList={() => sheetRef.current?.snapToIndex(0)}
        />
      )}
      footerComponent={() => (
        <FloatingMapButton
          isTab={isTab}
          onPress={() => sheetRef.current?.snapToIndex(0)}
        />
      )}
    >
      <VerticalPropertyLoaderWrapper
        headerHeight={20}
        loading={isLoading || false}
      >
        <FlashList
          data={properties}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onEndReached={() => {
            if (hasNextPage && !isLoading) fetchNextPage?.();
          }}
          renderScrollComponent={BottomSheetScrollable}
          onEndReachedThreshold={0.1}
          scrollEventThrottle={16}
          ListEmptyComponent={() => (
            <>
              {!isLoading && (
                <MiniEmptyState
                  icon={HouseIcon}
                  title="No Properties Found"
                  description="You're all caught up. New properties will appear here soon."
                  buttonLabel="Try again"
                  onPress={onReset}
                />
              )}
            </>
          )}
          contentContainerStyle={styles.contentContainer}
        />
      </VerticalPropertyLoaderWrapper>
    </BottomSheet>
  );
}

export default SearchListBottomSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 4,
    paddingBottom: 60,
    backgroundColor: Colors["light"].background,
  },
  itemContainer: {
    margin: 6,
    width: width - 20,
  },
});

export const CustomHandle = ({
  total,
  useMyLocation,
  filter,
  toggleList,
  isLoading,
}: any) => {
  const { animatedIndex } = useBottomSheetInternal();

  const buttonsStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      animatedIndex.value,
      [1.2, 2],
      [0, 56],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      animatedIndex.value,
      [1.2, 2],
      [1, 0],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY }],
      opacity,
    };
  }, []);

  const titleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedIndex.value,
      [2.6, 3],
      [1, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity,
    };
  }, []);
  const wrapperStyle = useAnimatedStyle(() => {
    const height = interpolate(
      animatedIndex.value,
      [0.8, 1.2, 3],
      [80, 40, 25],
      Extrapolation.CLAMP
    );

    return {
      height,
    };
  }, []);

  return (
    <Animated.View
      style={wrapperStyle}
      className="w-full bg-background-muted relative rounded-t-3xl"
    >
      <Animated.View
        style={buttonsStyle}
        className="absolute -top-16 w-full flex-row justify-between px-4"
      >
        <View className="flex-row gap-4">
          <DropdownSelect
            options={["standard", "satellite", "hybrid"]}
            onChange={(val) => {
              toggleList();
              eventBus.dispatchEvent("MAP_SET_TYPE", val);
            }}
            className=" rounded-full bg-background-muted/70"
            icon={Layers}
          />
          <AnimatedPressable
            className="p-4 bg-background-muted/70 rounded-full"
            onPress={() => {
              toggleList();
              useMyLocation();
            }}
          >
            <Icon as={Send} size="xl" />
          </AnimatedPressable>
        </View>

        <Button
          onPress={() => {
            toggleList();
          }}
          className="rounded-3xl h-12"
        >
          <Text className="text-base font-medium">Save Search</Text>
        </Button>
      </Animated.View>

      <Animated.View
        style={titleStyle}
        className="absolute inset-0 items-center justify-center pt-2"
      >
        {isLoading ? (
          <Text className="text-xl font-medium text-typography/80">
            Loading...
          </Text>
        ) : (
          <Text className="text-xl flex-row flex font-medium">
            {formatNumber(total?.toString())} Properties for{" "}
            <Text className=" capitalize text-xl font-medium">
              {filter?.purpose}
            </Text>
          </Text>
        )}
      </Animated.View>

      <View className="justify-center items-center pt-2">
        <View className="h-1.5 w-[60px] rounded-md bg-primary" />
      </View>
    </Animated.View>
  );
};

export const FloatingMapButton = ({
  onPress,
  isTab,
}: {
  onPress: () => void;
  isTab?: boolean;
}) => {
  return (
    <Animated.View
      style={[
        {
          height: 1,
        },
      ]}
      className={"bg-background"}
    >
      <AnimatedPressable
        onPress={onPress}
        style={[
          {
            position: "absolute",
            bottom: isTab ? 100 : 60,
            alignSelf: "center",
          },
        ]}
        className=" absolute bg-primary p-2.5 rounded-full flex-row gap-2 left-[43%] z-50"
      >
        <Icon size="lg" className="text-white" as={MapIcon} />
        <Text className="text-white font-semibold text-md">Map</Text>
      </AnimatedPressable>
    </Animated.View>
  );
};
