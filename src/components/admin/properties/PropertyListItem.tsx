import { ImageBackground, Text, View } from '@/components/ui';
import SwipeableWrapper from '@/components/shared/SwipeableWrapper';
import { Pressable } from 'react-native';
import { getImageUrl } from '@/lib/api';
import { formatMoney } from '@/lib/utils';
import { MapPin } from 'lucide-react-native';

type Props = {
	property: Property;
	onPress: (property: Props['property']) => void;
};

export default function PropertyListItem({ property, onPress }: Props) {
	console.log(property.media_urls);
	return (
		<>
			{/* <SwipeableWrapper rightAction={() => {}} leftAction={() => {}}> */}
			<Pressable
				onPress={() => onPress(property)}
				className={
					'flex-row items-center px-4 py-3 bg-background-muted rounded-xl'
				}>
				<ImageBackground
					source={getImageUrl(property.media_urls[0])}
					alt="banner"
					className="flex-1 relative overflow-hidden rounded-xl">
					<View className="flex-1 bg-black/30 p-4">
						<View className="flex-1 items-end">
							<View className=" flex-row items-center justify-center gap-1 py-1 px-2.5 rounded-full bg-primary-500/60">
								<Text size={'xl'} className="text-white">
									{formatMoney(property.price, 'NGN', 0)}
								</Text>
							</View>
						</View>
						<View className="pt-3 w-full gap-2">
							<Text
								size="2xl"
								className=" text-white font-bold"
								numberOfLines={1}>
								{property.title}
							</Text>
							<View className="flex-row items-center gap-1">
								<MapPin size={14} color={'#F8AA00'} />
								<Text size={'md'} className="text-white">
									A lot
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
				</ImageBackground>
			</Pressable>
			{/* </SwipeableWrapper> */}
		</>
	);
}
