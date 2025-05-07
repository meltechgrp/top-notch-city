import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { ChevronLeftIcon } from '../ui';

type Props = {
	headerCenterContent: React.ReactNode;
	headerRightContent?: React.ReactNode;
};
export default function CustomScreenHeader(props: Props) {
	const { headerCenterContent, headerRightContent } = props;

	return (
		<View className="flex-row items-center justify-between w-full h-[48px] border-b border-gray-200 bg-white overflow-hidden">
			<View className="flex-row items-center gap-x-4">
				<Pressable
					onPress={() => {
						router.back();
					}}
					className="py-2 flex-row items-center pl-4 pr-3">
					<ChevronLeftIcon className="text-black-900" />
				</Pressable>
				<View className="flex-1">{headerCenterContent}</View>
				<View className="px-4">{headerRightContent}</View>
			</View>
		</View>
	);
}
