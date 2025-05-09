import { View } from 'react-native';
import { Text } from '../ui';

type NotificationBadgeProps = {
	count?: number | null;
};

export default function NotificationBadge({ count }: NotificationBadgeProps) {
	if (!count) {
		return null;
	}

	const exceeds9 = count > 9;
	const _count = exceeds9 ? '9+' : count;

	return (
		<View className="flex flex-row items-center justify-center w-5 h-5 px-1 bg-primary rounded-full">
			<Text
				style={[
					{
						fontSize: exceeds9 ? 9 : 12,
					},
				]}
				className="text-white">
				{_count}
			</Text>
		</View>
	);
}
