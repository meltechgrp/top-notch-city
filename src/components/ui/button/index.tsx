'use client';
import React from 'react';
import { createButton } from '@gluestack-ui/button';
import { tva } from '@gluestack-ui/nativewind-utils/tva';
import {
	withStyleContext,
	useStyleContext,
} from '@gluestack-ui/nativewind-utils/withStyleContext';
import { cssInterop } from 'nativewind';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { PrimitiveIcon, UIIcon } from '@gluestack-ui/icon';
import { hapticFeed } from '@/components/HapticTab';

const SCOPE = 'BUTTON';

const Root = withStyleContext(Pressable, SCOPE);

const UIButton = createButton({
	Root: Root,
	Text,
	Group: View,
	Spinner: ActivityIndicator,
	Icon: UIIcon,
});

cssInterop(PrimitiveIcon, {
	className: {
		target: 'style',
		nativeStyleToProp: {
			height: true,
			width: true,
			fill: true,
			color: 'classNameColor',
			stroke: true,
		},
	},
});

const buttonStyle = tva({
	base: 'group/button rounded-xl bg-primary flex-row items-center justify-center data-[focus-visible=true]:web:outline-none data-[focus-visible=true]:web:ring-2 data-[disabled=true]:opacity-40 gap-2',
	variants: {
		action: {
			primary:
				'bg-primary data-[hover=true]:bg-primary data-[active=true]:bg-primary border-primary-100 data-[hover=true]:border-primary-400 data-[active=true]:border-primary-500 data-[focus-visible=true]:web:ring-indicator-info',
			secondary:
				'bg-background border-outline-100 data-[hover=true]:bg-secondary-muted data-[hover=true]:border-secondary-muted data-[active=true]:bg-secondary-muted data-[active=true]:border-secondary-muted data-[focus-visible=true]:web:ring-indicator-info',
			positive:
				'bg-success border-success-300 data-[hover=true]:bg-success data-[hover=true]:border-success-400 data-[active=true]:bg-success-300 data-[active=true]:border-success-500 data-[focus-visible=true]:web:ring-indicator-info',
			negative:
				'bg-error border-error-300 data-[hover=true]:bg-error data-[hover=true]:border-error-400 data-[active=true]:bg-error-300 data-[active=true]:border-error-500 data-[focus-visible=true]:web:ring-indicator-info',
			default:
				'bg-transparent data-[hover=true]:bg-background data-[active=true]:bg-transparent',
		},
		variant: {
			link: 'px-0',
			outline:
				'bg-transparent border border-primary data-[hover=true]:bg-background data-[active=true]:bg-transparent',
			solid: '',
		},

		size: {
			xs: 'px-3.5 h-8',
			sm: 'px-4 h-9',
			md: 'px-5 h-10',
			lg: 'px-6 h-11',
			xl: 'px-7 h-12',
		},
	},
	compoundVariants: [
		{
			action: 'primary',
			variant: 'link',
			class:
				'px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent',
		},
		{
			action: 'secondary',
			variant: 'link',
			class:
				'px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent',
		},
		{
			action: 'positive',
			variant: 'link',
			class:
				'px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent',
		},
		{
			action: 'negative',
			variant: 'link',
			class:
				'px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent',
		},
		{
			action: 'primary',
			variant: 'outline',
			class:
				'bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent',
		},
		{
			action: 'secondary',
			variant: 'outline',
			class:
				'bg-transparent data-[hover=true]:bg-background border-outline-100 data-[active=true]:bg-transparent',
		},
		{
			action: 'positive',
			variant: 'outline',
			class:
				'bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent',
		},
		{
			action: 'negative',
			variant: 'outline',
			class:
				'bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent',
		},
	],
});

