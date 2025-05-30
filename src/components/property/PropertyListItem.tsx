import { cn } from '@/lib/utils';
import { formatMoney, toNaira } from '@/lib/utils';
import { router } from 'expo-router';
import { Pressable, useWindowDimensions, View } from 'react-native';
import { Property } from './PropertyHorizontalList';
import { ImageBackground, Text } from '../ui';
import { MapPin } from 'lucide-react-native';
import { hapticFeed } from '../HapticTab';
import FacilityItem from './FacilityItem';
import { useMemo } from 'react';

type Props = {
	data: Property;
	className?: string;
	showFacilites?: boolean;
	isMine?: boolean;
	columns?: number;
	isHorizantal?: boolean;
};
export default function PropertyListItem(props: Props) {
	const { width } = useWindowDimensions();
	const {
		data,
		className,
		showFacilites = false,
		isMine,
		columns,
		isHorizantal = false,
	} = props;
	const { banner, name, price, location, id } = data;

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
			name: 'Garden',
			icon: 'garden',
		},
	];
	const newWidth = useMemo(
		() =>
			columns
				? columns == 2
					? width / 2 - 22
					: width - 30
				: isHorizantal
					? width / 1.4
					: width - 30,
		[columns, width, isHorizantal]
	);
	const newHeight = useMemo(
		() => (columns ? (columns == 2 ? 240 : 300) : isHorizantal ? 200 : 300),
		[columns, isHorizantal]
	);
	return (
		<Pressable
			key={data.id}
			style={{
				width: newWidth,
				height: newHeight,
			}}
			className={cn('relative rounded-xl active:scale-[0.95]', className)}
			onPress={() => {
				hapticFeed();
				// if (isMine) {
				// 	router.push({
				// 		pathname: `/(protected)/(tabs)/home`,
				// 		params: {
				// 			propertyId: '',
				// 		},
				// 	});
				// } else {
				router.push({
					pathname: `/property/[propertyId]`,
					params: {
						propertyId: id,
					},
				});
				// }
			}}>
			<ImageBackground
				source={banner}
				alt="banner"
				className="flex-1 relative overflow-hidden rounded-xl">
				<View className="flex-1 bg-black/30 p-4">
					<View className="flex-1 items-end">
						<View className=" flex-row items-center justify-center gap-1 py-1 px-2.5 rounded-full bg-primary-500/60">
							<Text
								size={columns ? (columns == 2 ? 'md' : 'xl') : 'xl'}
								className="text-white">
								{formatMoney(price, 'NGN', 0)}
							</Text>
						</View>
					</View>
					<View className="pt-3 w-full gap-2">
						<Text
							size="2xl"
							className=" text-white font-bold"
							numberOfLines={1}>
							{name}
						</Text>
						<View className="flex-row items-center gap-1">
							<MapPin size={14} color={'#F8AA00'} />
							<Text
								size={columns ? (columns == 2 ? 'sm' : 'md') : 'md'}
								className="text-white">
								{location}
							</Text>
						</View>
						{showFacilites && (
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
						)}
					</View>
				</View>
			</ImageBackground>
		</Pressable>
	);
}
