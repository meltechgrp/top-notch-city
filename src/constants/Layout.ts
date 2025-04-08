import { Dimensions } from 'react-native'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const _9_16 = 9 / 16
export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  ratio: {
    _9_16,
  },
  splitCoverBannerHeight: width * _9_16,
}
