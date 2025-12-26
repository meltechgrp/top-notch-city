import {
  cn,
  formatMoney,
  formatDateDistance,
  formatNumberCompact,
  composeFullAddress,
  generateTitle,
  FindAmenity,
} from "@/lib/utils";
import { StyleProp, View, ViewStyle } from "react-native";
import { Icon, Text, Pressable, Image } from "../ui";
import {
  Bath,
  Bed,
  Eye,
  Heart,
  Home,
  LandPlot,
  MapPin,
  VectorSquare,
} from "lucide-react-native";
import { memo, useMemo } from "react";
import Layout from "@/constants/Layout";
import { useLayout } from "@react-native-community/hooks";
import { PropertyStatus } from "./PropertyStatus";
import { PropertyBadge } from "./PropertyBadge";
import { openAccessModal } from "@/components/globals/AuthModals";
import { AnimatedLikeButton } from "@/components/custom/AnimatedLikeButton";
import { useLike } from "@/hooks/useLike";
import { generateMediaUrlSingle } from "@/lib/api";
import { useMe } from "@/hooks/useMe";
import { Durations } from "@/constants/Amenities";

type Props = {
  data: Property;
  className?: string;
  subClassName?: string;
  showFacilites?: boolean;
  showStatus?: boolean;
  isList?: boolean;
  isFeatured?: boolean;
  showLike?: boolean;
  listType?: any[];
  rounded?: boolean;
  showTitle?: boolean;
  isHorizontal?: boolean;
  withPagination?: boolean;
  enabled?: boolean;
  imageWrapperClassName?: string;
  imageStyle?: StyleProp<ViewStyle>;
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
    imageWrapperClassName,
    imageStyle,
    showTitle = true,
    subClassName,
  } = props;
  const { me } = useMe();
  const { toggleLike } = useLike({ queryKey: listType });
  const { bannerHeight } = Layout;
  const { price, media, address, interaction, status, owner } = data;
  const isMine = useMemo(() => me?.id === owner?.id, [me, owner]);
  const isAdmin = useMemo(() => me?.role == "admin", [me]);
  const Actions = () => {
    if (isFeatured) {
      return <PropertyStatus status="featured" />;
    } else if (showStatus && (isAdmin || isMine)) {
      return <PropertyStatus status={status} />;
    } else if (
      data.category.name == "Shortlet" ||
      data.category.name == "Hotel"
    ) {
      return (
        <Text className="text-white bg-black px-3 py-1 rounded-2xl">
          {data.category.name}
        </Text>
      );
    } else {
      return (
        <Text className="text-gray-300 bg-black/70 px-3 py-1 rounded-2xl">
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
  const banner = media[0];
  return (
    <Pressable
      key={data.id}
      onPress={() => onPress(data)}
      style={[{ minHeight: 200 }, style]}
      className={cn(
        "relative flex-1 rounded-3xl p-2 bg-background-muted",
        isHorizontal && "w-[23rem]",
        className
      )}
    >
      <View
        style={[{ height: bannerHeight - 30 }, imageStyle]}
        className={cn(
          " rounded-[1.2rem] bg-background-muted/50 overflow-hidden relative flex-1",
          imageWrapperClassName
        )}
      >
        <Image
          rounded
          source={{
            uri: generateMediaUrlSingle(banner.url),
            cacheKey: banner.id,
          }}
          transition={500}
          style={[{ height: bannerHeight - 30 }, imageStyle as any]}
          contentFit="cover"
        />
        <View className=" absolute top-0 w-full h-full justify-between">
          <View
            className={cn(
              "flex-row px-3 pt-3 pb-0 items-start justify-between"
            )}
          >
            <Actions />
            <PropertyBadge property={data} />
          </View>
          <View className="flex-row justify-between items-center p-4 pb-2">
            <View className="flex-row gap-1">
              <View className="flex-row h-8 gap-2 bg-black/70 rounded-2xl py-0 px-3 items-center">
                <Icon as={Eye} size="sm" className="text-white" />
                <Text className="text-white font-medium text-sm ">
                  {formatNumberCompact(interaction?.viewed)}
                </Text>
              </View>
              <View className="flex-row h-8 gap-2 bg-black/70 rounded-2xl py-0 px-3 items-center">
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
                  liked={data?.owner_interaction?.liked || false}
                  className="w-7 h-7 text-white"
                />
              </Pressable>
            )}
          </View>
        </View>
      </View>
      <View className={cn("flex-1 p-4 pt-3 px-2", subClassName)}>
        <View className=" gap-1 w-full">
          <View className="flex-row items-center">
            <Text className="text-white text-xl font-bold">
              {formatMoney(price, data?.currency?.code || "NGN", 0)}
            </Text>
            <Text className="text-base text-white">
              {data.purpose == "rent" &&
                data?.duration &&
                `/${Durations.find((d) => d.value == data.duration)?.label?.toLowerCase()}`}
              {(data.category.name == "Shortlet" ||
                data.category.name == "Hotel") &&
                !data?.duration &&
                "/night"}
            </Text>
          </View>
          {data.category.name !== "Land" ? (
            <View className="flex-row gap-4 mb-1">
              <View className="flex-row rounded-xl items-center gap-2">
                <Icon size="sm" as={Bed} className="text-primary" />
                <Text className="text-sm">
                  {FindAmenity("Bedroom", data) || "N/A"} bed
                </Text>
              </View>
              <View className="flex-row rounded-xl items-center gap-2">
                <Icon size="sm" as={Bath} className="text-primary" />
                <Text className="text-sm">
                  {FindAmenity("Bathroom", data) || "N/A"} bath
                </Text>
              </View>
              <View className="flex-row rounded-xl items-center gap-2">
                <Icon size="sm" as={VectorSquare} className="text-primary" />
                <Text className="text-sm">
                  {FindAmenity("Landarea", data) || "N/A"} sqft
                </Text>
              </View>
            </View>
          ) : (
            <View className="flex-row gap-4 mb-1">
              <View className="flex-row rounded-xl items-center gap-2">
                <Icon size="sm" as={LandPlot} className="text-primary" />
                <Text className="text-sm">
                  {FindAmenity("Plots", data) || "N/A"} plot
                </Text>
              </View>
              <View className="flex-row rounded-xl items-center gap-2">
                <Icon size="sm" as={VectorSquare} className="text-primary" />
                <Text className="text-sm">
                  {FindAmenity("Landarea", data) || "N/A"} sqft
                </Text>
              </View>
            </View>
          )}
        </View>

        <View className="flex-row gap-4 items-center">
          <View className="flex-1 flex-row gap-1 items-center">
            <Icon size="sm" as={MapPin} className="text-primary" />
            <Text numberOfLines={1} className="text-white flex-1 text-xs">
              {composeFullAddress(data.address)}
            </Text>
          </View>
        </View>
        {showTitle && (
          <View className="flex-row gap-1 items-center mt-1">
            <Icon as={Home} size="sm" className="text-primary" />
            <Text className=" text-sm">{generateTitle(data)}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

export default memo(PropertyListItem);
