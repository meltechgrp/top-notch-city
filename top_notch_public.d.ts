declare module '*.svg' {
	import { SvgProps } from 'react-native-svg';
	const content: React.FC<SvgProps>;
	export default content;
}
declare module '*.png' {
	const value: ImageSourcePropType;
	export default value;
}
declare module '*.jpg' {
	const value: ImageSourcePropType;
	export default value;
}

type OptionType<T extends Record<string, any> = {}> = {
	label: string;
	value: any;
	[x: string]: any;
} & T;

interface ActionResponse<T> {
	fieldError?: Partial<Record<keyof T, string | undefined>>;
	formError?: string;
	data?: any;
}

type SnackBarOption = {
	message: string;
	type: 'success' | 'error' | 'info' | 'warning';
	duration?: number;
	icon?: React.ReactNode;
	backdrop?: boolean;
};
