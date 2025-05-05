import React from 'react';
import { View, ViewProps } from 'react-native';

import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { boxStyle } from './styles';
import { cn } from '@/lib/utils';

type IBoxProps = ViewProps &
	VariantProps<typeof boxStyle> & { className?: string };

const Box = React.forwardRef<React.ComponentRef<typeof View>, IBoxProps>(
	function Box({ className, ...props }, ref) {
		return (
			<View
				ref={ref}
				{...props}
				className={cn(
					'bg-background dark:bg-background',
					boxStyle({ class: className })
				)}
			/>
		);
	}
);

Box.displayName = 'Box';
export { Box };
