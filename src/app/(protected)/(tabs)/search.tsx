import FoundHorizontalList from '@/components/home/FoundProperties';
import Map from '@/components/location/map';
import { Input, InputField, Text, View } from '@/components/ui';
import { Search } from 'lucide-react-native';

export default function SearchScreen() {
	return (
		<View className="flex-1">
			<View className="overflow-hidden flex-1">
				<View className=" absolute bottom-40 z-10 justify-between h-[75vh]">
					<View className="flex-row mx-4 gap-2 items-center bg-white rounded-md p-2 px-4">
						<Search color={'black'} size={20} />
						<Input
							size="xl"
							variant="underlined"
							className="flex-1 border-b-0 rounded-none">
							<InputField placeholder="Enter Text here..." />
						</Input>
					</View>
					<FoundHorizontalList />
				</View>
				<Map
					scrollEnabled={false}
					showUserLocation={true}
					user={{ fullName: 'Humphrey' }}
				/>
			</View>
		</View>
	);
}
