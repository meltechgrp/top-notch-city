// import { MyConnectionsQuery } from '@/graphql-types/queries.gql'
import { fullName } from '@/lib/utils';
import React from 'react';
import { Pressable, View } from 'react-native';
import { Avatar, AvatarFallbackText, AvatarImage, Text } from '../ui';

type Props = {
	connection: any;
	onSelect?: (member: any) => void;
	RightComponent?: (member: any) => any;
};
export default function ConnectionListItem(props: Props) {
	const { connection, onSelect, RightComponent } = props;
	const { user } = connection;

	return (
		<Pressable
			className="active:bg-black-900/05 py-2 flex-row items-center px-4"
			onPress={() => {
				if (connection.isMember) return;
				onSelect && onSelect(user);
			}}>
			<Avatar className="bg-background-muted w-20 h-20">
				<AvatarFallbackText>Humphrey Joshua</AvatarFallbackText>
				<AvatarImage
					source={{
						uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
					}}
				/>
			</Avatar>
			<View className="flex-1 pl-4">
				<View className="flex-row items-center">
					<Text className="text-sm text-black-900">{fullName(user)}</Text>
				</View>
				<Text className="text-xs text-gray-600">@{user.username}</Text>
			</View>
			{RightComponent && RightComponent(user)}
		</Pressable>
	);
}
