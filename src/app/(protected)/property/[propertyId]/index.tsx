import { Box, Heading, Icon, Text, View } from '@/components/ui';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import PropertyHeader from '@/components/property/PropertyHeader';
import { useGetApiQuery } from '@/lib/api';
import { usePropertyStore } from '@/store/propertyStore';
import PropertyDetailsBottomSheet from '@/components/property/PropertyDetailsBottomSheet';
import PropertyCarousel from '@/components/property/PropertyCarousel';
import { useLayout } from '@react-native-community/hooks';
import FullHeightLoaderWrapper from '@/components/loaders/FullHeightLoaderWrapper';
import { composeFullAddress, formatMoney } from '@/lib/utils';
import { MapPin } from 'lucide-react-native';

export default function PropertyItem() {
	const { propertyId } = useLocalSearchParams() as { propertyId: string };
	const { updateProperty } = usePropertyStore();
	const [sheetKey, setSheetKey] = useState(Date.now());
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
	useFocusEffect(
		React.useCallback(() => {
			setSheetKey(Date.now());
			setDetailsBotttomSheet(true); // open it on screen focus
			return () => {
				setDetailsBotttomSheet(false); // close on blur/unmount
			};
		}, [])
	);
	return (
		<>
			<FullHeightLoaderWrapper loading={loading}>
				<Box onLayout={onLayout} className="flex-1 relative">
					{property && (
						<View className="flex-1">
							<PropertyHeader
								setDetailsBotttomSheet={setDetailsBotttomSheet}
								{...(property as any)}
							/>
							<PropertyCarousel
								width={width || 400}
								factor={1.15}
								withBackdrop={true}
								loop={false}
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
							{detailsBottomSheet && (
								<PropertyDetailsBottomSheet
									visible={detailsBottomSheet}
									onDismiss={() => setDetailsBotttomSheet(false)}
									property={property}
									sheetKey={sheetKey}
								/>
							)}
						</View>
					)}
				</Box>
			</FullHeightLoaderWrapper>
		</>
	);
}
