const {merge} = require('webpack-merge');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode : 'production',
  // plugins : [ new ClosurePlugin.LibraryPlugin({
  //           closureLibraryBase : require.resolve(
  //                                  'google-closure-library/closure/goog/base'),
  //           deps :
  //                [
  //                  require.resolve('google-closure-library/closure/goog/deps'),
  //                  './public/deps.js',
  //                ],
  //         }) ],
  optimization : {
    removeAvailableModules : true,
    sideEffects : true,
    mangleExports : true,
  }
});
