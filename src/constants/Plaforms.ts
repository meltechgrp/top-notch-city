import { Platform } from 'react-native'

const Platforms = {
  isIOS() {
    return Platform.OS === 'ios'
  },
  isAndroid() {
    return Platform.OS === 'android'
  },
  isWeb() {
    return Platform.OS === 'web'
  },
}

export default Platforms
