'use client';
import React from 'react';
import { createPressable } from '@gluestack-ui/pressable';
import { Pressable as RNPressable } from 'react-native';

import { tva } from '@gluestack-ui/nativewind-utils/tva';
import { withStyleContext } from '@gluestack-ui/nativewind-utils/withStyleContext';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { hapticFeed } from '@/components/HapticTab';
import Platforms from '@/constants/Plaforms';

const UIPressable = createPressable({
	Root: withStyleContext(RNPressable),
});

const pressableStyle = tva({
	base: 'data-[focus-visible=true]:outline-none data-[focus-visible=true]:ring-indicator-info data-[focus-visible=true]:ring-2 data-[disabled=true]:opacity-40',
});

type IPressableProps = Omit<
	React.ComponentProps<typeof UIPressable>,
	'context'
> &
	VariantProps<typeof pressableStyle> & {
		disableHaptic?: boolean;
		both?: boolean;
	};
const Pressable = React.forwardRef<
	React.ComponentRef<typeof UIPressable>,
	IPressableProps
>(function Pressable(
	{ className, disableHaptic = false, both = false, ...props },
	ref
) {
	return (
		<UIPressable
			{...props}
			ref={ref}
			onPress={async (e) => {
				if (!disableHaptic) {
					await hapticFeed(both);
				}
				props.onPress && props.onPress(e);
			}}
			className={pressableStyle({
				class: className,
			})}
		/>
	);
});

Pressable.displayName = 'Pressable';
export { Pressable };
