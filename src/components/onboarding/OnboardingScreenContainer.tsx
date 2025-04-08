import ScreenContianer from '@/components/shared/ScreenContianer';
import ReplyIcon from '@/components/icons/ReplyIcon';
import Platforms from '@/constants/Plaforms';
import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { Text } from '../ui';

type Props = {
	children: React.ReactNode;
	allowBack?: boolean;
	withScroll?: boolean;
	edges?: Array<'top' | 'bottom' | 'left' | 'right'>;
	onBack?: () => void;
};

export default function OnboardingScreenContainer(props: Props) {
	const {
		children,
		allowBack = true,
		withScroll = true,
		edges = ['top'],
	} = props;

	function _onBack() {
		if (props.onBack) {
			props.onBack();
			return;
		}
		if (router.canGoBack()) {
			router.back();
		} else {
			router.push({ pathname: '/' });
		}
	}

	return (
		<ScreenContianer
			edges={edges}
			keyboardVerticalOffset={Platforms.isIOS() ? 0 : undefined}>
			<View className="py-6  flex-1">
				<View className="flex-row  items-center pb-4 px-6">
					{allowBack && (
						<Pressable
							onPress={_onBack}
							className="h-12 flex-row items-center justify-center rounded-full gap-2">
							<ReplyIcon color={'#fff'} />
							<Text className="text-base font-medium">Back</Text>
						</Pressable>
					)}
				</View>
				{withScroll ? (
					<ScrollView
						keyboardShouldPersistTaps="handled"
						contentContainerClassName="pt-2 px-6">
						{children}
					</ScrollView>
				) : (
					<View className="pt-2 px-6 flex-1">{children}</View>
				)}
			</View>
		</ScreenContianer>
	);
}
