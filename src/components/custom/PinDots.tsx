import { cn } from '@/lib/utils'
import { View } from 'react-native'

export default function PinDots(props: { value: string }) {
  const { value } = props
  return (
    <View className="flex-row justify-center items-center gap-2">
      <View
        className={cn(
          'w-4 h-4 rounded-full bg-background-muted',
          value.length > 0 ? 'bg-background' : null
        )}
      />
      <View
        className={cn(
          'w-4 h-4 rounded-full bg-background-muted',
          value.length > 1 ? 'bg-background' : null
        )}
      />
      <View
        className={cn(
          'w-4 h-4 rounded-full bg-background-muted',
          value.length > 2 ? 'bg-background' : null
        )}
      />
      <View
        className={cn(
          'w-4 h-4 rounded-full bg-background-muted',
          value.length > 3 ? 'bg-background' : null
        )}
      />
    </View>
  )
}
