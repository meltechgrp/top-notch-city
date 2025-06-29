import {
  delFromStorage,
  getFromStorage,
  saveToStorage,
} from '@/lib/asyncStorage'
import { verifyAppPinCode } from '@/lib/secureStore'

import { showSnackbar } from '@/lib//utils'
import * as React from 'react'
import { View } from 'react-native'
import { Text } from '@/components/ui'
import BottomSheetTwo from '@/components/shared/BottomSheetTwo'
import AppKeyboard from '@/components/custom/AppKeyboard'
import PinDots from '@/components/custom/PinDots'

type Props = {
  onDismiss: () => void
  visible: boolean
  onAuthorize: () => void
  title: string
  description: string
}
export default function PinAuthorizationtBottomSheet(props: Props) {
  const { visible, onDismiss, onAuthorize, title, description } = props
  const [pin, setPin] = React.useState('')
  const [attempts, setAttempts] = React.useState(0)
  async function onConfirm() {
    if (attempts > 2) {
      onDismiss()
      showSnackbar({
        message:
          'You have exceeded the maximum number of attempts. Please try again later.',
        type: 'error',
        duration: 5000,
      })
      return
    }
    const res = await verifyAppPinCode(pin)
    if (res) {
      onAuthorize()
      onDismiss()
    } else {
      setPin('')
      showSnackbar({
        message:
          'Incorrect PIN, you have ' + (3 - attempts) + ' attempts left.',
        type: 'error',
        duration: 5000,
      })
    }
    let newAttempts = attempts + 1
    setAttempts(newAttempts)
    // if newAttempts is 3 then set next attempt to be 30 minutes from now and store in async storage
    if (newAttempts === 3) {
      // set next attempt to be 30 minutes from now
      // store in async storage
      saveToStorage(
        'nextPinAttempt',
        new Date(Date.now() + 30 * 60 * 1000).toISOString()
      )
    }
  }
  async function checkNextAttempt() {
    // check if the user has exceeded the maximum number of attempts by checking the async storage
    // if the user has exceeded the maximum number of attempts then check if the next attempt is in the future

    const nextAttempt = await getFromStorage('nextPinAttempt')
    if (nextAttempt) {
      const nextAttemptDate = new Date(nextAttempt)
      const now = new Date()
      if (nextAttemptDate > now) {
        // if the next attempt is in the future then show the user the maximum number of attempts
        setAttempts(3)
      } else {
        // if the next attempt is in the past then reset the number of attempts to 0
        setAttempts(0)
        delFromStorage('nextPinAttempt')
      }
    }
  }
  React.useEffect(() => {
    if (visible) checkNextAttempt()
    else setPin('')
  }, [visible])
  React.useEffect(() => {
    if (pin.length === 4 && visible) {
      onConfirm()
    }
  }, [pin, visible])
  return (
    <BottomSheetTwo
      title="Enter your pin"
      visible={visible}
      onDismiss={onDismiss}
      snapPoint={600}
    >
      <View className="px-4 pb-10">
        <Text className=" text-lg">{title}</Text>

        <Text className=" text-sm">
          {description}
        </Text>

        <View className="py-10">
          <PinDots value={pin} />
        </View>
        <View style={[{ height: '70%' }]}>
          <AppKeyboard value={pin} onChange={setPin} />
        </View>
      </View>
    </BottomSheetTwo>
  )
}
