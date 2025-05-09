import React from 'react'
import { View } from 'react-native'
import { Skeleton } from 'moti/skeleton'

import { MotiView } from 'moti'
import { useLayout } from '@react-native-community/hooks'

export default function ProfileSkeleton() {
  const { width, onLayout } = useLayout()

  return (
    <MotiView
      transition={{
        type: 'timing',
      }}
      onLayout={onLayout}
      className="px-4 py-6"
    >
      <View className="flex-row mb-6 items-center">
        <Skeleton colorMode="light" radius="round" height={100} width={100} />
        <View className="flex-row ml-4 flex-1 justify-between">
          <Skeleton colorMode="light" height={32} width={50} />
          <Skeleton colorMode="light" height={32} width={50} />
          <Skeleton colorMode="light" height={32} width={50} />
        </View>
      </View>
      <Skeleton colorMode="light" height={16} width={Math.round(width * 0.5)} />
      <View className="my-4 flex-row w-full justify-between">
        <Skeleton
          colorMode="light"
          height={16}
          width={Math.round(width * 0.3)}
        />
      </View>
    </MotiView>
  )
}
