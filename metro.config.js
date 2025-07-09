const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure proper platform resolution
config.resolver.platforms = ['web', 'native', 'ios', 'android'];

// Add support for TypeScript and JavaScript file extensions
config.resolver.sourceExts.push('ts', 'tsx', 'mjs', 'cjs');

// Add support for additional asset extensions
config.resolver.assetExts.push('db', 'mp3', 'ttf', 'obj', 'png', 'jpg');

// Configure transformer for better web compatibility
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

module.exports = config;