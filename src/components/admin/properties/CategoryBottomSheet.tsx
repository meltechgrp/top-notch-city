import withRenderVisible from '@/components/shared/withRenderOpen';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import BottomSheet from '@/components/shared/BottomSheet';
import { Button, ButtonText } from '@/components/ui';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { showSnackbar } from '@/lib/utils';
import { SpinningLoader } from '@/components/loaders/SpinningLoader';

type Props = {
	visible: boolean;
	onDismiss: () => void;
	loading?: boolean;
	type: 'edit' | 'add';
	onUpdate: (data: string) => void;
	onSubmit: () => void;
	category?: string;
};
function CategoryBottomSheet(props: Props) {
	const { visible, onDismiss, onUpdate, type, loading, category, onSubmit } =
		props;
	return (
		<BottomSheet
			title={type == 'edit' ? 'Edit' : 'Add'}
			withHeader={true}
			withBackButton={false}
			snapPoint={'25%'}
			visible={visible}
			onDismiss={onDismiss}>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'height' : 'height'}
				style={{ flex: 1 }}>
				<View className="flex-1 gap-4 p-4 pb-8 bg-background">
					<BottomSheetTextInput
						className=" border border-outline text-typography px-4 h-12 rounded-xl"
						value={category}
						onChangeText={onUpdate}
						placeholder="Enter name"
					/>
					<View className="flex-row gap-4">
						<Button
							className="h-11 flex-1"
							onPress={() => {
								if (!category || category?.length < 3) {
									showSnackbar({
										type: 'warning',
										message: 'Invalid name',
									});
								}
								onSubmit();
							}}>
							{loading && <SpinningLoader />}
							<ButtonText className=" text-white">
								{type == 'edit' ? 'Update' : 'Save'}
							</ButtonText>
						</Button>
					</View>
				</View>
			</KeyboardAvoidingView>
		</BottomSheet>
	);
}

export default withRenderVisible(CategoryBottomSheet);
