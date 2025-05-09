import ConnectionListItem from '@/components/contents/ConnectionListItem';
import { cn } from '@/lib/utils';

import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { useMemo, useState } from 'react';
import {
	ActivityIndicator,
	Pressable,
	RefreshControl,
	View,
} from 'react-native';
import { Input, InputField, Text } from '../ui';
import BottomSheet from '../shared/BottomSheet';

type Props = {
	title?: string;
	visible: boolean;
	HeaderComponent?: any;
	withHeaderRightComponent?: boolean;
	groupId?: string;

	onDismiss: () => void;
	onSelect?: (member: any) => void;
	onConfirm?: (members: string[]) => void;
	RightComponent?: (connection: any, seleted?: boolean) => any;
};
export default function ConnectionsListSelectBottomSheet(props: Props) {
	const {
		onDismiss,
		onConfirm,
		groupId,
		visible,
		HeaderComponent,
		withHeaderRightComponent,
		title,
		RightComponent,
		onSelect,
	} = props;
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = React.useState('');
	async function refetch() {}
	const [selected, setSelected] = React.useState<string[]>([]);
	// const { data, refetch, loading, error } = useMyConnectionsQuery({
	//   variables: {
	//     ...((groupId ? { groupId } : {}) as any),
	//     filters: {
	//       page: 1,
	//       text: '',
	//     },
	//   },
	//   skip: !visible,
	//   fetchPolicy: 'cache-and-network',
	// })

	const connections = useMemo(() => {
		// if (data) {
		//   return data.myConnections
		// }
		return [];
	}, []);
	return (
		<BottomSheet
			visible={visible}
			onDismiss={onDismiss}
			withHeader
			title={title || 'Connections'}
			withBackButton
			snapPoint="90%"
			HeaderRightComponent={
				withHeaderRightComponent ? (
					<Pressable
						onPress={() => {
							onConfirm && onConfirm(selected);
							onDismiss();
						}}
						className="px-4 h-6 justify-center"
						disabled={selected.length === 0}>
						<Text
							className={cn('text-base', selected.length && 'text-primary')}>
							Add
						</Text>
					</Pressable>
				) : null
			}>
			<View className="pt-6 flex-1">
				{HeaderComponent}

				<View className="flex-1 pt-4">
					<BottomSheetFlatList
						refreshControl={
							<RefreshControl
								refreshing={loading}
								onRefresh={() => {
									refetch();
								}}
							/>
						}
						data={connections}
						// keyExtractor={(item, index) => item.id}
						ListEmptyComponent={
							<View className="pt-8 items-center">
								{loading ? (
									<ActivityIndicator size="large" color="#000" />
								) : (
									<Text>No connection found</Text>
								)}
							</View>
						}
						renderItem={({ item }) => (
							<ConnectionListItem
								connection={item}
								onSelect={(member) => {
									if (onSelect) {
										onSelect(member);
										onDismiss();
										return;
									}
									if (selected.includes(member.id)) {
										setSelected(selected.filter((c) => c !== member.id));
									} else {
										setSelected([...selected, member.id]);
									}
								}}
								RightComponent={(member) =>
									RightComponent &&
									RightComponent(item, selected.includes(member.id))
								}
							/>
						)}
					/>
				</View>
			</View>
		</BottomSheet>
	);
}
