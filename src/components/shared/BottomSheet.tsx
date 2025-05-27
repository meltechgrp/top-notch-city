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
import { CloseIcon, Heading, Icon, Text, useResolvedTheme } from '../ui';
import { Colors } from '@/constants/Colors';

type BottomSheetProps = Modal['props'] & {
	withHeader?: any;
	title?: string;
	withCloseButton?: boolean;
	withBackButton?: boolean;
	bottomPadding?: boolean;
	rounded?: boolean;
	snapPoint?: string | string[] | number | number[];
	HeaderRightComponent?: any;
	contentClassName?: string;
	backdropVariant?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	plain?: boolean;
	addBackground?: boolean;
	android_keyboardInputMode?: 'adjustResize' | 'adjustPan';
};
export default function BottomSheet(props: BottomSheetProps) {
	const {
		snapPoint = '50%',
		onDismiss,
		HeaderRightComponent,
		withCloseButton = true,
		addBackground = true,
		rounded = true,
		plain,
		backdropVariant,
		android_keyboardInputMode = 'adjustPan',
		contentClassName,
	} = props;
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const theme = useResolvedTheme();

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
		(props: any) => (
			<CustomBackdrop
				backdropVariant={backdropVariant}
				{...props}
				onPress={handleDismiss}
			/>
		),
		[]
	);

	return (
		<BottomSheetModal
			ref={bottomSheetModalRef}
			snapPoints={snapPoints}
			onDismiss={handleDismiss}
			android_keyboardInputMode={android_keyboardInputMode}
			backdropComponent={renderBackdrop}
			enableBlurKeyboardOnGesture
			keyboardBehavior={'interactive'}
			keyboardBlurBehavior="restore"
			backgroundComponent={null}
			style={{
				flex: 1,
			}}
			handleComponent={() =>
				plain ? null : (
					<View
						className={cn('w-full bg-background rounded-t-3xl', {
							'h-8': !props.withHeader,
							'h-[53px]': props.withHeader,
						})}>
						<View className="h-full justify-center  w-full pt-2.5">
							<View className="justify-center items-center">
								<View className="h-1 w-[54px] rounded-md bg-outline-200" />
							</View>
							{props.withHeader && (
								<View className="flex-row w-full justify-end items-center px-4 relative py-2.5 ">
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
												<View className="flex-row justify-center p-1 bg-background-info rounded-full items-center">
													<Icon size="xl" as={CloseIcon} />
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
			<BottomSheetView
				style={{
					flex: 1,
					backgroundColor: addBackground
						? theme == 'dark'
							? Colors.light.background
							: Colors.dark.background
						: 'transparent',
				}}
				className={cn(rounded && ' rounded-t-xl', contentClassName)}>
				{props.children}
			</BottomSheetView>
		</BottomSheetModal>
	);
}

const CustomBackdrop = ({
	animatedIndex,
	style,
	backdropVariant = 'xl',
	onPress,
}: BottomSheetBackdropProps & {
	onPress: () => void;
	backdropVariant: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}) => {
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

	const backdrop = {
		xs: 'bg-black/10',
		sm: 'bg-black/40',
		md: 'bg-black/50',
		lg: 'bg-black/60',
		xl: 'bg-black/70',
	};

	return (
		<Animated.View style={containerStyle} className={backdrop[backdropVariant]}>
			<Pressable onPress={onPress} className="flex-1" />
		</Animated.View>
	);
};
