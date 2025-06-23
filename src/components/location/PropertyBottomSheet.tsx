import BottomSheet from '@/components/shared/BottomSheet';
import * as React from 'react';
import { View } from 'react-native';
import PropertyListItem from '../property/PropertyListItem';
import { router } from 'expo-router';

type Props = {
	onDismiss: () => void;
	visible: boolean;
	data: Property;
};
export default function PropertyBottomSheet(props: Props) {
	const { visible, onDismiss, data } = props;
	return (
		<BottomSheet visible={visible} onDismiss={onDismiss} plain snapPoint="35%">
			<View className=" p-4 flex-1">
				<PropertyListItem
					data={data}
					showFacilites
					profileId=""
					onPress={() => {
						router.push({
							pathname: '/(protected)/property/[propertyId]',
							params: {
								propertyId: data.id,
							},
						});
						onDismiss();
					}}
				/>
			</View>
		</BottomSheet>
	);
}
