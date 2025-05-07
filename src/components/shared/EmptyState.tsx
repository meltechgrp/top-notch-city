import { cn } from '@/lib/utils';

import React from 'react';
import { RefreshControlProps, ScrollView, View as V } from 'react-native';
import { Text, View } from '../ui';

export type EmptyStateProps = {
	/**
	 * If content is still loading, we can use this to prevent
	 * showing empty state until loading is done
	 */
	loading?: boolean;
	/**
	 * Component to show when loading prop = true
	 */
	LoadingComponent?: React.ReactNode;
	illustration: React.ReactNode;
	text?: React.ReactNode;
	cta?: React.ReactNode;
	refreshControl?: React.ReactElement<
		RefreshControlProps,
		string | React.JSXElementConstructor<any>
	>;
	/**
	 * Style for View that wraps the empty state content(icon and text).
	 * Use this to vertically and horizontally re-align the content
	 */
	contentWrapperStyle?: V['props']['style'];
	contentWrapperClassName?: string;
};

export default function EmptyState({
	loading,
	LoadingComponent,
	illustration,
	text,
	cta,
	refreshControl,
	contentWrapperStyle,
	contentWrapperClassName,
}: EmptyStateProps) {
	if (loading) return LoadingComponent || null;

	return (
		<ScrollView
			keyboardShouldPersistTaps={'always'}
			contentContainerClassName="flex-1 items-center justify-center gap-3"
			refreshControl={refreshControl}>
			<View
				style={[contentWrapperStyle]}
				className={cn('items-center gap-3', contentWrapperClassName)}>
				{illustration}
				{React.isValidElement(text) ? (
					text
				) : (
					<Text className="text-typography/80 text-sm text-center">{text}</Text>
				)}
				{cta ? cta : null}
			</View>
		</ScrollView>
	);
}
