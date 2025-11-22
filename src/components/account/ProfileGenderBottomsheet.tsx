// import withRenderVisible from '@/components/shared/withRenderOpen';
// import { useStore } from '@/store';
// import OptionsBottomSheet from '../shared/OptionsBottomSheet';
// import { useProfileMutations } from '@/tanstack/mutations/useProfileMutations';

// type Props = {
// 	visible: boolean;
// 	onDismiss: () => void;
// };

// function ProfileGenderBottomSheet(props: Props) {
// 	const { visible, onDismiss } = props;
// 	const { me } = useStore();
// 	const { mutateAsync } = useProfileMutations().updateGenderMutation;
// 	async function handleUpload(val: string) {
// 		await mutateAsync(val);
// 	}
// 	return (
// 		<OptionsBottomSheet
// 			isOpen={visible}
// 			onDismiss={onDismiss}
// 			onChange={async (val) => handleUpload(val.value)}
// 			value={{ label: me?.gender || 'Other', value: me?.gender }}
// 			options={[
// 				{
// 					label: 'Male',
// 					value: 'male',
// 				},
// 				{
// 					label: 'Female',
// 					value: 'female',
// 				},
// 			]}
// 		/>
// 	);
// }

// export default withRenderVisible(ProfileGenderBottomSheet);
