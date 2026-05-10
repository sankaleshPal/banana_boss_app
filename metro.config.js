const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Allow react-native-vector-icons fonts to be bundled on web
config.resolver.assetExts.push('ttf', 'otf', 'woff', 'woff2');

// Disable package.exports resolution — prevents 'import.meta' ESM errors
// from zustand v5, @tanstack/react-query v5, and similar packages
// when bundled by Metro for web.
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
