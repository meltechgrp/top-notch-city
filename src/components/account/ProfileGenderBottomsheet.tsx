import withRenderVisible from '@/components/shared/withRenderOpen';
import { cn, showSnackbar } from '@/lib/utils';
import { useApiRequest } from '@/lib/api';
import { useStore } from '@/store';
import OptionsBottomSheet from '../shared/OptionsBottomSheet';
import { Text, View } from '../ui';

type Props = {
	visible: boolean;
	onDismiss: () => void;
	update: (data: Me) => void;
};

function ProfileGenderBottomSheet(props: Props) {
	const { visible, onDismiss, update } = props;
	const { me } = useStore();
	const { request, loading } = useApiRequest<Me>();
	async function handleUpload(val: string) {
		const formData = new FormData();
		formData.append('gender', val);
		const data = await request({
			url: '/users/me',
			method: 'PUT',
			data: formData,
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		if (data) {
			update(data);
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
		<OptionsBottomSheet
			isOpen={visible}
			onDismiss={onDismiss}
			onChange={async (val) => handleUpload(val.value)}
			value={{ label: me?.gender || 'Other', value: me?.gender }}
			options={[
				{
					label: 'Male',
					value: 'male',
				},
				{
					label: 'Female',
					value: 'female',
				},
			]}
		/>
	);
}

export default withRenderVisible(ProfileGenderBottomSheet);
