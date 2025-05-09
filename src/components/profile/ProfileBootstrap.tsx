import SimpleMenu from '@/components/menu/SimpleMenu';
// import ReportBottomSheet from '@/components/modals/ReportBottomSheet'
import {
	ProfileIMenuType,
	useProfileContext,
	ProfileActionStatus,
} from '@/components/profile/context/ProfileContext';
import eventBus from '@/lib/eventBus';
import { Blocks, FlagIcon } from 'lucide-react-native';
import { useEffect } from 'react';

export default function ProfileBootstrap() {
	const {
		activeMenus,
		addMenu,
		removeActionStatus,
		removeMenu,
		profile,
		onRefresh,
		addActionStatus,
	} = useProfileContext();
	const profileId = profile?.user?.id as string;
	const onBlockUser = () => {
		addActionStatus?.(ProfileActionStatus.blocking);
		// blockUser()
	};
	useEffect(() => {
		eventBus.addEventListener('BLOCK_USER', onBlockUser);
		return () => {
			eventBus.removeEventListener('BLOCK_USER', onBlockUser);
		};
	}, []);
	return (
		<>
			<SimpleMenu
				title="Profile settings"
				visible={activeMenus.has(ProfileIMenuType.settings)}
				onDismiss={() => removeMenu(ProfileIMenuType.settings)}
				onChange={(option) => {
					switch (option.value) {
						case 'block':
							onBlockUser();
							break;
						case 'report':
							addMenu(ProfileIMenuType.report);
							break;
						default:
							addMenu(ProfileIMenuType.settings);
							break;
					}
					removeMenu(ProfileIMenuType.settings);
				}}
				options={[
					{
						label: 'Block',
						value: 'block',
						icon: Blocks,
					},
					{
						label: 'Report',
						value: 'report',
						icon: FlagIcon,
					},
				]}
			/>
			{/* <ReportBottomSheet
        visible={activeMenus.has(ProfileIMenuType.report)}
        onDismiss={() => removeMenu(ProfileIMenuType.report)}
        title="Report profile"
        description="Please provide a reason for reporting this profile"
        data={{ profileId }}
        referenceType={ReportReferenceType.Profile}
        referenceId={profileId}
      /> */}
		</>
	);
}
