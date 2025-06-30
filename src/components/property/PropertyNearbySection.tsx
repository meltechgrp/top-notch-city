import { useMemo, useState } from 'react';
import { Heading, Icon, Text, View } from '../ui';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Colors } from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { ActivityIndicator, ScrollView } from 'react-native';
import { usePropertyStore } from '@/store/propertyStore';
import { Church, Fuel, School, Utensils } from 'lucide-react-native';
import { fetchNearbySection } from '@/actions/property';
import { useQuery } from '@tanstack/react-query';

const categories = {
	Restaurants: 'restaurant',
	Schools: 'school',
	GasStations: 'gas_station',
	Churches: 'church',
};

const NearbyCategory = ({
	type,
	latitude,
	longitude,
}: {
	type: string;
	latitude: number;
	longitude: number;
}) => {
	const { data, isLoading } = useQuery({
		queryKey: [type, latitude, latitude],
		queryFn: () => fetchNearbySection({ type, latitude, longitude }),
	});
	const places = useMemo<Place[]>(() => {
		if (!data?.places) return [];
		return data.places.map((place: any) => ({
			name: place.displayName?.text,
			vicinity: place.formattedAddress,
		}));
	}, [data]);

	if (isLoading) {
		return (
			<View className="items-center justify-center mt-6">
				<ActivityIndicator size="small" />
			</View>
		);
	}

	if (!places.length) {
		return (
			<View className="items-center justify-center mt-6">
				<Text className=" text-md">No places found in this category</Text>
			</View>
		);
	}
	const categoryIcons = {
		restaurant: Utensils,
		school: School,
		gas_station: Fuel,
		church: Church,
	};
	return (
		<View className="flex-1 py-2">
			<ScrollView className="flex-1 pb-12">
				<View className="flex-1 gap-2">
					{places.map((item, i) => (
						<View
							key={item.vicinity + i}
							className="p-4 py-2 bg-background-muted min-h-16 flex-row items-center gap-2 rounded-xl">
							<Icon
								as={categoryIcons[type as keyof typeof categoryIcons]}
								className="text-primary"
							/>
							<View className="flex-1 gap-px">
								<Text className="font-medium">{item.name}</Text>
								<Text className="text-xs" numberOfLines={2}>
									{item.vicinity.toLowerCase()}
								</Text>
							</View>
						</View>
					))}
				</View>
			</ScrollView>
		</View>
	);
};

export function PropertyNearbySection() {
	const { details } = usePropertyStore();
	const [index, setIndex] = useState(0);
	const routes = Object.keys(categories).map((key) => ({
		key,
		title: key,
	}));
	const renderScene = SceneMap(
		Object.fromEntries(
			routes.map(({ key }) => [
				key,
				() => (
					<NearbyCategory
						type={categories[key as keyof typeof categories]}
						latitude={details?.address.latitude!}
						longitude={details?.address.longitude!}
					/>
				),
			])
		)
	);
	return (
		<View className=" gap-4">
			<Heading size="lg">Nearby</Heading>
			<View>
				<TabView
					style={{ height: 434 }}
					navigationState={{ index, routes }}
					renderScene={renderScene}
					onIndexChange={setIndex}
					initialLayout={{ width: Layout.window.width }}
					renderTabBar={(props) => (
						<TabBar
							{...props}
							scrollEnabled
							indicatorStyle={{ backgroundColor: Colors.primary }}
							style={{ backgroundColor: 'transparent' }}
							activeColor={Colors.primary}
						/>
					)}
				/>
			</View>
		</View>
	);
}
