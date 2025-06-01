import withRenderVisible from '@/components/shared/withRenderOpen';
import { View } from 'react-native';
import BottomSheet from '../shared/BottomSheet';
import { Button, ButtonText, Text } from '../ui';
import { showSnackbar } from '@/lib/utils';
import { useApiRequest } from '@/lib/api';
import { SpinningLoader } from '../loaders/SpinningLoader';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useState } from 'react';
import { validateEmail } from '@/lib/schema';
import { useStore } from '@/store';

type Props = {
	visible: boolean;
	onDismiss: () => void;
	update: (data: Me) => void;
};

function ProfileEmailBottomSheet(props: Props) {
	const { visible, onDismiss } = props;
	const { me } = useStore();
	const { request, loading } = useApiRequest<Me>();
	const [form, setForm] = useState({
		email: me?.email || '',
	});
	async function handleUpload() {
		const formData = new FormData();
		formData.append('email', form.email);
		const data = await request({
			url: '/users/me',
			method: 'PUT',
			data: formData,
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		if (data) {
			props.update(data);
			showSnackbar({
				message: 'Profile email updated successfully',
				type: 'success',
			});
			onDismiss();
		} else {
			showSnackbar({
				message: 'Failed to update.. try again',
				type: 'warning',
			});
		}
	}
	return (
		<BottomSheet
			title="Update Email Address"
			withHeader={true}
			snapPoint={'25%'}
			visible={visible}
			onDismiss={onDismiss}>
			<View className="flex-1 gap-4 p-4 pb-8 bg-background">
				<View className=" gap-4">
					<View className="gap-1">
						<Text size="sm" className="font-light px-2">
							Email Address
						</Text>
						<BottomSheetTextInput
							className=" border border-outline text-typography px-4 h-12 rounded-xl"
							value={form.email}
							onChangeText={(val) => setForm({ ...form, email: val })}
							placeholder="Email address"
						/>
					</View>
				</View>
				<View className="flex-row gap-4">
					<Button
						className="h-11 flex-1"
						onPress={async () => {
							if (!validateEmail.safeParse(form.email).success) {
								return showSnackbar({
									message: 'Please enter a valid email address..',
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

export default withRenderVisible(ProfileEmailBottomSheet);
