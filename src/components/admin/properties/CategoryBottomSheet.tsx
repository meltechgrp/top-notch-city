import withRenderVisible from '@/components/shared/withRenderOpen';
import { View } from 'react-native';
import BottomSheet from '@/components/shared/BottomSheet';
import { Button, ButtonText, Icon } from '@/components/ui';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { showSnackbar } from '@/lib/utils';
import { Loader } from 'lucide-react-native';

type Props = {
	visible: boolean;
	onDismiss: () => void;
	loading: boolean;
	onUpdate: (data: string) => void;
	onSubmit: () => void;
	category?: string;
};
function CategoryBottomSheet(props: Props) {
	const { visible, onDismiss, onUpdate, category, onSubmit, loading } = props;
	return (
		<BottomSheet
			title={category ? 'Edit Category' : 'Add Category'}
			withHeader={true}
			withBackButton={false}
			snapPoint={'25%'}
			visible={visible}
			onDismiss={onDismiss}>
			<View className="flex-1 gap-4 p-4 pb-8 bg-background">
				<BottomSheetTextInput
					className=" border border-outline text-typography px-4 h-12 rounded-xl"
					value={category}
					onChangeText={onUpdate}
					placeholder="Enter property category"
				/>
				<View className="flex-row gap-4">
					<Button
						className="h-11 flex-1"
						onPress={() => {
							if (!category || category?.length < 3) {
								showSnackbar({
									type: 'warning',
									message: 'Invalid category',
								});
							}
							onSubmit();
						}}>
						{loading && (
							<Icon
								size="sm"
								as={Loader}
								className=" animate-spin text-white"
							/>
						)}
						<ButtonText className=" text-white">
							{category ? 'Update' : 'Save'}
						</ButtonText>
					</Button>
				</View>
			</View>
		</BottomSheet>
	);
}

export default withRenderVisible(CategoryBottomSheet);
