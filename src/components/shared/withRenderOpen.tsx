import React from 'react';

export default function withRenderVisible<T extends React.ComponentType<any>>(
	Component: T
) {
	return function ({
		visible,
		...props
	}: Omit<React.ComponentProps<T>, 'visible'> & { visible: boolean }) {
		// Set displayName for debugging
		(Component as any).displayName = `withRenderVisible(${
			(Component as any).displayName || (Component as any).name || 'Component'
		})`;

		// Conditionally render the component
		return visible ? (
			<Component {...(props as React.ComponentProps<T>)} />
		) : null;
	};
}
