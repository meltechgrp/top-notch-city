import { Button, ButtonText } from '../ui';

export const LogoutButton = ({ setOpenLogoutAlertDialog }: any) => {
	return (
		<Button
			action="positive"
			variant="outline"
			onPress={() => {
				setOpenLogoutAlertDialog(true);
			}}>
			<ButtonText>Logout</ButtonText>
		</Button>
	);
};
