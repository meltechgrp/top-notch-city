import React from 'react';
import { NativeScrollEvent } from 'react-native';
import ListedPropertyView from '../listing/ListedPropertyView';
import { Box } from '../ui';

type IProps = {
	profileId: string;
	onScroll: (e: NativeScrollEvent) => any;
	headerHeight: number;
	scrollElRef: any;
	listRef: any;
};
export default function ProfileListingTab(props: IProps) {
	const { profileId, onScroll, headerHeight, scrollElRef, listRef } = props;
	const data: any = [];

	return (
		<Box className="flex-1">
			<ListedPropertyView
				profileId={profileId}
				loading={false}
				properties={data}
				onScroll={onScroll}
				scrollElRef={scrollElRef}
				headerHeight={headerHeight}
				listRef={listRef}
			/>
		</Box>
	);
}
