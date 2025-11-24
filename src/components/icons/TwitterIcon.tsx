import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const TwitterIcon = (props: SvgProps) => (
  <Svg
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon icon-tabler icons-tabler-outline icon-tabler-brand-x"
    {...props}
  >
    <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <Path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <Path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </Svg>
);
export default React.memo(TwitterIcon);
