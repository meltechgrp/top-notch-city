import React from 'react';
import { Button } from '@/components/ui';
import { Moon, Sun } from 'lucide-react-native';
import { Icon } from '../ui/icon';
import { useTheme } from '../layouts/ThemeProvider';

const MobileModeChangeButton = () => {
	const { theme, toggleTheme } = useTheme();
	return (
		<Button
			onPress={toggleTheme}
			action="secondary"
			className="rounded-full p-2">
			<Icon
				size={'xl'}
				as={theme === 'light' ? Moon : Sun}
				className={`${theme === 'light' ? 'text-dark' : 'text-white'} fill-typography`}
			/>
		</Button>
	);
};

export default MobileModeChangeButton;
