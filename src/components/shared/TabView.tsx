import Layout from '@/constants/Layout';
import React, { useEffect, useMemo, useRef } from 'react';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import Animated, { runOnJS, useSharedValue } from 'react-native-reanimated';

interface Props {
	activeTab: number;
	scrollEnabled?: boolean;
	onTabSelected?: (tab: number) => void;
	style?: any;
	scrollAnimationDuration?: number;
	mode?: 'parallax' | 'horizontal-stack' | 'vertical-stack';
	children: React.ReactNode;
}
export default function TabView(props: Props) {
	const {
		activeTab,
		onTabSelected,
		children,
		mode,
		scrollAnimationDuration = 400,
	} = props;

	const carouselRef = useRef<ICarouselInstance>(null);

	const filteredChildren = useMemo(
		() => React.Children.toArray(children).filter(Boolean),
		[children]
	);
	const handleSnapToItem = (index: number) => {
		onTabSelected?.(index);
	};

	const progress = useSharedValue<number>(0);
	useEffect(() => {
		carouselRef.current?.scrollTo({
			/**
			 * Calculate the difference between the current index and the target index
			 * to ensure that the carousel scrolls to the nearest index
			 */
			count: activeTab - progress.value,
			animated: true,
		});
	}, [activeTab]);
	return (
		<Carousel
			ref={carouselRef}
			width={Layout.window.width}
			height={Layout.window.height}
			data={filteredChildren}
			mode={mode as any}
			onProgressChange={progress}
			defaultIndex={activeTab}
			scrollAnimationDuration={scrollAnimationDuration}
			pagingEnabled={true}
			snapEnabled={true}
			onSnapToItem={(index) => runOnJS(handleSnapToItem)(index)}
			renderItem={({ item }) => <>{item}</>}
		/>
	);
}
