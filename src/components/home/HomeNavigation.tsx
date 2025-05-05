import { Bell } from 'lucide-react-native';
import { Button, View } from '../ui';
import MobileModeChangeButton from '../shared/MobileModeChangeButton';
import { Icon } from '../ui/icon/index.web';
import { useTheme } from '../layouts/ThemeProvider';

export default function HomeNavigation() {
	const { theme } = useTheme();
	return (
		<View className="flex-row justify-end items-center px-4">
			<View className="flex-row gap-4">
				<Button action="secondary" className="rounded-full p-2">
					<Icon
						size={'xl'}
						as={Bell}
						className={`${theme === 'light' ? 'text-dark' : 'text-white'} fill-typography`}
					/>
				</Button>
				<MobileModeChangeButton />
			</View>
		</View>
	);
}
