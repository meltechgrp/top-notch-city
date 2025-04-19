import { BodyScrollView } from '@/components/layouts/BodyScrollView';
import { Text, View } from '@/components/ui';

export default function Property3DView() {
	return (
		<BodyScrollView
			contentContainerStyle={{
				padding: 16,
				paddingBottom: 100,
			}}>
			<View className="items-center mb-8 gap-2">
				<Text size="xl" className="items-center">
					3D View
				</Text>
			</View>
		</BodyScrollView>
	);
}
