import { KeyboardDismissPressable } from '@/components/shared/KeyboardDismissPressable';
import Platforms from '@/constants/Plaforms';

import * as React from 'react';
import { View, KeyboardAvoidingView } from 'react-native';
import { Edges, SafeAreaView } from 'react-native-safe-area-context';

type Props = View['props'] & {
	edges?: Edges;
	keyboardVerticalOffset?: number;
};
export default function ScreenContianer(props: Props) {
	const {
		children,
		style,
		edges = ['bottom', 'top'],
		keyboardVerticalOffset = Platforms.isIOS() ? 100 : -290,
		...others
	} = props;
	return (
		<View className="flex-1 bg-background h-full relative">
			<SafeAreaView {...others} edges={edges} style={{ flex: 1 }}>
				<KeyboardDismissPressable>
					<KeyboardAvoidingView
						style={{
							flex: 1,
						}}
						behavior="padding"
						keyboardVerticalOffset={keyboardVerticalOffset}>
						{children}
					</KeyboardAvoidingView>
				</KeyboardDismissPressable>
			</SafeAreaView>
		</View>
	);
}
