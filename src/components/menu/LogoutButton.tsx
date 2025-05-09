import { LogOut } from 'lucide-react-native';
import { Button, ButtonText, Icon } from '../ui';
import { useTheme } from '../layouts/ThemeProvider';
import { cn } from '@/lib/utils';

export const LogoutButton = ({ setOpenLogoutAlertDialog }: any) => {
	const { theme } = useTheme();
	return (
		<Button
			variant="link"
			className={cn(
				' mt-3 h-[3.2rem] flex items-center ',
				theme === 'dark' ? 'bg-black/50' : 'bg-white'
			)}
			onPress={() => {
				setOpenLogoutAlertDialog(true);
			}}>
			<ButtonText size="lg" className="text-error font-normal">
				Logout
			</ButtonText>
			<Icon as={LogOut} size="xs" color={theme === 'dark' ? '#fff' : '#000'} />
		</Button>
	);
};
