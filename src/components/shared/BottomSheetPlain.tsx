import Layout from '@/constants/Layout';
import React from 'react';
import { Animated, Modal, Pressable, View } from 'react-native';

import { useKeyboard } from '@react-native-community/hooks';
import { Text } from '../ui';

type BottomSheetProps = Modal['props'] & {
	doneLabel?: string;
};
export default function BottomSheetPlain(props: BottomSheetProps) {
	const keyboard = useKeyboard();

	const h = Layout.window.height - keyboard.keyboardHeight - 50;

	function handleDismiss() {
		props.onDismiss!();
	}

	return (
		<Modal
			animationType="slide"
			visible={props.visible}
			transparent
			onRequestClose={() => handleDismiss()}
			className="m-0">
			<View
				className="flex-1 bg-black/20 justify-end"
				onTouchEnd={() => {
					handleDismiss();
				}}>
				<Animated.View
					onTouchEnd={(ev) => {
						ev.stopPropagation();
					}}
					style={[
						{
							shadowColor: '#000',
							shadowOffset: {
								width: 100,
								height: 100,
							},
							shadowRadius: 0,
							elevation: 3,
						},
					]}>
					<View
						style={[keyboard.keyboardShown ? { height: h } : {}]}
						className="relative overflow-hidden p-4 ios:pb-[34px] android:pb-4">
						<View className="bg-background-muted mb-2 rounded-2xl">
							{props.children}
						</View>
						<Pressable
							onPress={handleDismiss}
							className="bg-background-muted h-14 items-center justify-center rounded-lg">
							<Text className="text-black-900">
								{props.doneLabel || 'Cancel'}
							</Text>
						</Pressable>
					</View>
				</Animated.View>
			</View>
		</Modal>
	);
}
