import withRenderVisible from '@/components/shared/withRenderOpen';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import BottomSheet from '@/components/shared/BottomSheet';
import { Button, ButtonText } from '@/components/ui';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { showSnackbar } from '@/lib/utils';
import { SpinningLoader } from '@/components/loaders/SpinningLoader';
import { useEffect, useState } from 'react';

type Props = {
	visible: boolean;
	onDismiss: () => void;
	loading?: boolean;
	type: 'edit' | 'add';
	onSubmit: (text: string) => void;
	value?: string;
};
function CategoryBottomSheet(props: Props) {
	const { visible, onDismiss, value, type, loading, onSubmit } = props;
	const [text, setText] = useState('');
	useEffect(() => {
		if (value) {
			setText(value);
		}
	}, [value]);
	return (
		<BottomSheet
			title={type == 'edit' ? 'Edit' : 'Add'}
			withHeader={true}
			withBackButton={false}
			snapPoint={'25%'}
			visible={visible}
			onDismiss={() => {
				setText('');
				onDismiss();
			}}>
			<View className="flex-1 gap-4 p-4 pb-8">
				<BottomSheetTextInput
					className=" border border-outline text-typography px-4 h-12 rounded-xl"
					value={text}
					onChangeText={setText}
					placeholder="Enter name"
				/>
				<View className="flex-row gap-4">
					<Button
						className="h-11 flex-1"
						onPress={() => {
							if (!text || text?.length < 3) {
								showSnackbar({
									type: 'warning',
									message: 'Invalid name',
								});
							}
							onSubmit(text);
							setText('');
						}}>
						{loading && <SpinningLoader />}
						<ButtonText className=" text-white">
							{type == 'edit' ? 'Update' : 'Save'}
						</ButtonText>
					</Button>
				</View>
			</View>
		</BottomSheet>
	);
}

export default withRenderVisible(CategoryBottomSheet);
