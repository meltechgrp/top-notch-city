import Layout from '@/constants/Layout'
import * as React from 'react'
import PagerView from 'react-native-pager-view'
import Animated from 'react-native-reanimated'

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView)

interface Props {
  activeTab: number
  children: any
  scrollEnabled?: boolean
  onTabSelected?: (tab: number) => void
  style?: any
}

export default function TabView(props: Props) {
  const {
    activeTab,
    children,
    scrollEnabled = true,
    onTabSelected,
    style,
  } = props
  const pageRef = React.useRef<PagerView>(null)

  const filteredChildren = React.useMemo(() => {
    return React.Children.toArray(children).filter(Boolean)
  }, [children])

  React.useEffect(() => {
    if (pageRef.current) {
      pageRef.current.setPage(activeTab)
    }
  }, [activeTab])
  return (
    <AnimatedPagerView
      ref={pageRef}
      style={[
        {
          flex: 1,
          width: Layout.window.width,
        },
        style,
      ]}
      initialPage={activeTab}
      scrollEnabled={scrollEnabled}
      onPageSelected={(e) => {
        onTabSelected?.(e.nativeEvent.position)
      }}
    >
      {filteredChildren}
    </AnimatedPagerView>
  )
}
