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
		<BottomSheet
			visible={visible}
			onDismiss={onDismiss}
			addBackground={false}
			backdropVariant="xs"
			plain
			contentClassName="bg-transparent"
			snapPoint="32%">
			<View className=" gap-2 p-2 flex-1">
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
