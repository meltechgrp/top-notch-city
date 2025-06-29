import { useMemo } from 'react'
import { Pressable, View } from 'react-native'
import chunk from 'lodash-es/chunk'
import { Icon, Text } from '../ui'
import BackspaceIcon from '../icons/BackspaceIcon'

type IProps = {
  onChange: (value: string) => void
  value: string
  withDot?: boolean
  maxLength?: number
}
export default function AppKeyboard(props: IProps) {
  const { onChange, value, withDot, maxLength = 4 } = props

  const chunks = useMemo(() => chunk(keys, 3), [])
  function ColLabel(col: (typeof keys)[0]) {
    switch (col.value) {
      case 'backspace':
        return <Icon as={BackspaceIcon}  />
      case 'dot':
        return (
          <View className="w-14 h-14 items-center justify-center">
            <View className="w-1.5 h-1.5 bg-background rounded-full" />
          </View>
        )
      default:
        return (
          <Text className="text-2xl">
            {col.label}
          </Text>
        )
    }
  }
  function onKey(col: (typeof keys)[0]) {
    if (value.length >= maxLength && col.value !== 'backspace') {
      return
    }
    switch (col.value) {
      case 'backspace':
        onChange(value.slice(0, -1))
        break
      case 'dot':
        onChange(value + '.')
        break
      default:
        onChange(value + col.value)
        break
    }
  }
  return (
    <View className="flex-1">
      {chunks.map((row, i) => (
        <View className="flex-row h-1/5 items-center justify-center" key={i}>
          {row.map((col, j) =>
            col.label === 'dot' && !withDot ? (
              <View
                key={'empty'}
                className="w-1/4 items-center justify-center"
              />
            ) : (
              <View
                key={col.value}
                className="w-1/4 items-center justify-center"
              >
                <Pressable
                  onPress={() => onKey(col)}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.6 : 1,
                  })}
                  className="bg-gray-100 rounded-full items-center justify-center w-14 h-14"
                >
                  {ColLabel(col)}
                </Pressable>
              </View>
            )
          )}
        </View>
      ))}
    </View>
  )
}

const keys = [
  {
    label: '1',
    value: '1',
  },
  {
    label: '2',
    value: '2',
  },
  {
    label: '3',
    value: '3',
  },
  {
    label: '4',
    value: '4',
  },
  {
    label: '5',
    value: '5',
  },
  {
    label: '6',
    value: '6',
  },
  {
    label: '7',
    value: '7',
  },
  {
    label: '8',
    value: '8',
  },
  {
    label: '9',
    value: '9',
  },
  {
    label: 'dot',
    value: 'dot',
  },
  {
    label: '0',
    value: '0',
  },
  {
    label: 'backspace',
    value: 'backspace',
  },
]
