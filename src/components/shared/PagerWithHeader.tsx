import { useNonReactiveCallback } from '@/hooks/useNonReactiveCallback';

import React, { useEffect, useState } from 'react';
import {
	LayoutChangeEvent,
	NativeScrollEvent,
	ScrollView,
	View,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import PagerView, {
	PageScrollStateChangedNativeEvent,
	PagerViewOnPageScrollEvent,
	PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view';
import Animated, {
	AnimatedRef,
	useSharedValue,
	scrollTo,
	runOnUI,
	runOnJS,
	useAnimatedStyle,
	useAnimatedRef,
} from 'react-native-reanimated';

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

export interface PagerWithHeaderChildParams {
	headerHeight: number;
	isFocused: boolean;
	scrollElRef: React.MutableRefObject<FlatList | ScrollView | null>;
	onScroll: (e: NativeScrollEvent) => void;
}

export interface PagerWithHeaderTabBarProps {
	currentPage: number;
	onTabChange: (index: number) => void;
}

export interface PagerWithHeaderProps {
	children:
		| (((props: PagerWithHeaderChildParams) => JSX.Element) | null)[]
		| ((props: PagerWithHeaderChildParams) => JSX.Element);
	isHeaderReady: boolean;
	renderHeader?: () => JSX.Element;
	renderTabBar?: (props: PagerWithHeaderTabBarProps) => JSX.Element | null;
	initialPage?: number;
	onPageSelected?: (index: number) => void;
	onCurrentPageSelected: (index: number) => void;
}

export default function PagerWithHeader({
	children,
	isHeaderReady,
	renderHeader,
	renderTabBar,
	initialPage,
	onPageSelected,
	onCurrentPageSelected,
}: PagerWithHeaderProps) {
	const [currentPage, setCurrentPage] = React.useState(0);
	const [headerOnlyHeight, setHeaderOnlyHeight] = React.useState(0);
	const [tabBarHeight, setTabBarHeight] = React.useState(0);
	const headerHeight = headerOnlyHeight + tabBarHeight;
	const scrollY = useSharedValue(0);

	const pagerViewRef = React.useRef<PagerView>(null);
	const scrollState = React.useRef('');
	const lastOffset = React.useRef(0);
	const lastDirection = React.useRef(0);

	// capture the tab bar sizing
	const onTabBarLayout = React.useCallback(
		(evt: LayoutChangeEvent) => {
			const height = evt.nativeEvent.layout.height;
			if (height > 0) {
				// The rounding is necessary to prevent jumps on iOS
				setTabBarHeight(Math.round(height));
			}
		},
		[setTabBarHeight]
	);

	// capture the header sizing
	const onHeaderOnlyLayout = React.useCallback(
		(evt: LayoutChangeEvent) => {
			const height = evt.nativeEvent.layout.height;
			if (height > 0) {
				// The rounding is necessary to prevent jumps on iOS
				setHeaderOnlyHeight(Math.round(height));
			}
		},
		[setHeaderOnlyHeight]
	);

	const renderTabBarWithHeader = React.useCallback(() => {
		const headerTransform = useAnimatedStyle(() => ({
			transform: [
				{
					translateY: Math.min(
						Math.min(scrollY.value, headerOnlyHeight) * -1,
						0
					),
				},
			],
		}));

		return (
			<Animated.View
				pointerEvents="box-none"
				style={[
					headerTransform,
					{ position: 'absolute', zIndex: 50, width: '100%' },
				]}>
				<View onLayout={onHeaderOnlyLayout} pointerEvents="box-none">
					{renderHeader?.()}
				</View>
				<View
					onLayout={onTabBarLayout}
					style={{
						// Render it immediately to measure it early since its size doesn't depend on the content.
						// However, keep it invisible until the header above stabilizes in order to prevent jumps.
						opacity: isHeaderReady ? 1 : 0,
						pointerEvents: isHeaderReady ? 'auto' : 'none',
					}}>
					{renderTabBar?.({
						currentPage,
						onTabChange: (index) => {
							if (index === currentPage) {
								onCurrentPageSelected(index);
							}
							onTabBarSelect(index);
						},
					})}
				</View>
			</Animated.View>
		);
	}, [
		onHeaderOnlyLayout,
		renderHeader,
		onTabBarLayout,
		renderTabBar,
		currentPage,
		onCurrentPageSelected,
		scrollY,
		headerOnlyHeight,
	]);

	const scrollRefs = useSharedValue<AnimatedRef<any>[]>([]);
	const registerRef = React.useCallback(
		(scrollRef: AnimatedRef<any> | null, atIndex: number) => {
			scrollRefs.modify((refs) => {
				'worklet';
				refs[atIndex] = scrollRef;
				return refs;
			});
		},
		[scrollRefs]
	);

	const lastForcedScrollY = useSharedValue(0);
	const adjustScrollForOtherPages = () => {
		'worklet';
		const currentScrollY = scrollY.value;
		const forcedScrollY = Math.min(currentScrollY, headerOnlyHeight);
		if (lastForcedScrollY.value !== forcedScrollY) {
			lastForcedScrollY.value = forcedScrollY;
			const refs = scrollRefs.value;
			for (let i = 0; i < refs.length; i++) {
				if (i !== currentPage && refs[i] != null) {
					scrollTo(refs[i], 0, forcedScrollY, false);
				}
			}
		}
	};

	const throttleTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(
		null
	);
	const queueThrottledOnScroll = useNonReactiveCallback(() => {
		if (!throttleTimeout.current) {
			throttleTimeout.current = setTimeout(() => {
				throttleTimeout.current = null;
				runOnUI(adjustScrollForOtherPages)();
			}, 80 /* Sync often enough you're unlikely to catch it unsynced */);
		}
	});

	const onScrollWorklet = React.useCallback(
		(e: NativeScrollEvent) => {
			'worklet';
			const nextScrollY = e.contentOffset.y;
			scrollY.value = nextScrollY;
			runOnJS(queueThrottledOnScroll)();
		},
		[scrollY, queueThrottledOnScroll]
	);

	const onPageSelectedInner = React.useCallback(
		(e: PagerViewOnPageSelectedEvent) => {
			setCurrentPage(e.nativeEvent.position);
			onPageSelected?.(e.nativeEvent.position);
		},
		[onPageSelected, setCurrentPage]
	);

	React.useEffect(() => {
		if (pagerViewRef.current) {
			pagerViewRef.current.setPage(currentPage);
		}
	}, [currentPage]);

	const onTabBarSelect = React.useCallback((index: number) => {
		pagerViewRef?.current?.setPage(index);
	}, []);

	const onPageSelecting = React.useCallback((index: number) => {
		setCurrentPage(index);
	}, []);

	const handlePageScrollStateChanged = React.useCallback(
		(e: PageScrollStateChangedNativeEvent) => {
			scrollState.current = e.nativeEvent.pageScrollState;
			// onPageScrollStateChanged?.(e.nativeEvent.pageScrollState)
		},
		[
			scrollState,
			// onPageScrollStateChanged
		]
	);

	const onPageScroll = React.useCallback(
		(e: PagerViewOnPageScrollEvent) => {
			const { position, offset } = e.nativeEvent;
			if (offset === 0) {
				// offset hits 0 in some awkward spots so we ignore it
				return;
			}
			// NOTE
			// we want to call `onPageSelecting` as soon as the scroll-gesture
			// enters the "settling" phase, which means the user has released it
			// we can't infer directionality from the scroll information, so we
			// track the offset changes. if the offset delta is consistent with
			// the existing direction during the settling phase, we can say for
			// certain where it's going and can fire
			// -prf
			if (scrollState.current === 'settling') {
				if (lastDirection.current === -1 && offset < lastOffset.current) {
					onPageSelecting?.(position);
					setCurrentPage(position);
					lastDirection.current = 0;
				} else if (lastDirection.current === 1 && offset > lastOffset.current) {
					onPageSelecting?.(position + 1);
					setCurrentPage(position + 1);
					lastDirection.current = 0;
				}
			} else {
				if (offset < lastOffset.current) {
					lastDirection.current = -1;
				} else if (offset > lastOffset.current) {
					lastDirection.current = 1;
				}
			}
			lastOffset.current = offset;
		},
		[lastOffset, lastDirection, onPageSelecting]
	);

	return (
		<View style={{ flex: 1 }}>
			{renderTabBarWithHeader()}
			<AnimatedPagerView
				initialPage={initialPage}
				onPageSelected={onPageSelectedInner}
				onPageScrollStateChanged={handlePageScrollStateChanged}
				onPageScroll={onPageScroll}
				ref={pagerViewRef}
				style={{ flex: 1 }}>
				{toArray(children)
					.filter(Boolean)
					.map((child, i) => {
						const isReady =
							isHeaderReady && headerOnlyHeight > 0 && tabBarHeight > 0;

						return (
							<View style={{ flex: 1 }} key={i} collapsable={false}>
								<PagerItem
									renderTab={child}
									onScrollWorklet={i === currentPage ? onScrollWorklet : noop}
									headerHeight={headerHeight}
									index={i}
									isFocused={i === currentPage}
									isReady={isReady}
									registerRef={registerRef}
								/>
							</View>
						);
					})}
			</AnimatedPagerView>
		</View>
	);
}

function noop() {
	'worklet';
}

function PagerItem({
	headerHeight,
	index,
	isReady,
	isFocused,
	onScrollWorklet,
	renderTab,
	registerRef,
}: {
	headerHeight: number;
	index: number;
	isFocused: boolean;
	isReady: boolean;
	registerRef: (scrollRef: AnimatedRef<any> | null, atIndex: number) => void;
	onScrollWorklet: (e: NativeScrollEvent) => void;
	renderTab: ((props: PagerWithHeaderChildParams) => JSX.Element) | null;
}) {
	const scrollElRef = useAnimatedRef();

	React.useEffect(() => {
		registerRef(scrollElRef, index);
		return () => {
			registerRef(null, index);
		};
	}, [scrollElRef, registerRef, index]);

	const [hasRendered, setHasRendered] = useState(false);

	useEffect(() => {
		if (!isFocused) {
			return;
		} else {
			if (hasRendered) return;

			setHasRendered(true);
		}
	}, [isFocused]);

	if (!isReady || renderTab == null) {
		return null;
	}

	if (!hasRendered) {
		return null;
	}

	return (
		<View style={{ flex: 1 }}>
			{renderTab({
				headerHeight,
				isFocused,
				scrollElRef: scrollElRef as React.MutableRefObject<
					FlatList | ScrollView | null
				>,
				onScroll: onScrollWorklet,
			})}
		</View>
	);
}

function toArray<T>(v: T | T[]): T[] {
	if (Array.isArray(v)) {
		return v;
	}
	return [v];
}
