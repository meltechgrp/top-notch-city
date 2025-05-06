import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import { createRef } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
type Props = {
	children: React.ReactNode;
	zoomEnabled?: boolean;
	style?: StyleProp<ViewStyle>;
	onZoom?: (zoomLevel: number) => void;
	className?: string;
	onSlideDown?: () => void;
	setBackgroundColorVisibility: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function ZoomView(props: Props) {
	const zoomableViewRef = createRef<ReactNativeZoomableView>();
	function resetZoom() {
		zoomableViewRef.current?.zoomTo(1);
		props.onZoom && props.onZoom(1);
	}
	return (
		<ReactNativeZoomableView
			maxZoom={4}
			minZoom={1}
			zoomStep={0.5}
			initialZoom={1}
			bindToBorders={true}
			ref={zoomableViewRef}
			onPanResponderMove={(_, gestureState, zoomableViewEventObject) => {
				(gestureState.moveY >= 470 || gestureState.moveY <= 300) &&
				zoomableViewEventObject.zoomLevel < 1.3
					? props.setBackgroundColorVisibility!(false)
					: props.setBackgroundColorVisibility!(true);
				return false;
			}}
			onPanResponderEnd={() => props.setBackgroundColorVisibility!(true)}
			onShiftingEnd={(_, gestureState, zoomableViewEventObject) => {
				(gestureState.moveY >= 500 || gestureState.moveY <= 200) &&
					zoomableViewEventObject.zoomLevel < 1.3 &&
					props.onSlideDown!();
			}}
			onTransform={(ev) => {
				props.onZoom && props.onZoom(ev.zoomLevel);
			}}
			onZoomEnd={(_, _a, event) => {
				if (event.zoomLevel < 1.3) {
					resetZoom();
					resetZoom();
				}
			}}
			style={props.style}
			// className={props.className}
		>
			{props.children}
		</ReactNativeZoomableView>
	);
}
