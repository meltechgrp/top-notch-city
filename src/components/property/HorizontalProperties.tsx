import { PropertySkeletonCard } from "@/components/property/PropertyCardSkeleton";
import PropertyListItem from "@/components/property/PropertyListItem";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native";
import { useMemo, useCallback, memo } from "react";

interface Props {
  category?: string;
  className?: string;
  isAdmin?: boolean;
  showStatus?: boolean;
  showLike?: boolean;
  isLoading?: boolean;
  isRefetching?: boolean;
  isFeatured?: boolean;
  hasNextPage?: boolean;
  listType?: QueryType;
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
      snapToInterval={344}
      snapToAlignment="center"
      decelerationRate="fast"
      contentContainerClassName="gap-x-4 px-4"
    >
      {isBusy
        ? skeletonItems.map((_, i) => (
            <PropertySkeletonCard isHorizontal key={i} />
          ))
        : data.map((property) => (
            <PropertyListItem
              key={property.id}
              showLike={showLike}
              listType={listType}
              isFeatured={isFeatured}
              showStatus={showStatus}
              rounded
              isHorizontal
              data={property}
              onPress={handlePress}
            />
          ))}
    </ScrollView>
  );
}

export default memo(HorizontalProperties);
