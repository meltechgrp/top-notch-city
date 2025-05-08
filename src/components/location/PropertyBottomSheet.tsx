import BottomSheet from '@/components/shared/BottomSheet';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Button, ButtonText, Card, Heading, Icon, Image, Text } from '../ui';
import { formatMoney } from '@/lib/utils';
import { MapPin } from 'lucide-react-native';
import FacilityItem from '../property/FacilityItem';
import { Colors } from '@/constants/Colors';
import { MarkerData } from './map';

type Props = {
	onDismiss: () => void;
	visible: boolean;
	data: MarkerData;
	onContinue: () => void;
};
export default function PropertyBottomSheet(props: Props) {
	const { visible, onDismiss, data, onContinue } = props;

	const facilites = [
		{
			name: '6 Bedroom',
			icon: 'bedroom',
		},
		{
			name: '4 Bathroom',
			icon: 'bathroom',
		},
		{
			name: 'Parking Area',
			icon: 'parking',
		},
	];
	return (
		<BottomSheet
			visible={visible}
			onDismiss={onDismiss}
			addBackground={false}
			backdropVariant="xs"
			plain
			contentClassName="bg-transparent"
			snapPoint="35%">
			<View className=" gap-2 p-2 flex-1">
				<View className=" flex-row w-full gap-2">
					<View className="flex-1">
						<Image
							source={data.image}
							alt="Property Image"
							className="rounded-xl w-full object-cover h-52"
						/>
					</View>
					<View className="w-[60%]">
						<Card className=" rounded-xl gap-1">
							<Heading size="lg">{data.name}</Heading>
							<View className="flex-row items-center gap-2">
								<Text size="sm" className=" text-typography/70">
									Property type:
								</Text>
								<Text size="sm" className=" font-medium ">
									Duplex
								</Text>
							</View>
							<View className="my-1">
								<ScrollView
									horizontal={true}
									className="gap-4"
									showsHorizontalScrollIndicator={false}>
									{facilites.map((item) => (
										<FacilityItem {...item} key={item.name} className="mr-2" />
									))}
								</ScrollView>
							</View>
							<Text size="xl">{formatMoney(20540000, 'NGN', 0)}</Text>
							<Button onPress={onContinue} className=" bg-primary mt-2">
								<ButtonText>View Property</ButtonText>
							</Button>
						</Card>
					</View>
				</View>
				<View className="w-full">
					<Card className="gap-4 rounded-xl w-full">
						<Text size="xl" className="font-light">
							Property Address
						</Text>
						<View className="flex-row gap-2 items-center">
							<Icon as={MapPin} color={Colors.primary} />
							<Text size="sm" className=" text-typography/80">
								3 Unity St Abuloma, Port Harcourt 500101, Rivers
							</Text>
						</View>
					</Card>
				</View>
			</View>
		</BottomSheet>
	);
}
