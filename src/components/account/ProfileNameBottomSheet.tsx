import withRenderVisible from '@/components/shared/withRenderOpen';
import { View } from 'react-native';
import BottomSheet from '../shared/BottomSheet';
import { Button, ButtonText, Text } from '../ui';
import { showSnackbar } from '@/lib/utils';
import { SpinningLoader } from '../loaders/SpinningLoader';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useState } from 'react';
import { Name } from '@/lib/schema';
import { useStore } from '@/store';
import { z } from 'zod';
import { useProfileMutations } from '@/tanstack/mutations/useProfileMutations';

type Props = {
	visible: boolean;
	onDismiss: () => void;
};

const ProfileNameSchema = z.object({
	first_name: Name,
	last_name: Name,
});

function ProfileNameBottomSheet(props: Props) {
	const { visible, onDismiss } = props;
	const { me } = useStore();
	const { mutateAsync, isPending: loading } =
		useProfileMutations().updateFullNameMutation;
	const [form, setForm] = useState({
		first_name: me?.first_name || '',
		last_name: me?.last_name || '',
	});
	async function handleUpload() {
		await mutateAsync(
			{
				first_name: form.first_name,
				last_name: form.last_name,
			},
			{
				onSuccess: () => onDismiss(),
			}
		);
	}
	return (
		<BottomSheet
			title="Update profile full name"
			withHeader={true}
			snapPoint={'35%'}
			visible={visible}
			onDismiss={onDismiss}>
			<View className="flex-1 gap-4 p-4 pb-8 bg-background">
				<View className=" gap-4">
					<View className="gap-1">
						<Text size="sm" className="font-light px-2">
							First name
						</Text>
						<BottomSheetTextInput
							className=" border border-outline text-typography px-4 h-12 rounded-xl"
							value={form.first_name}
							onChangeText={(val) => setForm({ ...form, first_name: val })}
							placeholder="First name"
						/>
					</View>
					<View className="gap-1">
						<Text size="sm" className="font-light px-2">
							Last name
						</Text>
						<BottomSheetTextInput
							className=" border border-outline text-typography px-4 h-12 rounded-xl"
							value={form.last_name}
							onChangeText={(val) => setForm({ ...form, last_name: val })}
							placeholder="Last name"
						/>
					</View>
				</View>
				<View className="flex-row gap-4">
					<Button
						className="h-11 flex-1"
						onPress={async () => {
							const validate = ProfileNameSchema.safeParse(form);
							if (!validate.success) {
								return showSnackbar({
									message: 'Please enter valid names..',
									type: 'warning',
								});
							}
							await handleUpload();
						}}>
						{loading && <SpinningLoader />}
						<ButtonText className=" text-white">Update</ButtonText>
					</Button>
				</View>
			</View>
		</BottomSheet>
	);
}

export default withRenderVisible(ProfileNameBottomSheet);
