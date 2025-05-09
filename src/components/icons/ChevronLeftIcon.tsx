import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'
import { memo } from 'react'

const ChevronLeftIcon = (props: SvgProps) => (
  <Svg width={13} height={21} fill="none" viewBox="0 0 13 21" {...props}>
    <Path
      fill="currentColor"
      d="M.779 10.892c0 .393.146.73.46 1.022l8.738 8.557c.247.247.561.382.932.382.74 0 1.336-.584 1.336-1.336 0-.371-.157-.697-.404-.955l-7.873-7.67 7.873-7.67c.247-.26.404-.596.404-.955 0-.753-.595-1.337-1.336-1.337-.37 0-.685.135-.932.382L1.239 9.858c-.314.304-.46.64-.46 1.034Z"
    />
  </Svg>
)

export default memo(ChevronLeftIcon)
