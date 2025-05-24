import { Colors } from '@/constants/Colors';
import { ActivityIndicator, Modal, View } from 'react-native';

type Props = {
	visible: boolean;
	onDismiss: () => void;
	dismissOnBack?: boolean;
};
export default function GlobalFullScreenLoader(props: Props) {
	return (
		<Modal
			visible={props.visible}
			transparent
			animationType="fade"
			onRequestClose={props.dismissOnBack ? props.onDismiss : undefined}>
			<View className="flex-1 items-center justify-center bg-black-900 bg-opacity-50">
				<ActivityIndicator size="large" color={Colors.primary} />
			</View>
		</Modal>
	);
}
