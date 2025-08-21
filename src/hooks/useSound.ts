import { useAudioPlayer } from 'expo-audio'
import React from 'react'

type SoundType =
  | 'MESSAGE_RECEIVED'
  | 'MESSAGE_SENT'
  | 'MESSAGE_DELETED'
  | 'SUCCESS'
  | 'ERROR'

const soundFiles: Record<SoundType, any> = {
  MESSAGE_RECEIVED: require('../assets/sounds/message-received.mp3'),
  MESSAGE_SENT: require('../assets/sounds/message-sent.mp3'),
  MESSAGE_DELETED: require('../assets/sounds/message-received.mp3'),
  ERROR: require('../assets/sounds/error.m4a'),
  SUCCESS: require('../assets/sounds/success.m4a'),
}

export default function useSound() {
  const player = useAudioPlayer()

  const playSound = React.useCallback((name: SoundType) => {
    player.replace(soundFiles[name])
    player.play()
  }, [])

  return { playSound }
}
