import { Property } from '@/components/home/FoundProperties';
import { Box, Heading, Pressable, Text, View } from '@/components/ui';
import { ScrollView } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
	ChevronLeftIcon,
	ChevronRight,
	MapPin,
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
import {
	Accordion,
	AccordionItem,
	AccordionHeader,
	AccordionTrigger,
	AccordionTitleText,
	AccordionIcon,
	AccordionContent,
} from '@/components/ui/accordion';
import { Divider } from '@/components/ui/divider';
import { ChevronUpIcon, ChevronDownIcon, Icon } from '@/components/ui/icon';
import Map from '@/components/location/map';
import SimilarProperties from '@/components/property/SimilarProperties';

const data: Property[] = [
	{
		id: 'dhghg662389kndnc',
		name: 'Wings Tower',
		location: 'Emma Estate, Trans Amadi',
		price: 2500000,
		banner: require('@/assets/images/property/property6.png'),
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
		return data.find((item) => item.id === 'dhghg662389kndnc');
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
					headerTransparent: true,
					headerBackVisible: false,
					headerStyle: { backgroundColor: undefined },
					statusBarStyle: 'light',
					headerTitle: property.name,
					headerTitleStyle: { color: 'white', fontSize: 20 },
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
							<Text size="md">
								Lorem ipsum dolor sit amet consectetur. Eget metus nibh mattis
								elementum volutpat tortor. Felis molestie morbi purus risus.
								Etiam congue arcu est adipiscing lacinia tellus eu aliquam...
								Lorem ipsum dolor sit amet consectetur. Eget metus nibh mattis
								elementum volutpat tortor. Felis molestie morbi purus risus.
								Etiam congue arcu est adipiscing lacinia tellus eu aliquam...
							</Text>
						</View>
						<Accordion
							size="md"
							variant="unfilled"
							defaultValue={['a']}
							type="single"
							className=" ">
							<AccordionItem value="a">
								<AccordionHeader>
									<AccordionTrigger>
										{({ isExpanded }: { isExpanded: boolean }) => {
											return (
												<>
													<AccordionTitleText>Facilities</AccordionTitleText>
													{isExpanded ? (
														<AccordionIcon
															as={ChevronUpIcon}
															className="ml-3"
														/>
													) : (
														<AccordionIcon
															as={ChevronDownIcon}
															className="ml-3"
														/>
													)}
												</>
											);
										}}
									</AccordionTrigger>
								</AccordionHeader>
								<AccordionContent>
									<View className="flex-row flex-wrap gap-4">
										{facilites.map((item) => (
											<FacilityItem {...item} key={item.name} />
										))}
									</View>
								</AccordionContent>
							</AccordionItem>
							<Divider />
							<AccordionItem value="b">
								<AccordionHeader>
									<AccordionTrigger>
										{({ isExpanded }: { isExpanded: boolean }) => {
											return (
												<>
													<AccordionTitleText>Environment</AccordionTitleText>
													{isExpanded ? (
														<AccordionIcon
															as={ChevronUpIcon}
															className="ml-3"
														/>
													) : (
														<AccordionIcon
															as={ChevronDownIcon}
															className="ml-3"
														/>
													)}
												</>
											);
										}}
									</AccordionTrigger>
								</AccordionHeader>
								<AccordionContent>
									<View className="flex-row flex-wrap gap-4">
										{facilites.map((item) => (
											<FacilityItem {...item} key={item.name} />
										))}
									</View>
								</AccordionContent>
							</AccordionItem>
							<Divider />
							<AccordionItem value="c">
								<AccordionHeader>
									<AccordionTrigger>
										{({ isExpanded }: { isExpanded: boolean }) => {
											return (
												<>
													<AccordionTitleText>
														Essential Amenities
													</AccordionTitleText>
													{isExpanded ? (
														<AccordionIcon
															as={ChevronUpIcon}
															className="ml-3"
														/>
													) : (
														<AccordionIcon
															as={ChevronDownIcon}
															className="ml-3"
														/>
													)}
												</>
											);
										}}
									</AccordionTrigger>
								</AccordionHeader>
								<AccordionContent>
									<View className="flex-row flex-wrap gap-4">
										{facilites.map((item) => (
											<FacilityItem {...item} key={item.name} />
										))}
									</View>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
						<View className="px-4">
							<TabView
								style={{ height: 340 }}
								renderTabBar={(props) => <CustomTabBar2 {...props} />}
								navigationState={{ index, routes }}
								renderScene={SceneMap(renderScene)}
								onIndexChange={setIndex}
								initialLayout={{ width: Layout.window.width }}
							/>
						</View>
						<View className=" gap-4 px-4">
							<Pressable className="flex-row gap-4 bg-background-muted p-4 rounded-xl items-center justify-between">
								<BookPropertyIcon />
								<Text size="lg" className=" mr-auto">
									Book a visit
								</Text>
								<Icon as={ChevronRight} />
							</Pressable>
							<Pressable className="flex-row gap-4 bg-background-muted p-4 rounded-xl items-center justify-between">
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
								<Text>
									3 Unity St Abuloma, Port Harcourt 500101,Rivers 4.794181,
									7.038484
								</Text>
							</View>
							<View className="rounded-xl overflow-hidden">
								<Map height={Layout.window.height / 3} />
							</View>
						</View>
						<SimilarProperties />
					</View>
				</ScrollView>
			</Box>
		</>
	);
}
