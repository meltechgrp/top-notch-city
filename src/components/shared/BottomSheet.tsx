import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
	BackHandler,
	Keyboard,
	Modal,
	Platform,
	Pressable,
	View,
} from 'react-native';
import {
	BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import Animated, {
	Extrapolation,
	interpolate,
	useAnimatedStyle,
} from 'react-native-reanimated';
import { cn } from '@/lib/utils';
import { CloseIcon, Heading, Icon, Text } from '../ui';

type BottomSheetProps = Modal['props'] & {
	withHeader?: any;
	title?: string;
	withCloseButton?: boolean;
	withBackButton?: boolean;
	bottomPadding?: boolean;
	snapPoint?: string | string[] | number | number[];
	HeaderRightComponent?: any;
	plain?: boolean;
	android_keyboardInputMode?: 'adjustResize' | 'adjustPan';
};
export default function BottomSheet(props: BottomSheetProps) {
	const {
		snapPoint = '50%',
		onDismiss,
		HeaderRightComponent,
		withCloseButton = true,
		plain,
		android_keyboardInputMode = 'adjustPan',
	} = props;
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);

	// variables
	const snapPoints = useMemo(
		() => (Array.isArray(snapPoint) ? snapPoint : [snapPoint]),
		[snapPoint]
	);

	// callbacks
	const handlePresentModalPress = useCallback(() => {
		Keyboard.dismiss();
		bottomSheetModalRef.current?.present();
	}, []);
	function handleDismiss() {
		bottomSheetModalRef.current?.dismiss();
		onDismiss && onDismiss();
	}

	useEffect(() => {
		if (props.visible) {
			handlePresentModalPress();
		} else {
			handleDismiss();
		}
	}, [props.visible]);

	useEffect(() => {
		return () => {
			handleDismiss();
		};
	}, []);
	useEffect(() => {
		const backAction = () => {
			if (props.visible) {
				handleDismiss();
				return true;
			}
			// this is necessary to allow default back button behaviour to work
			// when modal is not visible
			return false;
		};

		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			backAction
		);

		return () => backHandler.remove();
	}, [handleDismiss, props.visible]);

	const renderBackdrop = useCallback(
		(props: any) => <CustomBackdrop {...props} onPress={handleDismiss} />,
		[]
	);

	return (
		<BottomSheetModal
			ref={bottomSheetModalRef}
			snapPoints={snapPoints}
			onDismiss={handleDismiss}
			android_keyboardInputMode={android_keyboardInputMode}
			backdropComponent={renderBackdrop}
			keyboardBehavior={Platform.OS === 'ios' ? 'extend' : 'interactive'}
			keyboardBlurBehavior="restore"
			style={{ backgroundColor: 'transparent', flex: 1 }}
			handleComponent={() =>
				plain ? null : (
					<View
						className={cn('w-full', {
							'h-8': !props.withHeader,
							'h-[53px]': props.withHeader,
						})}>
						<View className="h-full justify-center  w-full pt-2.5">
							<View className="justify-center items-center">
								<View className="h-1 w-[54px] rounded-md bg-outline-200" />
							</View>
							{props.withHeader && (
								<View className="flex-row w-full justify-between items-center px-4 relative py-2.5 border-b border-outline-300 ">
									<View className="flex-row w-full justify-center items-center absolute inset-0 pl-8">
										<Heading className=" font-medium">{props.title}</Heading>
									</View>

									<Pressable onPress={() => handleDismiss()}>
										{props.withBackButton ? (
											<View className="flex-row items-center">
												<Text className="text-base">Go back</Text>
											</View>
										) : (
											withCloseButton && (
												<View className="flex-row justify-center items-center">
													<Icon as={CloseIcon} />
												</View>
											)
										)}
									</Pressable>
									<View>{HeaderRightComponent}</View>
								</View>
							)}
						</View>
					</View>
				)
			}>
			<BottomSheetView style={{ flex: 1 }}>{props.children}</BottomSheetView>
		</BottomSheetModal>
	);
}

const CustomBackdrop = ({
	animatedIndex,
	style,
	onPress,
}: BottomSheetBackdropProps & { onPress: () => void }) => {
	// animated variables
	const containerAnimatedStyle = useAnimatedStyle(() => ({
		opacity: interpolate(
			animatedIndex.value + 1,
			[0, 1],
			[0, 1],
			Extrapolation.CLAMP
		),
	}));

	// styles
	const containerStyle = useMemo(
		() => [style, containerAnimatedStyle],
		[style, containerAnimatedStyle]
	);

	return (
		<Animated.View style={containerStyle} className="bg-black/70">
			<Pressable onPress={onPress} className="flex-1" />
		</Animated.View>
	);
};
