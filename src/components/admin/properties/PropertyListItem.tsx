import { Icon, Text, View } from '@/components/ui';
import { Pressable } from 'react-native';
import { composeFullAddress, formatMoney } from '@/lib/utils';
import { Dot, MapPin } from 'lucide-react-native';
import PropertyCarousel from '@/components/property/PropertyCarousel';
import { useLayout } from '@react-native-community/hooks';
import { format } from 'date-fns';

type Props = {
	property: Property;
	onPress: (property: Props['property']) => void;
};

export default function PropertyListItem({ property, onPress }: Props) {
	const { width, onLayout } = useLayout();
	return (
		<>
			<Pressable
				onLayout={onLayout}
				onPress={() => onPress(property)}
				className={
					' items-center flex-1 bg-background-muted relative overflow-hidden rounded-xl'
				}>
				<PropertyCarousel
					images={property?.media_urls ?? []}
					width={width > 100 ? width - 5 : 340}
				/>
				<View className="flex-1 w-full p-4 gap-2">
					<Text size={'2xl'} className="text-white">
						{formatMoney(property.price, 'NGN', 0)}
					</Text>
					<View className=" w-full gap-2">
						<View className=" flex-row gap-1">
							{[
								{ name: 'beds', value: 4 },
								{ name: 'baths', value: 2 },
								{ name: 'sqft', value: 3300 },
							].map((item, i) => (
								<View key={item.name} className="flex-row gap-1">
									<View className="flex-row gap-1">
										<Text>{item.value}</Text>
										<Text>{item.name}</Text>
									</View>
									{i < 3 && <Icon as={Dot} size="sm" />}
								</View>
							))}
						</View>
						<View className="flex-row items-center gap-1">
							<Icon as={MapPin} className=" text-primary" />
							<Text size={'md'} className="text-white">
								{composeFullAddress(property.address)}
							</Text>
						</View>
						{/* {showFacilites && (
								<View className="flex-row flex-wrap gap-2">
									{facilites.map((item) => (
										<FacilityItem
											textClassname={cn(
												'text-white text-sm',
												columns && columns == 2 && 'hidden'
											)}
											{...item}
											key={item.name}
											// iconSize={16}
										/>
									))}
								</View>
							)} */}
					</View>
				</View>
			</Pressable>
		</>
	);
}
