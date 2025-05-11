import { LogOut } from 'lucide-react-native';
import { Button, ButtonText, Icon } from '../ui';
import { cn } from '@/lib/utils';

export const LogoutButton = ({ setOpenLogoutAlertDialog }: any) => {
	return (
		<Button
			variant="link"
			className={cn(' mt-3 h-[3.2rem] flex bg-background-info items-center ')}
			onPress={() => {
				setOpenLogoutAlertDialog(true);
			}}>
			<ButtonText size="lg" className="text-error font-normal">
				Logout
			</ButtonText>
			<Icon as={LogOut} size="xs" />
		</Button>
	);
};
