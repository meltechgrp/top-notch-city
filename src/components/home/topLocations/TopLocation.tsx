import {
	Image,
	Text,
	View,
} from '@/components/ui';
import React from 'react';
import { TouchableOpacity } from 'react-native';

type Props = {
	location: TopLocation
	onPress: () => void;
};


export default function TopLocation({ location: {state, property_count, photo_url }, onPress }: Props) {

	return (
		<TouchableOpacity
              key={state}
			  onPress={onPress}
              className="relative rounded-lg w-[245px] md:w-[260px] lg:w-[310px] overflow-hidden h-48 flex-1"
            >
              <Image
                source={{ uri: photo_url }}
                className="w-full h-48"
                alt={state}
                resizeMode="cover"
              />
              <View className="absolute inset-0 bg-black/40 to-transparent flex justify-end p-4">
                <Text className="text-white text-2xl font-bold">
                  {state}
                </Text>
                <Text className="text-gray-200 text-base">
                  {property_count} Properties
                </Text>
              </View>
            </TouchableOpacity>
	);
}
