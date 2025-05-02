import { Href, Link as LN } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { type ComponentProps } from 'react';
import { Platform } from 'react-native';

type Props = Omit<ComponentProps<typeof LN>, 'href'> & { href: Href & string };

export function Link({ href, ...rest }: Props) {
	return (
		<LN
			target="_blank"
			{...rest}
			href={href}
			onPress={async (event) => {
				if (Platform.OS !== 'web') {
					// Prevent the default behavior of linking to the default browser on native.
					event.preventDefault();
					// Open the link in an in-app browser.
					await openBrowserAsync(href);
				}
			}}
		/>
	);
}
