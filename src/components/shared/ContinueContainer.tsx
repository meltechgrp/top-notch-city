import { cn } from '@/lib/utils';
import { useLayout } from '@react-native-community/hooks';
import * as React from 'react';
import { View } from 'react-native';

type Props = View['props'] & {
	children: any | ((w: number) => any);
};
export default function ContinueContainer({
	style,
	children,
	className,
	...props
}: Props) {
	const { width, onLayout } = useLayout();
	return (
		<View
			{...props}
			onLayout={onLayout}
			style={[style]}
			className={cn('px-4 pt-4 android:pb-4', className)}>
			{typeof children === 'function' ? children(width) : children}
		</View>
	);
}
