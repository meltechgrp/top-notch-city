import { Colors } from '@/constants/Colors';
import { ActivityIndicator, View } from 'react-native';

export default function Loading() {
	return (
		<View className="py-10">
			<ActivityIndicator color={Colors.light.icon} size="small" />
		</View>
	);
}
