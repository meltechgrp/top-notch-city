import ScreenContianer from '@/components/shared/ScreenContianer';
import Platforms from '@/constants/Plaforms';
import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { Box, Image, ImageBackground } from '../ui';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';

type Props = {
	children: React.ReactNode;
	allowBack?: boolean;
	withScroll?: boolean;
	edges?: Array<'top' | 'bottom' | 'left' | 'right'>;
	onBack?: () => void;
	showHeader?: boolean;
};

export default function OnboardingScreenContainer(props: Props) {
	const {
		children,
		allowBack = true,
		withScroll = true,
		showHeader = true,
		edges = ['top', 'bottom'],
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
		<Box className="flex-1 mx-auto w-full">
			{Platforms.isWeb() ? (
				<View className="flex-1 bg-black/80 justify-center">
					<View className="py-6 flex-1  ">
						<View className="flex-row mt-2 items-center pb-4 px-6">
							{showHeader && (
								<Pressable
									className="flex-1 items-center "
									onPress={() => router.push('/')}>
									<Image
										source={require('@/assets/images/landing/logo-white.png')}
										alt="Logo"
										className=" w-[135px] h-[48px] object-cover"
									/>
								</Pressable>
							)}
						</View>
						<View className="pt-2 px-6 flex-1">{children}</View>
					</View>
				</View>
			) : (
				<ImageBackground
					source={require('@/assets/images/landing/auth-banner.png')}
					className="flex-1 bg-cover w-full md:max-w-[1400px]">
					<StatusBar style="light" />
					<ScreenContianer
						edges={edges}
						keyboardVerticalOffset={Platforms.isIOS() ? 20 : undefined}>
						<View className="py-6  flex-1 ">
							<View className="flex-row mt-2 items-center pb-4 px-6">
								{allowBack && (
									<Pressable
										onPress={_onBack}
										className=" bg-gray-400 p-1.5 rounded-full">
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
				</ImageBackground>
			)}
		</Box>
	);
}
