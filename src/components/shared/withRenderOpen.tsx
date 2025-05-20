import React from 'react';

export default function withRenderVisible<T extends React.ComponentType<any>>(
	Component: T
) {
	return function ({ ...props }: React.ComponentProps<T>) {
		// Set displayName for debugging
		(Component as any).displayName = `withRenderVisible(${
			(Component as any).displayName || (Component as any).name || 'Component'
		})`;

		// Conditionally render the component
		return <Component {...(props as React.ComponentProps<T>)} />;
	};
}
