export default () => ({
  name: "TopNotch City",
  slug: "topnotch-city",
  newArchEnabled: true,
  version: "1.1.0",
  orientation: "portrait",
  icon: "./src/assets/images/icon.png",
  scheme: "com.meltech.topnotchcity",
  userInterfaceStyle: "automatic",
  runtimeVersion: "1.1.0",
  updates: {
    fallbackToCacheTimeout: 0,
    url: `https://u.expo.dev/d21cedf2-e98d-42e9-bf8b-6d52e1a7ef20`,
  },
  ios: {
    icon: {
      dark: "./src/assets/images/ios-dark.png",
      light: "./src/assets/images/ios-light.png",
    },
    supportsTablet: false,
    usesAppleSignIn: true,
    bundleIdentifier: "com.meltech.topnotchcity",
    runtimeVersion: "1.1.0",
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        "Allow $(PRODUCT_NAME) to access your location to show nearby properties and map search.",
      ITSAppUsesNonExemptEncryption: false,
      LSApplicationQueriesSchemes: [
        "fb",
        "facebook",
        "instagram",
        "whatsapp",
        "message",
        "tg",
        "twitter",
        "tiktok",
        "fb-messenger",
      ],
      associatedDomains: ["applinks:topnotchcity.com"],
    },
  },
  android: {
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: true,
    googleServicesFile: "./google-services.json",
    package: "com.meltech.topnotchcity",
    adaptiveIcon: {
      foregroundImage: "./src/assets/images/adaptive-icon.png",
    },
    permissions: [
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.ACCESS_COARSE_LOCATION",
      "android.permission.RECORD_AUDIO",
      "android.permission.CAMERA",
    ],
    softwareKeyboardLayoutMode: "resize",
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          {
            scheme: "https",
            host: "topnotchcity.com",
            pathPrefix: "/property",
          },
          {
            scheme: "https",
            host: "topnotchcity.com",
            pathPrefix: "/agents",
          },
          {
            scheme: "https",
            host: "topnotchcity.com",
            pathPrefix: "/reels",
          },
          {
            scheme: "com.meltech.topnotchcity",
          },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_ANDROID_MAPS_API_KEY,
      },
    },
  },
  web: {
    bundler: "metro",
    output: "static",
  },
  jsEngine: "hermes",
  plugins: [
    "expo-asset",
    "expo-router",
    "expo-apple-authentication",
    [
      "./plugins/withAndroidQueries.js",
      [
        "com.instagram.android",
        "com.facebook.katana",
        "com.whatsapp",
        "com.twitter.android",
        "org.telegram.messenger",
        "com.zhiliaoapp.musically",
        "com.whatsapp.w4b",
        "com.facebook.lite",
        "com.instagram.lite",
        "com.facebook.orca",
        "com.google.android.apps.messaging",
      ],
    ],
    [
      "expo-video",
      {
        supportsBackgroundPlayback: false,
        supportsPictureInPicture: false,
      },
    ],
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "$(PRODUCT_NAME) requires access to your location at all times to help you discover nearby properties, receive location-based recommendations, and improve property search results",
      },
    ],
    "expo-secure-store",
    "expo-background-task",
    [
      "expo-web-browser",
      {
        experimentalLauncherActivity: true,
      },
    ],
    [
      "expo-font",
      {
        fonts: [
          "./src/assets/fonts/Satoshi-Black.otf",
          "./src/assets/fonts/Satoshi-Bold.otf",
          "./src/assets/fonts/Satoshi-Medium.otf",
          "./src/assets/fonts/Satoshi-Regular.otf",
          "./src/assets/fonts/Satoshi-Italic.otf",
          "./src/assets/fonts/Satoshi-Light.otf",
        ],
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission:
          "$(PRODUCT_NAME) needs access to your photo library so you can upload property images, select profile pictures, and share media for property listings.",
        cameraPermission:
          "$(PRODUCT_NAME) needs access to your camera so you can take photos and videos of properties, upload property listings, and update your profile picture.",
        microphonePermission:
          "$(PRODUCT_NAME) requires microphone access to record audio when creating video tours of properties or capturing voice notes.",
      },
    ],
    [
      "expo-splash-screen",
      {
        image: "./src/assets/images/splash.png",
        resizeMode: "contain",
        backgroundColor: "#161819",
        dark: {
          image: "./src/assets/images/splash.png",
          backgroundColor: "#161819",
        },
        imageWidth: 200,
      },
    ],
    [
      "expo-audio",
      {
        microphonePermission:
          "$(PRODUCT_NAME) requires microphone access to record audio when creating video tours of properties or capturing voice notes.",
      },
    ],
    [
      "expo-notifications",
      {
        icon: "./src/assets/images/notification.png",
        color: "#ffffff",
        defaultChannel: "default",
        enableBackgroundRemoteNotifications: false,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: "d21cedf2-e98d-42e9-bf8b-6d52e1a7ef20",
    },
  },
  owner: "meltechnologies",
});
