import { useEffect, useState } from 'react';
import { Heading, Text, View } from '../ui';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Colors } from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { ActivityIndicator, ScrollView } from 'react-native';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { usePropertyStore } from '@/store/propertyStore';

const API_KEY = process.env.EXPO_PUBLIC_ANDROID_MAPS_API_KEY;

const categories = {
	Restaurants: 'restaurant',
	Schools: 'school',
	GasStations: 'gas_station',
	Churches: 'church',
};

type Place = {
	name: string;
	vicinity: string;
};

const fetchNearbyPlaces = async (
	latitude: number,
	longitude: number,
	type: string
): Promise<Place[]> => {
	const url = 'https://places.googleapis.com/v1/places:searchNearby';

	const body = {
		includedTypes: [type],
		maxResultCount: 10,
		locationRestriction: {
			circle: {
				center: {
					latitude,
					longitude,
				},
				radius: 2000, // meters
			},
		},
	};

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Goog-Api-Key': API_KEY!,
			'X-Goog-FieldMask': 'places.displayName,places.formattedAddress',
		},
		body: JSON.stringify(body),
	});

	const data = await response.json();
	if (!data.places) return [];

	return data.places.map((place: any) => ({
		name: place.displayName?.text,
		vicinity: place.formattedAddress,
	}));
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
	const [places, setPlaces] = useState<Place[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadPlaces = async () => {
			setLoading(true);
			const results = await fetchNearbyPlaces(latitude, longitude, type);
			setPlaces(results);
			setLoading(false);
		};
		loadPlaces();
	}, [latitude, longitude, type]);

	if (loading) {
		return (
			<View className="items-center justify-center mt-6">
				<ActivityIndicator size="small" />
			</View>
		);
	}

	if (!places.length) {
		return (
			<View className="items-center justify-center mt-6">
				<Text className="text-gray-500 text-sm">
					No places found in this category
				</Text>
			</View>
		);
	}

	return (
		<View className="flex-1 py-2">
			<ScrollView className="flex-1 bg-background-muted">
				{places.map((item) => (
					<View key={item.name} className="py-2 border-b border-outline">
						<Text className="font-medium">{item.name}</Text>
						<Text className="text-sm">{item.vicinity}</Text>
					</View>
				))}
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
		<View className="px-4 gap-4">
			<Heading>Nearby</Heading>
			<View>
				<TabView
					style={{ height: 600 }}
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
