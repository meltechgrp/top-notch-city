import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { memo } from 'react';

const ReplyIcon = (props: SvgProps) => (
	<Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
		<Path
			fill="currentColor"
			d="M19.575 18.75v-4c0-.967-.338-1.78-1.013-2.438a3.366 3.366 0 0 0-2.437-.987H5.475L9.5 15.35l-.8.8-5.4-5.4 5.4-5.4.8.8-4.025 4.025h10.65c1.267 0 2.346.445 3.237 1.337.892.892 1.338 1.97 1.338 3.238v4h-1.125Z"
		/>
	</Svg>
);
export default memo(ReplyIcon);
