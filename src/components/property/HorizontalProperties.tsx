import { PropertySkeletonCard } from "@/components/property/PropertyCardSkeleton";
import PropertyListItem from "@/components/property/PropertyListItem";
import { useRouter } from "expo-router";
import { ScrollView, StyleProp, ViewStyle } from "react-native";
import { useMemo, useCallback, memo } from "react";
import { cn, deduplicate } from "@/lib/utils";

interface Props {
  category?: string;
  className?: string;
  isAdmin?: boolean;
  showStatus?: boolean;
  showLike?: boolean;
  showTitle?: boolean;
  isLoading?: boolean;
  isRefetching?: boolean;
  snapToInterval?: number;
  isFeatured?: boolean;
  hasNextPage?: boolean;
  listType?: any[];
  imageWrapperClassName?: string;
  subClassName?: string;
  contentContainerClassName?: string;
  imageStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  data: Property[];
  refetch?: () => Promise<any>;
  fetchNextPage?: () => Promise<any>;
  onPress?: (data: Property) => void;
}

function HorizontalProperties({
  data = [],
  isLoading = false,
  isRefetching = false,
  fetchNextPage,
  className,
  onPress,
  isFeatured,
  listType,
  showLike = true,
  showStatus = false,
  style,
  imageStyle,
  imageWrapperClassName,
  contentContainerClassName,
  showTitle,
  subClassName,
  snapToInterval,
}: Props) {
  const router = useRouter();

  const skeletonItems = useMemo(() => Array.from({ length: 5 }), []);

  const handlePress = useCallback(
    (property: Property) => {
      if (onPress) return onPress(property);

      router.push({
        pathname: "/property/[propertyId]",
        params: { propertyId: property.id },
      });
    },
    [router, onPress]
  );

  const isBusy = isLoading || isRefetching;
  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      snapToInterval={snapToInterval || 344}
      snapToAlignment="center"
      decelerationRate="fast"
      contentContainerClassName={cn("gap-x-4 px-4", contentContainerClassName)}
    >
      {isBusy
        ? skeletonItems.map((_, i) => (
            <PropertySkeletonCard isHorizontal key={i} />
          ))
        : deduplicate(data, "id").map((property) => (
            <PropertyListItem
              key={property.id}
              showLike={showLike}
              listType={listType}
              isFeatured={isFeatured}
              showStatus={showStatus}
              rounded
              imageStyle={imageStyle}
              imageWrapperClassName={imageWrapperClassName}
              isHorizontal
              data={property}
              subClassName={subClassName}
              showTitle={showTitle}
              style={style}
              className={className}
              onPress={handlePress}
            />
          ))}
    </ScrollView>
  );
}

export default memo(HorizontalProperties);
