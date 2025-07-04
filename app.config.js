import 'dotenv/config';

export default {
    expo: {
        name: "TPV Hostely",
        slug: "tpv-hostely",
        platforms: [
            "web",
            "ios",
            "android"
        ],
        version: "1.0.0",
        runtimeVersion: "1.0.0",
        cli: {
            "appVersionSource": "version"
        },
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "tpvhostely",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        splash: {
            "image": "./assets/images/logo-hostely.png",
            "resizeMode": "contain",
            "backgroundColor": "#15314c"
        },
        ios: {
            bundleIdentifier: "com.enuarlara.tpvHostely",
            supportsTablet: true
        },
        android: {
            package: "com.ingenuarlara.tpvhostely",
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#ffffff"
            },
            edgeToEdgeEnabled: true
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/favicon.png"
        },
        plugins: [
            "expo-router",
            [
                "expo-splash-screen",
                {
                    image: "./assets/images/logo-hostely.png",
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#ffffff"
                }
            ]
        ],
        experiments: {
            typedRoutes: true
        },
        updates: {
            url: "https://u.expo.dev/1b401d18-d2bc-4e1d-ace6-875d3c3b34c4"
        },
        extra: {
            apiUrl: process.env.API_URL,
            eas: {
                projectId: "1b401d18-d2bc-4e1d-ace6-875d3c3b34c4"
            }
        },
        owner: "tpv-hostely-ia"
    }
};