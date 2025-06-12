import { cn, composeFullAddress, showSnackbar } from '@/lib/utils';
import { formatMoney } from '@/lib/utils';
import { router } from 'expo-router';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { Icon, Text } from '../ui';
import { Heart, MapPin } from 'lucide-react-native';
import { hapticFeed } from '../HapticTab';
import { useEffect, useMemo } from 'react';
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
	} = props;
	const { bannerHeight } = Layout;
	const { id, title, price, media_urls, address, interaction } = data;
	const { width, onLayout } = useLayout();
	const images = useMemo(
		() => media_urls?.filter((item) => item.endsWith('jpg')) ?? [],
		[media_urls]
	);

	const client = useQueryClient();
	const { mutate, isSuccess } = useMutation({
		mutationFn: () => likeProperty({ id }),
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ['properties'] });
		},
	});

	useEffect(() => {
		if (isSuccess) {
			showSnackbar({
				message: 'Like successfully',
				type: 'success',
			});
		}
	}, [isSuccess]);
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
				router.push({
					pathname: `/property/[propertyId]`,
					params: {
						propertyId: id,
					},
				});
			}}>
			<PropertyCarousel
				width={width || 300}
				withBackdrop={true}
				loop={true}
				images={images.slice(0, 5)}
				pointerPosition={20}
			/>
			<View className=" absolute top-0 w-full h-full p-4">
				<View className="flex-1 flex-row items-start justify-between">
					<Pressable onPress={hnadleLike} style={{ padding: 8 }}>
						<Icon
							as={Heart}
							className={cn(
								' text-white w-7 h-7',
								interaction?.liked ? 'text-primary' : 'text-white'
							)}
						/>
					</Pressable>
					<View className="flex-row items-center justify-center gap-1 py-1.5 px-2.5 rounded-3xl bg-primary/60">
						<Text
							size={columns ? (columns == 2 ? 'md' : 'xl') : 'xl'}
							className="text-white">
							{formatMoney(price, 'NGN', 0)}
						</Text>
					</View>
				</View>
				<View className="pb-5 w-full gap-1">
					<Text
						size={columns ? (columns == 2 ? 'lg' : '2xl') : '2xl'}
						className={cn(' text-white font-bold')}
						numberOfLines={1}>
						{title}
					</Text>
					<View className="flex-row items-center gap-1">
						<Icon as={MapPin} size="sm" color={Colors.primary} />
						<Text
							size={columns ? (columns == 2 ? 'xs' : 'md') : 'md'}
							className="text-white">
							{composeFullAddress(address, true)}
						</Text>
					</View>
				</View>
			</View>
		</Pressable>
	);
}
