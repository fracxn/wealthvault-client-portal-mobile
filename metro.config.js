// const { getDefaultConfig } = require("expo/metro-config");
// const { withNativeWind } = require('nativewind/metro');

// const config = getDefaultConfig(__dirname)

// module.exports = withNativeWind(config, { input: './global.css' })

// const { getDefaultConfig } = require('expo/metro-config');
// const { withNativeWind } = require('nativewind/metro');

// module.exports = (async () => {
//     // Get the default configuration from Expo/Metro
//     const config = await getDefaultConfig(__dirname);

//     // Extract the resolver settings from the default configuration
//     const {
//         resolver: { sourceExts, assetExts },
//     } = config;

//     return withNativeWind({
//         ...config,
//         transformer: {
//             babelTransformerPath: require.resolve('react-native-svg-transformer'),
//             // Include any other transformers that might exist
//             ...config.transformer,
//         },
//         resolver: {
//             // Remove 'svg' from assetExts
//             assetExts: assetExts.filter(ext => ext !== 'svg'),
//             // Add 'svg' to sourceExts
//             sourceExts: [...sourceExts, 'svg'],
//         },
//     }, {
//         input: './global.css' // Path to your NativeWind CSS file
//     });
// })();


const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

module.exports = (async () => {
    const config = await getDefaultConfig(__dirname);
    const {
        resolver: { sourceExts, assetExts },
    } = config;

    return withNativeWind({
        ...config,
        transformer: {
            babelTransformerPath: require.resolve('react-native-svg-transformer'),
            ...config.transformer,
        },
        resolver: {
            assetExts: assetExts.filter(ext => ext !== 'svg'),
            sourceExts: [...sourceExts, 'svg'],
        },
    }, {
        input: './global.css'
    });
})();