const buttonTextStyle = tva({
	base: 'text-white font-semibold web:select-none',
	parentVariants: {
		action: {
			primary:
				'text-white data-[hover=true]:text-primary data-[active=true]:text-primary',
			secondary:
				'text-white data-[hover=true]:text-white data-[active=true]:text-white',
			positive:
				'text-success data-[hover=true]:text-success data-[active=true]:text-success-300',
			negative:
				'text-white data-[hover=true]:text-error data-[active=true]:text-error-300',
		},
		variant: {
			link: 'data-[hover=true]:underline data-[active=true]:underline',
			outline: '',
			solid:
				'text-white data-[hover=true]:text-typography data-[active=true]:text-typography',
		},
		size: {
			xs: 'text-xs',
			sm: 'text-sm',
			md: 'text-base',
			lg: 'text-lg',
			xl: 'text-xl',
		},
	},
	parentCompoundVariants: [
		{
			variant: 'solid',
			action: 'primary',
			class:
				'text-white data-[hover=true]:text-white/90 data-[active=true]:text-white',
		},
		{
			variant: 'solid',
			action: 'secondary',
			class:
				'text-white data-[hover=true]:text-typography data-[active=true]:text-typography',
		},
		{
			variant: 'solid',
			action: 'positive',
			class:
				'text-typography data-[hover=true]:text-typography data-[active=true]:text-typography',
		},
		{
			variant: 'solid',
			action: 'negative',
			class:
				'text-typography data-[hover=true]:text-typography data-[active=true]:text-typography',
		},
		{
			variant: 'outline',
			action: 'primary',
			class:
				'text-primary data-[hover=true]:text-primary data-[active=true]:text-primary',
		},
		{
			variant: 'outline',
			action: 'secondary',
			class:
				'text-typography data-[hover=true]:text-primary data-[active=true]:text-typography',
		},
		{
			variant: 'outline',
			action: 'positive',
			class:
				'text-primary data-[hover=true]:text-primary data-[active=true]:text-primary',
		},
		{
			variant: 'outline',
			action: 'negative',
			class:
				'text-primary data-[hover=true]:text-primary data-[active=true]:text-primary',
		},
	],
});

const buttonIconStyle = tva({
	base: 'fill-none',
	parentVariants: {
		variant: {
			link: 'data-[hover=true]:underline data-[active=true]:underline',
			outline: '',
			solid:
				'text-typography data-[hover=true]:text-typography data-[active=true]:text-typography',
		},
		size: {
			xs: 'h-3.5 w-3.5',
			sm: 'h-4 w-4',
			md: 'h-[18px] w-[18px]',
			lg: 'h-[18px] w-[18px]',
			xl: 'h-5 w-5',
		},
		action: {
			primary:
				'text-primary data-[hover=true]:text-primary data-[active=true]:text-primary',
			secondary:
				'text-white data-[hover=true]:text-white data-[active=true]:text-white',
			positive:
				'text-success data-[hover=true]:text-success data-[active=true]:text-success-300',

			negative:
				'text-error data-[hover=true]:text-error data-[active=true]:text-error-300',
		},
	},
	parentCompoundVariants: [
		{
			variant: 'solid',
			action: 'primary',
			class:
				'text-typography data-[hover=true]:text-typography data-[active=true]:text-typography',
		},
		{
			variant: 'solid',
			action: 'secondary',
			class:
				'text-white data-[hover=true]:text-typography data-[active=true]:text-typography',
		},
		{
			variant: 'solid',
			action: 'positive',
			class:
				'text-typography data-[hover=true]:text-typography data-[active=true]:text-typography',
		},
		{
			variant: 'solid',
			action: 'negative',
			class:
				'text-typography data-[hover=true]:text-typography data-[active=true]:text-typography',
		},
	],
});

const buttonGroupStyle = tva({
	base: '',
	variants: {
		space: {
			xs: 'gap-1',
			sm: 'gap-2',
			md: 'gap-3',
			lg: 'gap-4',
			xl: 'gap-5',
			'2xl': 'gap-6',
			'3xl': 'gap-7',
			'4xl': 'gap-8',
		},
		isAttached: {
			true: 'gap-0',
		},
		flexDirection: {
			row: 'flex-row',
			column: 'flex-col',
			'row-reverse': 'flex-row-reverse',
			'column-reverse': 'flex-col-reverse',
		},
	},
});

