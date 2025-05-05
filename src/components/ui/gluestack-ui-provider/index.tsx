import React from 'react';
import { config } from './config';
import { OverlayProvider } from '@gluestack-ui/overlay';
import { ToastProvider } from '@gluestack-ui/toast';
import { ColorSchemeName, useColorScheme, View, ViewProps } from 'react-native';
import { useTheme } from '@/components/layouts/ThemeProvider';
import { colorScheme as colorSchemeNW } from 'nativewind';

type ModeType = 'light' | 'dark' | 'system';

const getColorSchemeName = (
	colorScheme: ColorSchemeName,
	mode: ModeType
): 'light' | 'dark' => {
	if (mode === 'system') {
		return colorScheme ?? 'light';
	}
	return mode;
};
export function GluestackUIProvider({
	...props
}: {
	children?: React.ReactNode;
	style?: ViewProps['style'];
}) {
	const { theme = 'system' } = useTheme();
	const colorScheme = useColorScheme();

	const colorSchemeName = getColorSchemeName(colorScheme, theme);

	colorSchemeNW.set(theme);

	return (
		<View
			style={[
				config[colorSchemeName!],
				{ flex: 1, height: '100%', width: '100%' },
				props.style,
			]}>
			<OverlayProvider>
				<ToastProvider>{props.children}</ToastProvider>
			</OverlayProvider>
		</View>
	);
}
