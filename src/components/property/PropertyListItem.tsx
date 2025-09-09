import { cn, composeFullAddress, useTimeAgo } from "@/lib/utils";
import { StyleProp, View, ViewStyle } from "react-native";
import { Icon, Text, Pressable } from "../ui";
import { MapPin } from "lucide-react-native";
import { memo, useMemo } from "react";
import { Colors } from "@/constants/Colors";
import Layout from "@/constants/Layout";
import { useLayout } from "@react-native-community/hooks";
import { PropertyStatus } from "./PropertyStatus";
import PropertyInteractions from "./PropertyInteractions";
import { PropertyTitle } from "./PropertyTitle";
import { useStore } from "@/store";
import { PropertyPrice } from "./PropertyPrice";
import PropertyMedia from "@/components/property/PropertyMedia";

type Props = {
  data: Property;
  className?: string;
  showFacilites?: boolean;
  showStatus?: boolean;
  isList?: boolean;
  rounded?: boolean;
  isHorizontal?: boolean;
  withPagination?: boolean;
  enabled?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress: (data: Props["data"]) => void;
};
function PropertyListItem(props: Props) {
  const {
    data,
    className,
    isHorizontal,
    style,
    onPress,
    showStatus,
    rounded,
    isList,
    enabled,
    withPagination,
  } = props;
  const me = useStore((s) => s.me);
  const { bannerHeight } = Layout;
  const { price, media, address, interaction, status, owner } = data;
  const { width, onLayout } = useLayout();
  const images = useMemo(
    () => media?.filter((item) => item.media_type == "IMAGE") ?? [],
    [media]
  );

  const isMine = useMemo(() => me?.id === owner?.id, [me, owner]);
  const isAdmin = useMemo(() => me?.role == "admin", [me]);
  const Actions = () => {
    if (showStatus && (isAdmin || isMine)) {
      return <PropertyStatus status={status} />;
    } else {
      return (
        <Text className="text-gray-300">{useTimeAgo(data.created_at)}</Text>
      );
    }
  };

  return (
    <Pressable
      onLayout={onLayout}
      key={data.id}
      onPress={() => onPress(data)}
      style={[{ height: bannerHeight }, style]}
      className={cn(
        "relative flex-1 rounded-xl",
        isHorizontal && "w-80",
        className
      )}
    >
      <PropertyMedia
        style={{ width, height: bannerHeight }}
        source={images[0]}
        withBackdrop
        rounded
      />
      <View className=" absolute top-0 w-full h-full justify-between">
        <View className={cn(" flex-row p-4 pb-0 items-start justify-between")}>
          <Actions />
          <PropertyPrice property={data} />
        </View>
        <View
          className={cn(
            "flex-row pb-5 px-4 gap-4 justify-between items-end",
            !address && "pb-6"
          )}
        >
          <View className="flex-1 gap-1">
            <PropertyTitle property={data} />

            {address && (
              <View className="flex-row items-center gap-1">
                <Icon as={MapPin} size="xs" color={Colors.primary} />
                <Text size={"sm"} className="text-white">
                  {composeFullAddress(address, true, "short")}
                </Text>
              </View>
            )}
          </View>
          {interaction && (
            <PropertyInteractions
              interaction={interaction}
              className="w-[15%] gap-2 pr-0"
            />
          )}
        </View>
      </View>
    </Pressable>
  );
}

export default memo(PropertyListItem);
