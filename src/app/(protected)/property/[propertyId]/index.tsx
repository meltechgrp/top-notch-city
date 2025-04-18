import { Property } from '@/components/home/FoundProperties';
import {
	Button,
	ButtonText,
	Heading,
	ImageBackground,
	Pressable,
	Text,
	View,
} from '@/components/ui';
import { ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
	Bath,
	Bed,
	ChevronLeftIcon,
	ChevronRight,
	CircleParking,
	Edit,
	Flower2,
	Home,
	Map,
	MapPin,
	Share,
	WashingMachine,
} from 'lucide-react-native';
import { formatMoney } from '@/lib/utils';
import PropertyHeader from '@/components/property/PropertyHeader';
import FacilityItem from '@/components/property/FacilityItem';
import { hapticFeed } from '@/components/HapticTab';
import PropertyImages from '@/components/property/PropertyImages';
import BookPropertyIcon from '@/components/icons/BookPropertyIcon';
import WhatsappIcon from '@/components/icons/WhatsappIcon';

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
	return (
		<>
			<Stack.Screen
				options={{
					headerShown: true,
					headerTransparent: true,
					headerBackVisible: false,
					headerTitle: '',
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
						<View className=" flex-row items-center justify-center gap-1 py-1 px-2.5 rounded-full bg-primary-600 ">
							<Map size={18} color={'#fff'} />
							<Text className="text-2xl text-white">{1.8}</Text>
							<Text className=" text-white text-xl">km</Text>
						</View>
					),
				}}
			/>
			<StatusBar style={'light'} />
			<ScrollView
				keyboardShouldPersistTaps="handled"
				className=" relative pt-0">
				<PropertyHeader {...property} />
				<View className=" px-4 pt-4 gap-6 pb-20">
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
					<PropertyImages images={images} />
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