type IButtonProps = Omit<
	React.ComponentPropsWithoutRef<typeof UIButton>,
	'context'
> &
	VariantProps<typeof buttonStyle> & {
		className?: string;
		disableHaptic?: boolean;
	};

const Button = React.forwardRef<
	React.ComponentRef<typeof UIButton>,
	IButtonProps
>(function Button(
	{
		className,
		variant = 'solid',
		size = 'md',
		disableHaptic = false,
		action = 'primary',
		...props
	},
	ref
) {
	return (
		<UIButton
			ref={ref}
			onPress={async (e) => {
				if (!disableHaptic) {
					await hapticFeed();
				}
				props.onPress && props.onPress(e);
			}}
			{...props}
			className={buttonStyle({ variant, size, action, class: className })}
			context={{ variant, size, action }}
		/>
	);
});

type IButtonTextProps = React.ComponentPropsWithoutRef<typeof UIButton.Text> &
	VariantProps<typeof buttonTextStyle> & { className?: string };

const ButtonText = React.forwardRef<
	React.ComponentRef<typeof UIButton.Text>,
	IButtonTextProps
>(function ButtonText({ className, variant, size, action, ...props }, ref) {
	const {
		variant: parentVariant,
		size: parentSize,
		action: parentAction,
	} = useStyleContext(SCOPE);

	return (
		<UIButton.Text
			ref={ref}
			{...props}
			className={buttonTextStyle({
				parentVariants: {
					variant: parentVariant,
					size: parentSize,
					action: parentAction,
				},
				variant,
				size,
				action,
				class: className,
			})}
		/>
	);
});

const ButtonSpinner = UIButton.Spinner;

type IButtonIcon = React.ComponentPropsWithoutRef<typeof UIButton.Icon> &
	VariantProps<typeof buttonIconStyle> & {
		className?: string | undefined;
		as?: React.ElementType;
		height?: number;
		width?: number;
	};

const ButtonIcon = React.forwardRef<
	React.ComponentRef<typeof UIButton.Icon>,
	IButtonIcon
>(function ButtonIcon({ className, size, ...props }, ref) {
	const {
		variant: parentVariant,
		size: parentSize,
		action: parentAction,
	} = useStyleContext(SCOPE);

	if (typeof size === 'number') {
		return (
			<UIButton.Icon
				ref={ref}
				{...props}
				className={buttonIconStyle({ class: className })}
				size={size}
			/>
		);
	} else if (
		(props.height !== undefined || props.width !== undefined) &&
		size === undefined
	) {
		return (
			<UIButton.Icon
				ref={ref}
				{...props}
				className={buttonIconStyle({ class: className })}
			/>
		);
	}
	return (
		<UIButton.Icon
			{...props}
			className={buttonIconStyle({
				parentVariants: {
					size: parentSize,
					variant: parentVariant,
					action: parentAction,
				},
				size,
				class: className,
			})}
			ref={ref}
		/>
	);
});

type IButtonGroupProps = React.ComponentPropsWithoutRef<typeof UIButton.Group> &
	VariantProps<typeof buttonGroupStyle>;

const ButtonGroup = React.forwardRef<
	React.ComponentRef<typeof UIButton.Group>,
	IButtonGroupProps
>(function ButtonGroup(
	{
		className,
		space = 'md',
		isAttached = false,
		flexDirection = 'column',
		...props
	},
	ref
) {
	return (
		<UIButton.Group
			className={buttonGroupStyle({
				class: className,
				space,
				isAttached,
				flexDirection,
			})}
			{...props}
			ref={ref}
		/>
	);
});

Button.displayName = 'Button';
ButtonText.displayName = 'ButtonText';
ButtonSpinner.displayName = 'ButtonSpinner';
ButtonIcon.displayName = 'ButtonIcon';
ButtonGroup.displayName = 'ButtonGroup';

export { Button, ButtonText, ButtonSpinner, ButtonIcon, ButtonGroup };
