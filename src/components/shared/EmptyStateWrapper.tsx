import React from 'react';
import EmptyState, { EmptyStateProps } from '@/components/shared/EmptyState';

type Props = EmptyStateProps & {
	children: React.ReactNode;
	isEmpty?: Boolean;
};

export default function EmptyStateWrapper({
	children,
	loading,
	isEmpty,
	refreshControl,
	text,
	cta,
	illustration,
	contentWrapperStyle,
	contentWrapperClassName,
}: Props) {
	// if loading = true, we are yet to determine if data is empty or not
	// so we render children until we can determine this to
	// prevent flashing the empty state
	if (loading) return <>{children}</>;

	if (isEmpty) {
		return (
			<EmptyState
				illustration={illustration}
				text={text}
				cta={cta}
				refreshControl={refreshControl}
				contentWrapperStyle={contentWrapperStyle}
				contentWrapperClassName={contentWrapperClassName}
			/>
		);
	}
	return <>{children}</>;
}
