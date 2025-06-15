import { cn, composeFullAddress } from '@/lib/utils';
import { formatMoney } from '@/lib/utils';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Icon, Text, Pressable } from '../ui';
import { Eye, Heart, MapPin } from 'lucide-react-native';
import { hapticFeed } from '../HapticTab';
import { useMemo } from 'react';
import { Colors } from '@/constants/Colors';
import Layout from '@/constants/Layout';
import PropertyCarousel from './PropertyCarousel';
import { useLayout } from '@react-native-community/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likeProperty } from '@/actions/property';

type Props = {
	data: Property;
	className?: string;
	showFacilites?: boolean;
	isMine?: boolean;
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
		isMine,
		columns,
		isHorizontal = false,
		style,
		onPress,
	} = props;
	const { bannerHeight } = Layout;
	const {
		id,
		title,
		price,
		media_urls,
		address,
		interaction,
		owner_interaction,
	} = data;
	const { width, onLayout } = useLayout();
	const images = useMemo(
		() => media_urls?.filter((item) => item.endsWith('.jpg')) ?? [],
		[media_urls]
	);

	const client = useQueryClient();
	const { mutate, isSuccess } = useMutation({
		mutationFn: () => likeProperty({ id }),
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ['properties'] });
		},
	});

	function hnadleLike() {
		mutate();
	}
	return (
		<Pressable
			onLayout={onLayout}
			key={data.id}
			style={[{ height: bannerHeight }, style]}
			className={cn('relative flex-1 rounded-xl', className)}
			onPress={() => {
				hapticFeed(true);
				onPress(data);
			}}>
			<PropertyCarousel
				width={width || 300}
				withBackdrop={true}
				loop={true}
				media={images.slice(0, 5)}
				pointerPosition={20}
			/>
			<View className=" absolute top-0 w-full h-full justify-between">
				<View
					className={cn(
						' flex-row p-4 pb-0 bg-black/5 items-start justify-between',
						!owner_interaction && 'justify-end'
					)}>
					{owner_interaction && (
						<Pressable
							className="flex-row gap-1 items-center"
							onPress={hnadleLike}
							style={{ padding: 8 }}>
							<Icon
								as={Heart}
								className={cn(
									' text-white w-6 h-6',
									owner_interaction?.liked ? 'text-primary' : 'text-white'
								)}
							/>
							<Text className="text-white font-bold">{interaction?.liked}</Text>
						</Pressable>
					)}
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
						'pb-5 px-4 w-full bg-black/5  gap-1',
						!address && 'pb-8'
					)}>
					<Text
						size={columns ? (columns == 2 ? 'lg' : '2xl') : '2xl'}
						className={cn(' text-white font-bold')}
						numberOfLines={1}>
						{title}
					</Text>
					<View className="flex-row justify-between items-center">
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
						{interaction && (
							<View className="flex-row items-center gap-1">
								<Icon as={Eye} size="md" color={'white'} />
								<Text size={'md'} className="text-white">
									{interaction?.viewed}
								</Text>
							</View>
						)}
					</View>
				</View>
			</View>
		</Pressable>
	);
}
