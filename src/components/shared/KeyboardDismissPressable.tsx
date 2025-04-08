/*
 * Handle tap(e.g. on a button) and dismiss the keyboard with a single tap
 * Should be used over a Scrollable container (ScrollView, FlatList) with 'keyboardShouldPersistTabps' set to 'handled'.
 * See: https://apps.theodo.com/article/dismissing-keyboard-in-react-native-stop-the-struggle
 */

import type { PropsWithChildren } from 'react'
import { useRef } from 'react'
import { Keyboard, StyleSheet, View } from 'react-native'
// @ts-ignore
import * as TextInputState from 'react-native/Libraries/Components/TextInput/TextInputState'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

export const KeyboardDismissPressable = ({ children }: PropsWithChildren) => {
  const isTargetTextInput = useRef(false)

  const tap = Gesture.Tap()
    // Dismiss on tap end to avoid being triggered when scrolling
    .onEnd(() => {
      if (!isTargetTextInput.current) {
        Keyboard.dismiss()
      }
    })
    .runOnJS(true)

  return (
    <GestureDetector gesture={tap}>
      <View
        style={styles.container}
        onStartShouldSetResponderCapture={(e) => {
          // Allow to avoid keyboard flickering when clicking on a TextInput
          isTargetTextInput.current = TextInputState.isTextInput(e.target)

          return false
        }}
        accessible={false}
      >
        {children}
      </View>
    </GestureDetector>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
