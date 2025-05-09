import { useLayout } from '@react-native-community/hooks'
import * as React from 'react'
import { View } from 'react-native'

type Props = View['props'] & {
  content: React.ReactNode | ((w: number, h: number) => React.ReactNode)
}
export default function LayoutContainer({ style, content, ...props }: Props) {
  const { width, height, onLayout } = useLayout()
  return (
    <View {...props} onLayout={onLayout} style={style}>
      {typeof content === 'function' ? content(width, height) : content}
    </View>
  )
}
