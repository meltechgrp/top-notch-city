import FoundHorizontalList from '@/components/home/FoundProperties';
import Map from '@/components/location/map';
import { Box, Input, InputField, View } from '@/components/ui';
import { Icon } from '@/components/ui/icon';
import Layout from '@/constants/Layout';
import { Search } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MapScreen() {
	return (
		<Box className="flex-1">
			<SafeAreaView edges={['bottom']} className="flex-1">
				<View className="overflow-hidden flex-1">
					<View className="absolute top-20 w-full  z-10">
						<View className="flex-row gap-2 items-center bg-background-muted max-w-[90vw] mx-auto rounded-xl  p-2 px-4">
							<Icon as={Search} />
							<Input
								size="xl"
								variant="underlined"
								isFocused={false}
								className="flex-1 border-b-0 rounded-none">
								<InputField
									size="sm"
									placeholder="Search address or property "
								/>
							</Input>
						</View>
					</View>
					<View className="absolute bottom-40 z-10">
						<FoundHorizontalList />
					</View>
					<Map
						scrollEnabled={true}
						height={Layout.window.height - 80}
						showUserLocation={true}
					/>
				</View>
			</SafeAreaView>
		</Box>
	);
}
