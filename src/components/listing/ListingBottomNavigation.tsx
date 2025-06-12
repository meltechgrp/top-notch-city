import { Button, ButtonText, Icon, Text, useResolvedTheme, View } from '../ui';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Upload } from 'lucide-react-native';
import { cn, showSnackbar } from '@/lib/utils';
import { Platform } from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { Colors } from '@/constants/Colors';
import { Listing } from '@/store';

type Props = {
	step: number;
	listing: Listing;
	onUpdate: (step: number, back?: boolean) => void;
	uploaHandler: () => Promise<any>;
};

export default function ListingBottomNavigation({
	step,
	listing,
	onUpdate,
	uploaHandler,
}: Props) {
	const colorSchemeName = useResolvedTheme();
	async function handleUpload() {
		if (listing.step == 6 && !listing?.title)
			return showSnackbar({
				message: 'Please enter property title!',
				type: 'warning',
			});
		if (listing.step == 6 && !listing?.price)
			return showSnackbar({
				message: 'Please enter property price!',
				type: 'warning',
			});
		await uploaHandler();
	}
	React.useEffect(() => {
		if (Platform.OS == 'android') {
			SystemNavigationBar.setNavigationColor(
				colorSchemeName == 'dark'
					? Colors.light.background
					: Colors.dark.background
			);
		}
	}, [colorSchemeName]);
	return (
		<View className={cn(' fixed bottom-0 z-50 left-0 right-0')}>
			<SafeAreaView edges={['bottom']} className="bg-background">
				<View className=" flex-row backdrop-blur-sm bg-background border-t h-20 border-outline px-4  justify-center items-center">
					<Button
						onPress={() => onUpdate(step - 1, true)}
						size="xl"
						disabled={step == 1}
						className={cn(
							'mr-auto gap-1 px-4 bg-gray-500',
							step == 1 && 'opacity-0'
						)}>
						<Icon as={ChevronLeft} className="mr-2" />
						<Text>Back</Text>
					</Button>
					{step == 6 ? (
						<Button
							size="xl"
							className="px-6"
							onPress={async () => await handleUpload()}>
							<ButtonText>Upload</ButtonText>
							<Icon size="sm" as={Upload} color="white" />
						</Button>
					) : (
						<Button
							size="xl"
							className={cn('px-6')}
							onPress={() => onUpdate(step + 1)}>
							<ButtonText>Next</ButtonText>
							<Icon size="sm" as={ChevronRight} color="white" />
						</Button>
					)}
				</View>
			</SafeAreaView>
		</View>
	);
}
