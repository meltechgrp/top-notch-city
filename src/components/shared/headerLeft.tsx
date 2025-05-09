import { router } from 'expo-router';
import { Pressable } from 'react-native';
import ChevronLeftIcon from '../icons/ChevronLeftIcon';
import { Icon } from '../ui';

export default function headerLeft(handler?: () => void) {
	return (props: any) => (
		<Pressable
			onPress={() => {
				if (router.canGoBack()) handler ? handler() : router.back();
				else router.push('/');
			}}
			style={[[props?.style]]}
			className="py-2 flex-row items-center pr-2 android:pr-4">
			<Icon as={ChevronLeftIcon} />
		</Pressable>
	);
}
