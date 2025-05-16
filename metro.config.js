// metro.config.js

const { getDefaultConfig } = require('expo/metro-config');
const { mergeConfig } = require('@react-native/metro-config');
const {
	wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');
const { withNativeWind } = require('nativewind/metro');

const defaultConfig = getDefaultConfig(__dirname);

const { assetExts, sourceExts } = defaultConfig.resolver;

const customConfig = {
	transformer: {
		babelTransformerPath: require.resolve('react-native-svg-transformer'),
	},
	resolver: {
		assetExts: [
			...assetExts.filter((ext) => ext !== 'svg'),
			'glb',
			'gltf',
			'png',
			'jpg',
		],
		sourceExts: [...sourceExts, 'svg'],
	},
};

// Merge all configs together
let config = mergeConfig(defaultConfig, customConfig);
config = wrapWithReanimatedMetroConfig(config);
config = withNativeWind(config, { input: './src/app/global.css' });

module.exports = config;
