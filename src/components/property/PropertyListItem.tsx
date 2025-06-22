import { cn, composeFullAddress } from '@/lib/utils';
import { formatMoney } from '@/lib/utils';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Icon, Text, Pressable } from '../ui';
import { Bath, Bed, MapPin } from 'lucide-react-native';
import { useMemo } from 'react';
import { Colors } from '@/constants/Colors';
import Layout from '@/constants/Layout';
import PropertyCarousel from './PropertyCarousel';
import { useLayout } from '@react-native-community/hooks';
import { PropertyStatus } from './PropertyStatus';
import { PropertyLikeButton } from './PropertyLikeButton';
import { PropertyInteractions } from './PropertyInteractions';

type Props = {
	data: Property;
	className?: string;
	showFacilites?: boolean;
	profileId?: string;
	isAdmin?: boolean;
	columns?: number;
	isHorizontal?: boolean;
	style?: StyleProp<ViewStyle>;
	onPress: (data: Props['data']) => void;
};
export default function PropertyListItem(props: Props) {
	const {
		data,
		className,
		showFacilites = false,
		profileId,
		columns,
		isHorizontal = false,
		style,
		onPress,
		isAdmin,
	} = props;
	const { bannerHeight } = Layout;
	const { id, title, price, media, address, interaction, status, owner } = data;
	const { width, onLayout } = useLayout();
	const images = useMemo(
		() => media?.filter((item) => item.media_type == 'IMAGE') ?? [],
		[media]
	);

	const isMine = useMemo(() => profileId === owner?.id, [profileId, owner]);
	const Actions = () => {
		if (isAdmin || isMine) {
			return <PropertyStatus status={status} />;
		} else {
			return <PropertyLikeButton property={props.data} />;
		}
	};

	const Find = (item: string) =>
		data.amenities?.find((a) => a.name == item)?.value || 0;
	return (
		<Pressable
			onLayout={onLayout}
			key={data.id}
			onPress={() => onPress(data)}
			style={[{ height: bannerHeight }, style]}
			className={cn('relative flex-1 rounded-xl', className)}>
			<PropertyCarousel
				width={width || 300}
				withBackdrop={true}
				loop={true}
				media={images.slice(0, 5)}
				pointerPosition={7}
			/>
			<View className=" absolute top-0 w-full h-full justify-between">
				<View
					className={cn(
						' flex-row p-4 pb-0 bg-black/5 items-start justify-between'
					)}>
					<Actions />
					<View className="flex-row items-center justify-center gap-1 py-1.5 px-2.5 rounded-3xl bg-primary/60">
						<Text
							size={columns ? (columns == 2 ? 'md' : 'xl') : 'xl'}
							className="text-white">
							{formatMoney(price, 'NGN', 0)}
						</Text>
					</View>
				</View>
				<View
					className={cn(
						'flex-row pb-5 px-4 bg-black/5 justify-between items-end',
						!address && 'pb-6'
					)}>
					<View className="flex-1   gap-1">
						<Text
							size={columns ? (columns == 2 ? 'lg' : '2xl') : '2xl'}
							className={cn(' text-white font-bold')}
							numberOfLines={1}>
							{title}
						</Text>
						{address && (
							<View className="flex-row items-center gap-1">
								<Icon as={MapPin} size="sm" color={Colors.primary} />
								<Text
									size={columns ? (columns == 2 ? 'xs' : 'md') : 'md'}
									className="text-white">
									{composeFullAddress(address, true)}
								</Text>
							</View>
						)}
						{showFacilites && (
							<View className="flex-row gap-4">
								<View className="flex-row items-center gap-1">
									<Icon as={Bed} size={'sm'} className="text-primary" />
									<Text className="text-sm">{Find('Bedroom')}</Text>
								</View>
								<View className="flex-row items-center gap-1">
									<Icon as={Bath} size={'sm'} className="text-primary" />
									<Text className=" text-sm">{Find('Bathroom')}</Text>
								</View>
							</View>
						)}
					</View>
					{interaction && (
						<PropertyInteractions
							interaction={interaction}
							className="w-[15%] gap-2 pr-0"
						/>
					)}
				</View>
			</View>
		</Pressable>
	);
}
