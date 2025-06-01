import { Box, Heading, Pressable, Text, View } from '@/components/ui';
import { ScrollView } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ChevronRight, Heart, MapPin, Share2 } from 'lucide-react-native';
import PropertyHeader from '@/components/property/PropertyHeader';
import FacilityItem from '@/components/property/FacilityItem';
import { hapticFeed } from '@/components/HapticTab';
import PropertyImages from '@/components/property/PropertyImages';
import BookPropertyIcon from '@/components/icons/BookPropertyIcon';
import WhatsappIcon from '@/components/icons/WhatsappIcon';
import Layout from '@/constants/Layout';
import CustomTabBar2 from '@/components/layouts/CustomTopBar2';
import Property3DView from '@/components/property/Property3dView';
import { Icon } from '@/components/ui/icon';
import Map from '@/components/location/map';
import SimilarProperties from '@/components/property/SimilarProperties';
import CustomTabBar3 from '@/components/layouts/CustomTopBar3';
import { useGetApiQuery } from '@/lib/api';
import { composeFullAddress } from '@/lib/utils';

export default function PropertyItem() {
	const router = useRouter();
	const [current, setCurrent] = React.useState('images');
	const { propertyId } = useLocalSearchParams() as { propertyId: string };
	const { data, loading, error, refetch } = useGetApiQuery<Property>(
		`/properties/${propertyId}`
	);
	const property = useMemo(() => {
		return data?.id ? data : null;
	}, [propertyId, data]);

	if (!property) return null;
	const images = [
		{
			path: require('@/assets/images/property/img1.png'),
		},
		{
			path: require('@/assets/images/property/img2.png'),
		},
		{
			path: require('@/assets/images/property/img3.png'),
		},
		{
			path: require('@/assets/images/property/img4.png'),
		},
		{
			path: require('@/assets/images/property/img5.png'),
		},
		{
			path: require('@/assets/images/property/img6.png'),
		},
	];
	const RenderScene = {
		images: () => <PropertyImages images={images} />,
		video: () => (
			<View className="flex-1 items-center h-[20rem] justify-center">
				<Text size="xl">Video Coming Soon</Text>
			</View>
		),
		view: () => <Property3DView id={propertyId} image={null} />,
	};
	const routes = [
		{ key: 'images', title: 'Pictures' },
		{ key: 'video', title: 'Videos' },
		{ key: 'view', title: '3D View' },
	];
	return (
		<>
			<Stack.Screen
				options={{
					headerShown: true,
					headerTransparent: true,
					headerBackVisible: false,
					headerStyle: { backgroundColor: undefined },
					statusBarStyle: 'light',
					headerTitle: '',
					headerTitleStyle: { color: 'white', fontSize: 20 },
					headerRight: () => (
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
							}}
							className="mr-4">
							<Pressable
								onPress={() => {
									hapticFeed();
									router.push({
										pathname: '/property/[propertyId]/share',
										params: { propertyId, name: property?.title },
									});
								}}
								style={{ padding: 8 }}>
								<Icon as={Share2} className=" text-white w-7 h-7" />
							</Pressable>
							<Pressable onPress={() => {}} style={{ padding: 8 }}>
								<Icon as={Heart} className=" text-white w-7 h-7" />
							</Pressable>
						</View>
					),
				}}
			/>
			<Box className="flex-1">
				<ScrollView
					keyboardShouldPersistTaps="handled"
					className=" relative pt-0 flex-1">
					<PropertyHeader {...property} />
					<View className=" pt-4 flex-1 gap-6 pb-20">
						<View className="gap-2 px-4">
							<Heading size="lg">Description</Heading>
							<Text size="md">{property?.description}</Text>
						</View>
						<View className="flex-row gap-4 flex-wrap px-4">
							{property.amenities?.map((item) => (
								<FacilityItem {...item} key={item.name} />
							))}
						</View>
						<CustomTabBar3
							setCurrent={setCurrent}
							routes={routes}
							current={current}>
							{RenderScene[current as keyof typeof RenderScene]()}
						</CustomTabBar3>
						<View className=" gap-4 px-4">
							<Pressable className="flex-row gap-4 bg-background-muted p-4 rounded-xl items-center justify-between">
								<BookPropertyIcon />
								<Text size="lg" className=" mr-auto">
									Book a visit
								</Text>
								<Icon as={ChevronRight} />
							</Pressable>
							<Pressable
								onPress={() => router.push('/message')}
								className="flex-row gap-4 bg-background-muted p-4 rounded-xl items-center justify-between">
								<WhatsappIcon />
								<Text size="lg" className=" mr-auto">
									Chat with Realtor
								</Text>
								<Icon as={ChevronRight} />
							</Pressable>
						</View>
						<View className="gap-2 px-4">
							<Heading>Properties Address</Heading>
							<View className="flex-row items-center gap-2">
								<MapPin size={18} color={'#F8AA00'} />
								<Text>{composeFullAddress(property?.address)}</Text>
							</View>
							<View className="rounded-xl overflow-hidden">
								<Map height={Layout.window.height / 3} scrollEnabled={false} />
							</View>
						</View>
						{/* <SimilarProperties /> */}
					</View>
				</ScrollView>
			</Box>
		</>
	);
}
