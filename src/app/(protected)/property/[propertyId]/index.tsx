import { Property } from '@/components/home/FoundProperties';
import { Heading, Pressable, Text, View } from '@/components/ui';
import { ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
	ChevronLeftIcon,
	ChevronRight,
	Edit,
	Map,
	Plus,
	Share2,
} from 'lucide-react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import PropertyHeader from '@/components/property/PropertyHeader';
import FacilityItem from '@/components/property/FacilityItem';
import { hapticFeed } from '@/components/HapticTab';
import PropertyImages from '@/components/property/PropertyImages';
import BookPropertyIcon from '@/components/icons/BookPropertyIcon';
import WhatsappIcon from '@/components/icons/WhatsappIcon';
import Layout from '@/constants/Layout';
import CustomTabBar2 from '@/components/layouts/CustomTopBar2';
import Property3DView from '@/components/property/Property3dView';

const data: Property[] = [
	{
		id: 'dhghg662389kndnc',
		name: 'Babylon House',
		location: 'Emma Estate, Slaughter',
		price: 2500000,
		banner: require('@/assets/images/property/property1.png'),
		images: [],
	},
	{
		id: 'dhghg6623ds66skndnc',
		name: 'Topaz Villa',
		location: 'Emma Estate, Slaughter',
		price: 1500000,
		banner: require('@/assets/images/property/property2.png'),
		images: [],
	},
	{
		id: 'dhgdsbj332389kndnc',
		name: 'Great House',
		location: 'Green Estate, Rumuomasi',
		price: 2000000,
		banner: require('@/assets/images/property/property1.png'),
		images: [],
	},
];

export default function PropertyItem() {
	const router = useRouter();
	const [index, setIndex] = React.useState(0);
	const { propertyId } = useLocalSearchParams() as { propertyId: string };
	const property = useMemo(() => {
		return data.find((item) => item.id === propertyId);
	}, [propertyId]);

	if (!property) return null;
	const facilites = [
		{
			name: '6 Bedroom',
			icon: 'bedroom',
		},
		{
			name: 'Home Office',
			icon: 'home',
		},
		{
			name: 'Parking Area',
			icon: 'parking',
		},
		{
			name: '4 Bathroom',
			icon: 'bathroom',
		},
		{
			name: 'Laundry Room',
			icon: 'laundry',
		},
		{
			name: 'Garden',
			icon: 'garden',
		},
	];
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
	const renderScene = {
		images: () => <PropertyImages images={images} />,
		video: () => (
			<View className="flex-1 items-center h-[20rem] justify-center">
				<Text size="xl">Video Coming Soon</Text>
			</View>
		),
		view: () => <Property3DView id={propertyId} image={images[0]} />,
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
					...(process.env.EXPO_OS !== 'ios'
						? {}
						: {
								headerLargeTitle: true,
								headerTransparent: true,
								headerBlurEffect: 'systemChromeMaterial',
								headerLargeTitleShadowVisible: false,
								headerShadowVisible: true,
								headerLargeStyle: {
									// NEW: Make the large title transparent to match the background.
									backgroundColor: 'transparent',
								},
							}),
					headerTransparent: true,
					headerBackVisible: false,
					headerTitle: property.name,
					headerTitleStyle: { color: 'white' },
					headerLeft: () => (
						<Pressable
							onPress={() => {
								hapticFeed();
								if (router.canGoBack()) router.back();
								else router.push('/home');
							}}
							className="p-2 bg-black/20 rounded-full flex-row items-center ">
							<ChevronLeftIcon size={26} strokeWidth={3} color={'white'} />
						</Pressable>
					),
					headerRight: () => (
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
							}}>
							<Pressable
								onPress={() => {
									hapticFeed();
									router.push({
										pathname: '/property/[propertyId]/share',
										params: { propertyId, name: property.name },
									});
								}}
								style={{ padding: 8 }}>
								<Share2 color={'orange'} />
							</Pressable>
							<Pressable
								onPress={() => {
									hapticFeed();
									router.push({
										pathname: '/property/[propertyId]/share',
										params: { propertyId },
									});
								}}
								style={{ padding: 8 }}>
								<Edit color={'orange'} />
							</Pressable>
							<Pressable
								onPress={() => {
									hapticFeed();
									router.push({
										pathname: '/property/[propertyId]/share',
										params: { propertyId },
									});
								}}
								style={{ paddingLeft: 8 }}>
								<Plus color={'orange'} />
							</Pressable>
						</View>
					),
				}}
			/>
			<ScrollView
				keyboardShouldPersistTaps="handled"
				className=" relative pt-0 flex-1">
				<PropertyHeader {...property} />
				<View className=" px-4 pt-4 flex-1 gap-6 pb-20">
					<View className="gap-2">
						<Heading size="lg">Description</Heading>
						<Text className="text-sm">
							Lorem ipsum dolor sit amet consectetur. Eget metus nibh mattis
							elementum volutpat tortor. Felis molestie morbi purus risus. Etiam
							congue arcu est adipiscing lacinia tellus eu aliquam... Lorem
							ipsum dolor sit amet consectetur. Eget metus nibh mattis elementum
							volutpat tortor. Felis molestie morbi purus risus. Etiam congue
							arcu est adipiscing lacinia tellus eu aliquam...
						</Text>
					</View>
					<View className="gap-4">
						<Heading size="lg">Facilities</Heading>
						<View className="flex-row justify-between flex-wrap gap-4">
							{facilites.map((item) => (
								<FacilityItem {...item} key={item.name} />
							))}
						</View>
					</View>
					<TabView
						style={{ height: 340 }}
						renderTabBar={(props) => <CustomTabBar2 {...props} />}
						navigationState={{ index, routes }}
						renderScene={SceneMap(renderScene)}
						onIndexChange={setIndex}
						initialLayout={{ width: Layout.window.width }}
					/>
					<View className=" gap-4">
						<Pressable className="flex-row gap-4 bg-white p-4 rounded-xl items-center justify-between">
							<BookPropertyIcon />
							<Text size="lg" className=" mr-auto">
								Book a visit
							</Text>
							<ChevronRight color={'black'} />
						</Pressable>
						<Pressable className="flex-row gap-4 bg-white p-4 rounded-xl items-center justify-between">
							<WhatsappIcon />
							<Text size="lg" className=" mr-auto">
								Chat with Realtor
							</Text>
							<ChevronRight color={'black'} />
						</Pressable>
					</View>
				</View>
			</ScrollView>
		</>
	);
}
