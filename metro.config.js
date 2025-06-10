// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Configure resolver to exclude native-only packages from web builds
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Platform-specific module resolution
config.resolver.unstable_enableSymlinks = false;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Exclude react-native-maps from web builds
  if (platform === 'web' && moduleName === 'react-native-maps') {
    return {
      filePath: require.resolve('./components/leads/map/WebMapFallback.js'),
      type: 'sourceFile'
    };
  }
  
  // Use default resolution for everything else
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config; 