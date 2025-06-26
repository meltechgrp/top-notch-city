import * as React from 'react';
import Svg, {
	G,
	Path,
	Defs,
	LinearGradient,
	Stop,
	ClipPath,
	Rect,
	SvgProps,
} from 'react-native-svg';
const FacebookIcon = (props: SvgProps) => (
	<Svg width={19} height={19} viewBox="0 0 19 19" fill="none" {...props}>
		<G clipPath="url(#clip0_1130_260)">
			<Path
				d="M8.015 18.6368C3.74 17.8718 0.5 14.1818 0.5 9.72681C0.5 4.77681 4.55 0.726807 9.5 0.726807C14.45 0.726807 18.5 4.77681 18.5 9.72681C18.5 14.1818 15.26 17.8718 10.985 18.6368L10.49 18.2318H8.51L8.015 18.6368Z"
				fill="url(#paint0_linear_1130_260)"
			/>
			<Path
				d="M13.0101 12.2468L13.4151 9.72682H11.0301V7.97182C11.0301 7.25182 11.3001 6.71182 12.3801 6.71182H13.5501V4.41682C12.9201 4.32682 12.2001 4.23682 11.5701 4.23682C9.50006 4.23682 8.06006 5.49682 8.06006 7.74682V9.72682H5.81006V12.2468H8.06006V18.5918C8.55506 18.6818 9.05006 18.7268 9.54506 18.7268C10.0401 18.7268 10.5351 18.6818 11.0301 18.5918V12.2468H13.0101Z"
				fill="white"
			/>
		</G>
		<Defs>
			<LinearGradient
				id="paint0_linear_1130_260"
				x1={9.50045}
				y1={18.1008}
				x2={9.50045}
				y2={0.723491}
				gradientUnits="userSpaceOnUse">
				<Stop stopColor="#0062E0" />
				<Stop offset={1} stopColor="#19AFFF" />
			</LinearGradient>
			<ClipPath id="clip0_1130_260">
				<Rect
					width={18}
					height={18}
					fill="white"
					transform="translate(0.5 0.726807)"
				/>
			</ClipPath>
		</Defs>
	</Svg>
);
export default FacebookIcon;
