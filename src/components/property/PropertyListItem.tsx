import {
  cn,
  composeFullAddress,
  formatMoney,
  formatDateDistance,
  generateTitle,
  FindAmenity,
  formatNumberCompact,
} from "@/lib/utils";
import { StyleProp, View, ViewStyle } from "react-native";
import { Icon, Text, Pressable, Badge, Button } from "../ui";
import {
  Bath,
  Bed,
  Eye,
  Heart,
  Home,
  House,
  LandPlot,
  MapPin,
  MessageCircleMore,
} from "lucide-react-native";
import { memo, useMemo } from "react";
import Layout from "@/constants/Layout";
import { useLayout } from "@react-native-community/hooks";
import { PropertyStatus } from "./PropertyStatus";
import PropertyInteractions from "./PropertyInteractions";
import { PropertyBadge } from "./PropertyBadge";
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
  listType?: any[];
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
  const { toggleLike } = useLike({ queryKey: listType });
  const { bannerHeight, window } = Layout;
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
        <Text className="text-gray-300 bg-black/50 px-3 py-1 rounded-2xl">
          {formatDateDistance(data.created_at)}
        </Text>
      );
    }
  };

  function handleLike() {
    if (!me) {
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
      style={style}
      className={cn(
        "relative flex-1 rounded-3xl p-2 bg-background-muted",
        isHorizontal && "w-[23rem]",
        className
      )}
    >
      <View
        style={{ height: bannerHeight - 30, minHeight: 200 }}
        className=" rounded-[1.2rem] overflow-hidden relative flex-1"
      >
        <PropertyMedia
          style={{ height: bannerHeight - 30, minHeight: 200 }}
          source={images[0]}
          withBackdrop
          rounded
        />
        <View className=" absolute top-0 w-full h-full justify-between">
          <View
            className={cn(
              "flex-row px-3 pt-2 pb-0 items-start justify-between"
            )}
          >
            <Actions />
            <PropertyBadge property={data} />
          </View>
          <View className="flex-row justify-between items-center p-4 pb-2">
            <View className="flex-row gap-1">
              <View className="flex-row h-8 gap-2 bg-black/40 rounded-2xl py-0 px-3 items-center">
                <Icon as={Eye} size="sm" className="text-white" />
                <Text className="text-white font-medium text-sm ">
                  {formatNumberCompact(interaction?.viewed)}
                </Text>
              </View>
              <View className="flex-row h-8 gap-2 bg-black/40 rounded-2xl py-0 px-3 items-center">
                <Icon as={Heart} size="sm" className="text-white" />
                <Text className="text-white font-medium text-sm ">
                  {formatNumberCompact(interaction?.liked)}
                </Text>
              </View>
            </View>
            {showLike && (
              <Pressable
                onPress={handleLike}
                className={"p-2 rounded-full bg-black/50"}
              >
                <AnimatedLikeButton
                  liked={liked}
                  className="w-7 h-7 text-white"
                />
              </Pressable>
            )}
          </View>
        </View>
      </View>
      <View className="flex-1 p-4 pt-3 px-2">
        <View className=" gap-1 w-full">
          <Text className="text-white text-xl font-bold">
            {formatMoney(price, "NGN", 0)}
            {data.category.name == "Shortlet" && "/night"}
          </Text>
          <View className="flex-row gap-4 mb-1">
            <View className="flex-row rounded-xl items-center gap-2">
              <Icon size="sm" as={Bed} className="text-primary" />
              <Text className="text-sm">
                {FindAmenity("Bedroom", data)} bed
              </Text>
            </View>
            <View className="flex-row rounded-xl items-center gap-2">
              <Icon size="sm" as={Bath} className="text-primary" />
              <Text className="text-sm">
                {FindAmenity("Bathroom", data)} bath
              </Text>
            </View>
            <View className="flex-row rounded-xl items-center gap-2">
              <Icon size="sm" as={LandPlot} className="text-primary" />
              <Text className="text-sm">
                {FindAmenity("Landarea", data)} sqft
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row gap-4 items-center">
          {address && (
            <View className="flex-1 flex-row gap-1 items-center">
              <Icon size="sm" as={MapPin} className="text-primary" />
              <Text className="text-white flex-1 text-xs">
                {composeFullAddress(address)}
              </Text>
            </View>
          )}
        </View>
        {(data.category.name == "Shortlet" ||
          data.category.name == "Hotel") && (
          <View className="flex-row gap-1 items-center mt-2">
            <Icon as={Home} size="sm" className="text-primary" />
            <Text className=" text-sm">{data.title}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

export default memo(PropertyListItem);
