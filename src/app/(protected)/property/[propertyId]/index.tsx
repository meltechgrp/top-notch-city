import { Box } from '@/components/ui';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import PropertyHeader from '@/components/property/PropertyHeader';
import { useGetApiQuery } from '@/lib/api';
import { usePropertyStore } from '@/store/propertyStore';
import PropertyDetailsBottomSheet from '@/components/property/PropertyDetailsBottomSheet';
import PropertyCarousel from '@/components/property/PropertyCarousel';
import { useLayout } from '@react-native-community/hooks';

export default function PropertyItem() {
	const { propertyId } = useLocalSearchParams() as { propertyId: string };
	const { updateProperty } = usePropertyStore();
	const { data, loading } = useGetApiQuery<Property>(
		`/properties/${propertyId}`
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
	if (!property) return null;
	return (
		<>
			<Box onLayout={onLayout} className="flex-1">
				<PropertyHeader {...property} />
				<PropertyCarousel
					width={width || 400}
					factor={1}
					withBackdrop={true}
					images={property.media_urls}
					pointerPosition={60}
				/>
				<PropertyDetailsBottomSheet
					visible={detailsBottomSheet}
					onDismiss={() => setDetailsBotttomSheet(false)}
					property={property}
				/>
			</Box>
		</>
	);
}
