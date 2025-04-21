import { router } from 'expo-router';
import { ChevronLeftIcon } from 'lucide-react-native';
import { Pressable } from 'react-native';

export default function headerLeft(handler?: () => void) {
	return (props: any) => (
		<Pressable
			onPress={() => {
				if (router.canGoBack()) handler ? handler() : router.back();
				else router.push('/');
			}}
			style={[[props?.style]]}
			className="py-2 flex-row items-center pr-2 android:pr-4">
			<ChevronLeftIcon strokeWidth={3} size={28} color={'black'} />
		</Pressable>
	);
}
