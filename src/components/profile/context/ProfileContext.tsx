import React from 'react';

export enum ProfileIMenuType {
	connect = 'connect',
	block = 'block',
	report = 'report',
	share = 'share',
	settings = 'settings',
	help = 'help',
	respondConnect = 'respondConnect',
	connections = 'connections',
}
export enum ProfileActionStatus {
	connecting = 'connecting',
	canceling = 'canceling',
	responding = 'responding',
	blocking = 'blocking',
}
export type ProfileContextType = {
	profile: any | undefined;
	isGuest: boolean;
	activeMenus: Set<ProfileIMenuType>;
	refreshing?: boolean;
	actionStatuses: Set<ProfileActionStatus>;
	addMenu: (type: ProfileIMenuType) => void;
	removeMenu: (type: ProfileIMenuType) => void;
	addActionStatus: (type: ProfileActionStatus) => void;
	removeActionStatus: (type: ProfileActionStatus) => void;
	onRefresh?: () => void;
};
export const ProfileContext = React.createContext<ProfileContextType>({
	profile: null,
	isGuest: false,
	refreshing: false,
	activeMenus: new Set<ProfileIMenuType>(),
	actionStatuses: new Set<ProfileActionStatus>(),
	addMenu: (_type: ProfileIMenuType) => {},
	addActionStatus: (_type: ProfileActionStatus) => {},
	removeMenu: (_type: ProfileIMenuType) => {},
	removeActionStatus: (_type: ProfileActionStatus) => {},
});
type IProviderProps = {
	children: React.ReactNode;
} & {
	[key in keyof ProfileContextType]?: ProfileContextType[key];
};
export const ProfileContextProvider = (props: IProviderProps) => {
	const { children, ...rest } = props;
	const [activeMenus, setActiveMenus] = React.useState<Set<ProfileIMenuType>>(
		new Set<ProfileIMenuType>()
	);
	const [actionStatuses, setActionStatuses] = React.useState<
		Set<ProfileActionStatus>
	>(new Set<ProfileActionStatus>());
	const removeMenu = (type: ProfileIMenuType) => {
		activeMenus.delete(type);
		setActiveMenus(new Set(activeMenus));
	};
	const addMenu = (type: ProfileIMenuType) => {
		activeMenus.add(type);
		setActiveMenus(new Set(activeMenus));
	};
	const addActionStatus = (type: ProfileActionStatus) => {
		actionStatuses.add(type);
		setActionStatuses(new Set(actionStatuses));
	};
	const removeActionStatus = (type: ProfileActionStatus) => {
		actionStatuses.delete(type);
		setActionStatuses(new Set(actionStatuses));
	};
	return (
		<ProfileContext.Provider
			value={{
				...((rest || {}) as ProfileContextType),
				activeMenus,
				actionStatuses,
				addMenu,
				removeMenu,
				addActionStatus,
				removeActionStatus,
			}}>
			{children}
		</ProfileContext.Provider>
	);
};
export const ProfileContextConsumer = ProfileContext.Consumer;

export const useProfileContext = () => {
	return React.useContext(ProfileContext);
};
