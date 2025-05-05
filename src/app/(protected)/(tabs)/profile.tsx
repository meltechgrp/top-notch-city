import { Box, Heading, VStack } from '@/components/ui';
import { Stack } from 'expo-router';
import { ScrollView } from 'react-native';
import React from 'react';
import { useTheme } from '@/components/layouts/ThemeProvider';
import { Colors } from '@/constants/Colors';
import { Divider } from '@/components/ui/divider';
import { ProfileCard } from '@/components/settings/ProfileCard';
import { PersonalInfoSection } from '@/components/settings/PersonalInfoSection';
import { SupportSection } from '@/components/settings/SupportSection';
import { LogoutButton } from '@/components/settings/LogoutButton';
import LogoutAlertDialog from '@/components/shared/LogoutAlertDialog';

export default function Profile() {
	// const me = useStore((v) => v.me);
	const { theme } = useTheme();
	const [openLogoutAlertDialog, setOpenLogoutAlertDialog] =
		React.useState(false);

	return (
		<>
			<Stack.Screen
				options={{
					headerTitle: '',
					headerLargeTitle: false,
					headerTitleStyle: { color: theme == 'dark' ? 'white' : 'black' },
					headerStyle: {
						backgroundColor:
							theme == 'dark'
								? Colors.light.background
								: Colors.dark.background,
					},
				}}
			/>
			<Box className="flex-1">
				<ScrollView style={{ display: 'flex' }}>
					<VStack className="px-5 py-4 flex-1" space="lg">
						<Heading size="2xl" className="mb-1">
							Profile
						</Heading>
						<ProfileCard />
						<Divider className="my-2" />
						<PersonalInfoSection />
						{/* <Divider className="my-2" />
						<HostingSection /> */}
						<Divider className="my-2" />
						<SupportSection />
						<Divider className="my-2" />
						<LogoutButton
							openLogoutAlertDialog={openLogoutAlertDialog}
							setOpenLogoutAlertDialog={setOpenLogoutAlertDialog}
						/>
					</VStack>
					<LogoutAlertDialog
						setOpenLogoutAlertDialog={setOpenLogoutAlertDialog}
						openLogoutAlertDialog={openLogoutAlertDialog}
					/>
				</ScrollView>
			</Box>
		</>
	);
}
