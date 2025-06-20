import withRenderVisible from '@/components/shared/withRenderOpen';
import { View } from 'react-native';
import BottomSheet from '../shared/BottomSheet';
import { Button, ButtonText, Text } from '../ui';
import { SpinningLoader } from '../loaders/SpinningLoader';
import { showSnackbar } from '@/lib/utils';
import { useState } from 'react';
import { z } from 'zod';
import { usePropertyDataMutations } from '@/tanstack/mutations/usePropertyDataMutations';
import { CustomInput } from '../shared/CustomInput';

const DescriptionSchema = z.object({
	description: z.string().min(1, 'Description cannot be empty'),
});

type Props = {
	visible: boolean;
	onDismiss: () => void;
	property: Property;
};

function PropertyDescriptionEditBottomSheet({
	visible,
	onDismiss,
	property,
}: Props) {
	const { updateDescriptionMutation } = usePropertyDataMutations();
	const [description, setDescription] = useState(property.description || '');

	async function handleUpdate() {
		const result = DescriptionSchema.safeParse({ description });
		if (!result.success) {
			return showSnackbar({
				message: result.error.issues[0].message,
				type: 'warning',
			});
		}

		await updateDescriptionMutation.mutateAsync(
			{ propertyId: property.id, description },
			{
				onSuccess: () => {
					showSnackbar({
						message: 'Description updated successfully',
						type: 'success',
					});
					onDismiss();
				},
				onError: () => {
					showSnackbar({
						message: 'Failed to update description',
						type: 'error',
					});
				},
			}
		);
	}

	return (
		<BottomSheet
			title="Edit Description"
			withHeader
			snapPoint="70%"
			withScroll
			visible={visible}
			onDismiss={onDismiss}>
			<View className="flex-1 p-4 gap-4 pb-8 bg-background">
				<CustomInput
					title="Description"
					className=""
					height={300}
					placeholder="Enter property description"
					value={description}
					onUpdate={setDescription}
					multiline
					numberOfLines={25}
				/>

				<Button className="h-11 mt-4" onPress={handleUpdate}>
					{updateDescriptionMutation.isPending && <SpinningLoader />}
					<ButtonText className="text-white">Update</ButtonText>
				</Button>
			</View>
		</BottomSheet>
	);
}

export default withRenderVisible(PropertyDescriptionEditBottomSheet);
