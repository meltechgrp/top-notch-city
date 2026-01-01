import {
  cn,
  formatMoney,
  formatDateDistance,
  formatNumberCompact,
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
import { useMemo } from "react";
import Layout from "@/constants/Layout";
import { PropertyStatus } from "./PropertyStatus";
import { PropertyBadge } from "./PropertyBadge";
import { openAccessModal } from "@/components/globals/AuthModals";
import { AnimatedLikeButton } from "@/components/custom/AnimatedLikeButton";
import { useLike } from "@/hooks/useLike";
import { useMe } from "@/hooks/useMe";
import { Durations } from "@/constants/Amenities";
import { withObservables } from "@nozbe/watermelondb/react";
import { Property } from "@/db/models/properties";
import { generateMediaUrlSingle } from "@/lib/api";

type Props = {
  property: Property;
  className?: string;
  subClassName?: string;
  showFacilites?: boolean;
  showStatus?: boolean;
  isList?: boolean;
  isFeatured?: boolean;
  showLike?: boolean;
  rounded?: boolean;
  showTitle?: boolean;
  isHorizontal?: boolean;
  withPagination?: boolean;
  enabled?: boolean;
  imageWrapperClassName?: string;
  imageStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  onPress: (data: Props["property"]) => void;
};
function PropertyListItem(props: Props) {
  const {
    property: data,
    className,
    isHorizontal,
    style,
    onPress,
    showStatus,
    isFeatured,
    showLike,
    imageWrapperClassName,
    imageStyle,
    showTitle = true,
    subClassName,
  } = props;
  const { me } = useMe();
  const { toggleLike } = useLike();
  const { bannerHeight } = Layout;
  const { price, status, server_owner_id } = data;
  const isMine = useMemo(
    () => me?.id === server_owner_id,
    [me, server_owner_id]
  );
  const isAdmin = useMemo(() => me?.role == "admin", [me]);
  const Actions = () => {
    if (isFeatured) {
      return <PropertyStatus status="featured" />;
    } else if (showStatus && (isAdmin || isMine)) {
      return <PropertyStatus status={status as any} />;
    } else if (data.category == "Shortlet" || data.category == "Hotel") {
      return (
        <Text className="text-white bg-black px-3 py-1 rounded-2xl">
          {data.category}
        </Text>
      );
    } else {
      return (
        <Text className="text-gray-300 bg-black/70 px-3 py-1 rounded-2xl">
          {formatDateDistance(new Date(data.created_at).toString())}
        </Text>
      );
    }
  };
  async function handleLike() {
    if (!me) {
      return openAccessModal({ visible: true });
    } else {
      await data.markAsLiked();
      toggleLike({ id: data.id });
    }
  }
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
        {data?.thumbnail && (
          <Image
            rounded
            source={{
              uri: generateMediaUrlSingle(data.thumbnail),
              cacheKey: data.property_server_id,
            }}
            transition={500}
            style={[{ height: bannerHeight - 30 }, imageStyle as any]}
            contentFit="cover"
          />
        )}
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
                  {formatNumberCompact(data.views)}
                </Text>
              </View>
              <View className="flex-row h-8 gap-2 bg-black/70 rounded-2xl py-0 px-3 items-center">
                <Icon as={Heart} size="sm" className="text-white" />
                <Text className="text-white font-medium text-sm ">
                  {formatNumberCompact(data.likes)}
                </Text>
              </View>
            </View>
            {showLike && (
              <Pressable
                onPress={handleLike}
                className={"p-2 rounded-full bg-black/50"}
              >
                <AnimatedLikeButton
                  liked={data?.liked || false}
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
              {formatMoney(price, data?.currency || "NGN", 0)}
            </Text>
            <Text className="text-base text-white">
              {data.purpose == "rent" &&
                Number(data?.duration) > 0 &&
                `/${Durations.find((d) => d.value == data.duration)?.label?.toLowerCase()}`}
              {(data.category == "Shortlet" || data.category == "Hotel") &&
                Number(data?.duration) < 1 &&
                "/night"}
            </Text>
          </View>
          {data.category !== "Land" ? (
            <View className="flex-row gap-4 mb-1">
              <View className="flex-row rounded-xl items-center gap-2">
                <Icon size="sm" as={Bed} className="text-primary" />
                <Text className="text-sm">{data?.bedroom || "N/A"} bed</Text>
              </View>
              <View className="flex-row rounded-xl items-center gap-2">
                <Icon size="sm" as={Bath} className="text-primary" />
                <Text className="text-sm">{data?.bathroom || "N/A"} bath</Text>
              </View>
              <View className="flex-row rounded-xl items-center gap-2">
                <Icon size="sm" as={VectorSquare} className="text-primary" />
                <Text className="text-sm">{data?.landarea || "N/A"} sqft</Text>
              </View>
            </View>
          ) : (
            <View className="flex-row gap-4 mb-1">
              <View className="flex-row rounded-xl items-center gap-2">
                <Icon size="sm" as={LandPlot} className="text-primary" />
                <Text className="text-sm">{data?.plots || "N/A"} plot</Text>
              </View>
              <View className="flex-row rounded-xl items-center gap-2">
                <Icon size="sm" as={VectorSquare} className="text-primary" />
                <Text className="text-sm">{data?.landarea || "N/A"} sqft</Text>
              </View>
            </View>
          )}
        </View>

        <View className="flex-row gap-4 items-center">
          <View className="flex-1 flex-row gap-1 items-center">
            <Icon size="sm" as={MapPin} className="text-primary" />
            <Text numberOfLines={1} className="text-white flex-1 text-xs">
              {data.address}
            </Text>
          </View>
        </View>
        {showTitle && (
          <View className="flex-row gap-1 items-center mt-1">
            <Icon as={Home} size="sm" className="text-primary" />
            <Text className=" text-sm">{data.title}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const enhance = withObservables(["property"], ({ property }) => ({
  property: property.observe(),
}));

export default enhance(PropertyListItem);
