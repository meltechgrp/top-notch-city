import { Box, Heading, Icon, Text, View } from '@/components/ui';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropertyHeader from '@/components/property/PropertyHeader';
import { useGetApiQuery } from '@/lib/api';
import { usePropertyStore } from '@/store/propertyStore';
import PropertyDetailsBottomSheet from '@/components/property/PropertyDetailsBottomSheet';
import PropertyCarousel from '@/components/property/PropertyCarousel';
import { useLayout } from '@react-native-community/hooks';
import FullHeightLoaderWrapper from '@/components/loaders/FullHeightLoaderWrapper';
import headerLeft from '@/components/shared/headerLeft';
import { composeFullAddress, formatMoney } from '@/lib/utils';
import { MapPin } from 'lucide-react-native';

export default function PropertyItem() {
	const { propertyId } = useLocalSearchParams() as { propertyId: string };
	const { updateProperty } = usePropertyStore();
	const { data, loading } = useGetApiQuery<Property>(
		`/properties/${propertyId}`,
		{},
		`pro_${propertyId}`
	);
	const [detailsBottomSheet, setDetailsBotttomSheet] = useState(true);
	const property = useMemo(() => {
		return data?.id ? data : null;
	}, [propertyId, data]);
	useEffect(() => {
		if (property) {
			updateProperty(property);
		}
	}, [property]);
	const { width, onLayout } = useLayout();
	return (
		<>
			<Stack.Screen
				options={{
					headerShown: true,
					headerTransparent: true,
					headerStyle: {
						backgroundColor: 'transparent',
					},
					headerTitle: '',
					headerLeft: headerLeft(),
					headerRight: () => <PropertyHeader {...(property as any)} />,
				}}
			/>
			<FullHeightLoaderWrapper loading={loading}>
				<Box onLayout={onLayout} className="flex-1 relative">
					{property && (
						<View className="flex-1">
							<PropertyCarousel
								width={width || 400}
								factor={1.15}
								withBackdrop={true}
								images={property.media_urls}
								pointerPosition={60}
							/>
							<View className=" absolute top-[32%] left-4 w-full">
								<View className="gap-2">
									<Heading size="xl" className="">
										{property.title}
									</Heading>
									<View className="self-start bg-primary p-2 rounded-xl">
										<Text size="lg" className="">
											{formatMoney(property.price, 'NGN', 0)}
										</Text>
									</View>
									<View className="flex-row items-center mt-1 gap-2">
										<Icon size="md" as={MapPin} className="text-primary" />
										<Text size="md">
											{composeFullAddress(property?.address, true)}
										</Text>
									</View>
								</View>
							</View>
							<PropertyDetailsBottomSheet
								visible={detailsBottomSheet}
								onDismiss={() => setDetailsBotttomSheet(false)}
								property={property}
							/>
						</View>
					)}
				</Box>
			</FullHeightLoaderWrapper>
		</>
	);
}
