import {
	Avatar,
	AvatarFallbackText,
	AvatarImage,
	Text,
	View,
} from '@/components/ui';
import React from 'react';
import { TouchableHighlight } from 'react-native';

type Props = {
	location: TopLocation
	onPress: () => void;
};


export default function TopLocation({ location: {state, property_count, photo_url }, onPress }: Props) {

	return (
		<TouchableHighlight onPress={onPress} className="rounded-2xl min-w-40 pr-4 bg-background">
			<View
				className=" p-2 items-center flex-row gap-4">
				<Avatar size="lg">
					<AvatarFallbackText>{state} {state}</AvatarFallbackText>
					<AvatarImage source={{uri: photo_url}} />
				</Avatar>
				<View className='flex-row gap-2'>
					<Text className=" capitalize text-lg">{state}</Text>
					<Text className=" text-center text-xl">({property_count})</Text>
				</View>
			</View>
		</TouchableHighlight>
	);
}
