import { fetchWishlist } from "@/actions/property";
import VerticalProperties from "@/components/property/VerticalProperties";
import { Text, View } from "@/components/ui";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";


export default function Wishlist() {
	const { data, isLoading, refetch } = useQuery({
		queryKey: ['wishlist'],
		queryFn: fetchWishlist,
	});
	const list = useMemo(() => data || [], [data]);
    return (
        <View className="flex-1 bg-background">
           <VerticalProperties
				isLoading={isLoading}
				data={list as any}
				disableHeader={true}
				refetch={refetch}
				isEmptyTitle="Your wishlist is empty!"
			/>
        </View>
    );
}