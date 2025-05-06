import { BookText } from 'lucide-react-native';
import { Icon, Text, View } from '../ui';

export default function NoResult() {
	return (
		<View className="flex-1 justify-center items-center bg-white">
			<Icon as={BookText} />
			<Text className="text-typography/80 pt-2">No result found</Text>
		</View>
	);
}
