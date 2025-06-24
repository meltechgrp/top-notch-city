import ScreenContianer from '@/components/shared/ScreenContianer';
import Platforms from '@/constants/Plaforms';
import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { Box, Image, ImageBackground, Text } from '../ui';
import { ChevronLeft } from 'lucide-react-native';
import { useTheme } from '../layouts/ThemeProvider';

type Props = {
	children: React.ReactNode;
	allowBack?: boolean;
	withScroll?: boolean;
	edges?: Array<'top' | 'bottom' | 'left' | 'right'>;
	onBack?: () => void;
	showHeader?: boolean;
	skip?: boolean;
};

export default function OnboardingScreenContainer(props: Props) {
	const {
		children,
		allowBack = true,
		withScroll = true,
		showHeader = true,
		edges = ['top', 'bottom'],
		skip = false,
	} = props;
	const { theme } = useTheme();

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
		<Box className="flex-1 mx-auto w-full">
			<ImageBackground
				source={require('@/assets/images/landing/auth-banner.png')}
				className="flex-1 bg-cover w-full md:max-w-[1400px]">
				<View
					className={`flex-1 ${theme === 'dark' ? 'bg-black/30' : 'bg-black/15'}`}>
					<ScreenContianer
						edges={edges}
						style={{ flex: 1 }}
						keyboardVerticalOffset={Platforms.isIOS() ? 20 : 0}>
						<View className="py-6 flex-1 ">
							<View className="flex-row mt-2 items-center pb-4 px-6">
								{allowBack && (
									<Pressable
										onPress={_onBack}
										className=" bg-outline-100/60 p-1.5 rounded-full">
										<ChevronLeft strokeWidth={2} color={'#fff'} />
									</Pressable>
								)}
								{showHeader && (
									<View className=" flex-1 items-center ">
										<Image
											source={require('@/assets/images/landing/logo-white.png')}
											alt="Logo"
											className=" w-[135px] h-[48px] object-cover"
										/>
									</View>
								)}
								{skip && (
									<Pressable
										onPress={() => router.push('/home')}
										className="ml-auto">
										<Text size="md">Skip</Text>
									</Pressable>
								)}
							</View>
							<ScrollView
								keyboardShouldPersistTaps="handled"
								contentInsetAdjustmentBehavior="automatic"
								automaticallyAdjustsScrollIndicatorInsets={true}
								showsVerticalScrollIndicator
								alwaysBounceVertical
								contentInset={{ bottom: 0 }}
								scrollIndicatorInsets={{ bottom: 0 }}
								automaticallyAdjustKeyboardInsets={true}
								contentContainerClassName="pt-2 px-6">
								{children}
							</ScrollView>
						</View>
					</ScreenContianer>
				</View>
			</ImageBackground>
		</Box>
	);
}
