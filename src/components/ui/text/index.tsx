import React from 'react';

import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { Text as RNText } from 'react-native';
import { textStyle } from './styles';

import { useThemeColor } from '@/hooks/useThemeColor';
type ITextProps = React.ComponentProps<typeof RNText> &
	VariantProps<typeof textStyle>;

const Text = React.forwardRef<React.ElementRef<typeof RNText>, ITextProps>(
	(
		{
			className,
			isTruncated,
			bold,
			underline,
			strikeThrough,
			size = 'md',
			sub,
			italic,
			highlight,
			...props
		},
		ref
	) => {
		const color = useThemeColor({ light: 'black', dark: 'white' }, 'text');
		return (
			<RNText
				// style={[{ color }]}
				className={`${textStyle({
					isTruncated,
					bold,
					underline,
					strikeThrough,
					size,
					sub,
					italic,
					highlight,
					class: className,
				})} font-railway`}
				{...props}
				ref={ref}
			/>
		);
	}
);

Text.displayName = 'Text';

export { Text };
