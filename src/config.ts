const config = {
	isDev: process.env.NODE_ENV === 'development',
	wsUrl: '',
	appName: 'Top notch city',
	origin: process.env.EXPO_PUBLIC_API_URL as string,
	websiteUrl: process.env.EXPO_PUBLIC_WEBSITE_URL as string,
};

if (config.origin === undefined) {
	throw new Error('Missing EXPO_PUBLIC_API_URL environment variable');
}
config.wsUrl = config.origin.replace(/^http/, 'ws');

export default config;
