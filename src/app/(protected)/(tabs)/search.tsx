import FoundHorizontalList from '@/components/home/FoundProperties';
import Map from '@/components/location/map';
import { Input, InputField, Text, View } from '@/components/ui';
import { Search } from 'lucide-react-native';

export default function SearchScreen() {
	return (
		<View className="flex-1">
			<View className="overflow-hidden flex-1">
				<View className="absolute top-20 w-full  z-10">
					<View className="flex-row gap-2 items-center bg-white max-w-[90vw] mx-auto rounded-xl  p-2 px-4">
						<Search color={'black'} size={20} />
						<Input
							size="xl"
							variant="underlined"
							isFocused={false}
							className="flex-1 border-b-0 rounded-none">
							<InputField size="sm" placeholder="Search address or property " />
						</Input>
					</View>
				</View>
				<View className="absolute bottom-40 z-10">
					<FoundHorizontalList />
				</View>
				<Map
					scrollEnabled={true}
					showUserLocation={true}
					user={{ fullName: 'Humphrey' }}
				/>
			</View>
		</View>
	);
}
