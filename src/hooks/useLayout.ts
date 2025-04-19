import { View } from '@/components/ui';
import { useState, ComponentProps } from 'react';

export default function useLayout() {
	const [layout, setLayout] = useState({
		width: 0,
		height: 0,
	});
	const onLayout: ComponentProps<typeof View>['onLayout'] = ({
		nativeEvent,
	}) => {
		setLayout(nativeEvent.layout);
	};
	return [layout, onLayout] as const;
}
