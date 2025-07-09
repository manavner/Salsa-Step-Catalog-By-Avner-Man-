const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add resolver alias for react-dom to use client entry point
config.resolver.alias = {
  ...config.resolver.alias,
  'react-dom': 'react-dom/client',
};

// Ensure proper module resolution for web
config.resolver.platforms = ['web', 'native', 'ios', 'android'];

module.exports = config;