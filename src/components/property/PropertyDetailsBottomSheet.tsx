import { BodyScrollView } from '@/components/layouts/BodyScrollView';
import { Box, Heading, Icon, Pressable, Text, View } from '@/components/ui';
import BookPropertyIcon from '@/components/icons/BookPropertyIcon';
import WhatsappIcon from '@/components/icons/WhatsappIcon';
import Layout from '@/constants/Layout';
import { ChevronRight, Heart, MapPin, Share2 } from 'lucide-react-native';
import FacilityItem from '@/components/property/FacilityItem';
import CustomTabBar2 from '@/components/layouts/CustomTopBar2';
import Map from '@/components/location/map';
import { composeFullAddress, formatMoney } from '@/lib/utils';
import SimilarProperties from '@/components/property/SimilarProperties';
import CustomTabBar3 from '@/components/layouts/CustomTopBar3';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { useGetApiQuery } from '@/lib/api';
import PropertyImages from '@/components/property/PropertyImages';
import BottomSheet from '../shared/BottomSheet';

type Props = {
	visible: boolean;
	onDismiss: () => void;
	property: Property;
};

export default function PropertyDetailsBottomSheet(props: Props) {
	const { visible, onDismiss, property } = props;
	const router = useRouter();
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
	// const RenderScene = {
	// 	images: () => <PropertyImages images={images} />,
	// 	video: () => (
	// 		<View className="flex-1 items-center h-[20rem] justify-center">
	// 			<Text size="xl">Video Coming Soon</Text>
	// 		</View>
	// 	),
	// 	view: () => <Property3DView id={propertyId} image={null} />,
	// };
	const routes = [
		{ key: 'images', title: 'Pictures' },
		{ key: 'video', title: 'Videos' },
		{ key: 'view', title: '3D View' },
	];
	return (
		<BottomSheet
			withHeader={false}
			withBackButton={false}
			snapPoint={['60%', '100%']}
			backdropVariant={undefined}
			enableClose={false}
			visible={visible}
			onDismiss={onDismiss}>
			<Box className=" flex-1">
				<View className="gap-2 flex-1 p-4 py-8 justify-end">
					<Text size="3xl" className="">
						{property.title}
					</Text>
					<View className=" bg-primary self-start rounded-2xl p-1 px-4">
						<Text size="2xl" className="">
							{formatMoney(property.price, 'NGN', 0)}
						</Text>
					</View>
					<View className=" flex-row items-center gap-2">
						<Icon as={MapPin} className="text-primary" />
						<Text size="xl" className=" ">
							{composeFullAddress(property.address)}
						</Text>
					</View>
				</View>
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
					{/* <CustomTabBar3
            setCurrent={setCurrent}
            routes={routes}
            current={current}>
            {RenderScene[current as keyof typeof RenderScene]()}
          </CustomTabBar3> */}
					<View className=" gap-4 px-4">
						<Pressable className="flex-row gap-4 bg-background-muted p-4 rounded-xl items-center justify-between">
							<BookPropertyIcon />
							<Text size="lg" className=" mr-auto">
								Book a visit
							</Text>
							<Icon as={ChevronRight} />
						</Pressable>
						<Pressable
							onPress={() =>
								router.push({
									pathname: '/(protected)/property/[propertyId]/booking',
									params: {
										propertyId: property.id,
									},
								})
							}
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
			</Box>
		</BottomSheet>
	);
}
