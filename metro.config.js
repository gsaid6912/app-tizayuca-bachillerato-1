// metro.config.js
module.exports = {
  resolver: {
    extraNodeModules: {
      'react-native/Libraries/Utilities/Platform': require.resolve('./polyfills/Platform.web.js'),
    },
  },
};