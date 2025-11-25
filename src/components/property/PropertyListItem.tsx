import { cn, composeFullAddress, formatMoney, useTimeAgo } from "@/lib/utils";
import { StyleProp, View, ViewStyle } from "react-native";
import { Icon, Text, Pressable } from "../ui";
import { MapPin } from "lucide-react-native";
import { memo, useMemo } from "react";
import Layout from "@/constants/Layout";
import { useLayout } from "@react-native-community/hooks";
import { PropertyStatus } from "./PropertyStatus";
import PropertyInteractions from "./PropertyInteractions";
import { PropertyTitle } from "./PropertyTitle";
import { useStore } from "@/store";
import PropertyMedia from "@/components/property/PropertyMedia";
import { openAccessModal } from "@/components/globals/AuthModals";
import { AnimatedLikeButton } from "@/components/custom/AnimatedLikeButton";
import { useLike } from "@/hooks/useLike";

type Props = {
  data: Property;
  className?: string;
  showFacilites?: boolean;
  showStatus?: boolean;
  isList?: boolean;
  isFeatured?: boolean;
  showLike?: boolean;
  listType?: QueryType;
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
    isFeatured,
    showLike,
    listType,
  } = props;
  const me = useStore((s) => s.me);
  const { toggleLike } = useLike({ queryKey: [listType || "trending"] });
  const hasAuth = useStore((s) => s.hasAuth);
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
    if (isFeatured) {
      return <PropertyStatus status="featured" />;
    } else if (showStatus && (isAdmin || isMine)) {
      return <PropertyStatus status={status} />;
    } else {
      return (
        <Text className="text-gray-300">{useTimeAgo(data.created_at)}</Text>
      );
    }
  };

  function handleLike() {
    if (!hasAuth) {
      return openAccessModal({ visible: true });
    } else {
      toggleLike({ id: data.id });
    }
  }
  const liked = useMemo(
    () => data?.owner_interaction?.liked,
    [data?.owner_interaction?.liked]
  );
  return (
    <Pressable
      onLayout={onLayout}
      key={data.id}
      onPress={() => onPress(data)}
      style={[{ height: bannerHeight }, style]}
      className={cn(
        "relative flex-1 rounded-xl",
        isHorizontal && "w-[23rem]",
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
          {showLike && (
            <Pressable
              onPress={handleLike}
              className={"p-1 rounded-full bg-black/10"}
            >
              <AnimatedLikeButton
                liked={liked}
                className="w-7 h-7 text-white"
              />
            </Pressable>
          )}
        </View>
        <View
          className={cn(
            "flex-row pb-5 px-4 gap-4 justify-between items-end",
            !address && "pb-6"
          )}
        >
          <View className="flex-1">
            <View className="flex-row justify-between items-end">
              <PropertyTitle property={data} />
              {interaction && (
                <PropertyInteractions
                  interaction={interaction}
                  className="w-[15%] gap-2 pr-0"
                />
              )}
            </View>

            {address && (
              <View className="flex-row items-center gap-1">
                <Icon as={MapPin} size="sm" className="text-white" />
                <Text className="text-white text-sm">
                  {composeFullAddress(address)}
                </Text>
              </View>
            )}
            <Text className="text-white text-xl font-bold">
              {formatMoney(price, "NGN", 0)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default memo(PropertyListItem);
