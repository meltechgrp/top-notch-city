const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts = config.resolver.assetExts.filter(
	(ext) => ext !== 'svg'
);
config.resolver.sourceExts.push('svg', 'cjs');
config.transformer.babelTransformerPath = require.resolve(
	'react-native-svg-transformer'
);
module.exports = withNativeWind(config, {
	input: './src/app/global.css',
	configPath: './tailwind.config.ts',
});
