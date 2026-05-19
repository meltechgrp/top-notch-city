import { fetchWishlist } from "@/actions/property";
import VerticalProperties from "@/components/property/VerticalProperties";
import { View } from "@/components/ui";
import { toUiProperties } from "@/lib/propertyAdapter";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export default function Wishlist() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["wishlist"],
    queryFn: fetchWishlist,
  });
  const list = useMemo(() => toUiProperties(data || []), [data]);
  return (
    <View className="flex-1 bg-background p-4">
      <VerticalProperties
        isLoading={isLoading}
        properties={list}
        showLike={false}
        disableHeader={true}
        refetch={refetch}
        isEmptyTitle="Your wishlist is empty!"
      />
    </View>
  );
}
