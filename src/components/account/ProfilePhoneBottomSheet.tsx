import withRenderVisible from '@/components/shared/withRenderOpen';
import { View } from 'react-native';
import BottomSheet from '../shared/BottomSheet';
import { Button, ButtonText, Text } from '../ui';
import { showSnackbar } from '@/lib/utils';
import { useApiRequest } from '@/lib/api';
import { SpinningLoader } from '../loaders/SpinningLoader';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useState } from 'react';
import { validatePhone } from '@/lib/schema';
import { useStore } from '@/store';

type Props = {
	visible: boolean;
	onDismiss: () => void;
	update: (data: Me) => void;
};

function ProfilePhoneBottomSheet(props: Props) {
	const { visible, onDismiss } = props;
	const { me } = useStore();
	const { request, loading } = useApiRequest<Me>();
	const [form, setForm] = useState({
		phone: me?.phone || '',
	});
	async function handleUpload() {
		const formData = new FormData();
		formData.append('phone', form.phone);
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
				message: 'Profile phone updated successfully',
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
			title="Update Phone Number"
			withHeader={true}
			snapPoint={'25%'}
			visible={visible}
			onDismiss={onDismiss}>
			<View className="flex-1 gap-4 p-4 pb-8 bg-background">
				<View className=" gap-4">
					<View className="gap-1">
						<Text size="sm" className="font-light px-2">
							Phone Number
						</Text>
						<BottomSheetTextInput
							className=" border border-outline text-typography px-4 h-12 rounded-xl"
							value={form.phone}
							onChangeText={(val) => setForm({ ...form, phone: val })}
							placeholder="Phone Number"
						/>
					</View>
				</View>
				<View className="flex-row gap-4">
					<Button
						className="h-11 flex-1"
						onPress={async () => {
							if (!validatePhone.safeParse(form.phone).success) {
								return showSnackbar({
									message: 'Please enter a valid phone address..',
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

export default withRenderVisible(ProfilePhoneBottomSheet);
