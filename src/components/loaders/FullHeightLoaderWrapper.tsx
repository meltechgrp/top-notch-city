import { Colors } from '@/constants/Colors';
import { ActivityIndicator, View } from 'react-native';

type Props = View['props'] & {
	loading: boolean;
	children: any;
};

export default function FullHeightLoaderWrapper(props: Props) {
	if (props.loading) {
		return (
			<View
				{...props}
				style={[props.style]}
				className="flex-1 justify-center items-center absolute inset-0 bg-background h-full w-full">
				<ActivityIndicator size="large" color={Colors.primary} />
			</View>
		);
	}
	return props.children;
}
