import SearchHistory from '@/components/search/SearchHistory';
import { router } from 'expo-router';
import { View } from 'react-native';

type SearchHistoryScreenProps = {
	service?: any;
};

export default function SearchHistoryScreen(props: SearchHistoryScreenProps) {
	function search(keyword: string, service?: any) {
		router.navigate(
			`/search?q=${keyword}${service ? `&service=${service}` : ''}`
		);
	}
	return (
		<View className="flex-1 w-full py-6 bg-gray-50">
			<SearchHistory
				setSearchText={(keyword, service) => search(keyword, service)}
				service={props.service}
			/>
			{/* <Trending onSelectKeyword={(keyword) => search(keyword)} /> */}
		</View>
	);
}
