import { Dimensions } from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const _9_16 = 9 / 15;
export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  ratio: {
    _9_16,
  },
  bannerHeight: width * _9_16,
};
