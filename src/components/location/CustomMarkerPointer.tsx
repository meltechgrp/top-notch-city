import { View } from 'react-native';
import { Image } from '../ui';

export default function CustomMarkerPointer({ image }: { image: any }) {
	return (
		<View className="items-center relative">
			{/* Marker bubble with image */}
			<View className="w-14 h-14 z-40 rounded-full border-[3px] border-[#FAA30E] bg-white overflow-hidden">
				<Image
					source={image}
					alt={'marker'}
					className="w-full h-full"
					resizeMode="cover"
				/>
			</View>

			{/* Cone Pointer */}
			<View
				style={{
					width: 0,
					height: 0,
					borderLeftWidth: 12,
					borderRightWidth: 12,
					borderTopWidth: 14,
					borderLeftColor: 'transparent',
					borderRightColor: 'transparent',
					borderTopColor: '#FAA30E',
					marginTop: -3,
					zIndex: 5,
				}}
			/>

			{/* Shadow Circle */}
			<View className=" absolute -bottom-1 w-4 h-4 rounded-full bg-black/80 opacity-50 z-0" />
			<View className=" absolute -bottom-3 w-8 h-8 rounded-full bg-black/40 opacity-50 z-[2]" />
		</View>
	);
}
