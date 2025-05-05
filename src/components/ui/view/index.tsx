import { View as V, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {};

export function View({ ...otherProps }: ThemedViewProps) {
	return <V {...otherProps} />;
}
