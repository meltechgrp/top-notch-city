import withRenderVisible from '@/components/shared/withRenderOpen';
import { View } from 'react-native';
import BottomSheet from '../shared/BottomSheet';
import { Button, ButtonText } from '../ui';
import { showSnackbar } from '@/lib/utils';
import { fetchWithAuth, useApiRequest } from '@/lib/api';
import { SpinningLoader } from '../loaders/SpinningLoader';
import { useState } from 'react';
import { useStore } from '@/store';
import DatePicker from '../shared/DatePicker';
import { format } from 'date-fns';

type Props = {
	visible: boolean;
	onDismiss: () => void;
	update: (data: Me) => void;
};

const minimumAge = new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 13);

function ProfileDobBottomSheet(props: Props) {
	const { visible, onDismiss } = props;
	const { me } = useStore();
	const [dob, setDob] = useState<Date | null>(
		me?.date_of_birth ? new Date(me.date_of_birth) : null
	);
	const { request, loading } = useApiRequest<Me>();
	async function handleUpload() {
		if (!dob) {
			return showSnackbar({
				message: 'Enter a valid Date',
				type: 'warning',
			});
		}
		const formData = new FormData();
		formData.append('date_of_birth', format(dob, 'yyyy-MM-dd'));
		const res = await fetchWithAuth('/users/me', {
			method: 'PUT',
			body: formData,
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		const data = (await res.json()) as Me;
		if (data) {
			props.update(data);
			showSnackbar({
				message: 'Date of birth updated successfully',
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
			title="Update Date of Birth"
			withHeader={true}
			snapPoint={'42%'}
			visible={visible}
			onDismiss={onDismiss}>
			<View className="flex-1 gap-4 p-4 pb-8 bg-background">
				<View className=" items-center mb-8">
					<DatePicker
						label="Date of Birth"
						placeholder="Day/Month/Year"
						value={dob as any}
						onChange={(val) => setDob(new Date(val))}
						mode="date"
						modal={false}
						maximumDate={minimumAge}
						startDate={minimumAge}
					/>
				</View>
				<View className="flex-row gap-4">
					<Button
						className="h-11 flex-1"
						onPress={async () => {
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

export default withRenderVisible(ProfileDobBottomSheet);
