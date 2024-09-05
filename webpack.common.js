const path = require('path');

module.exports = {
  entry : './src/index.ts',
  module : {
    rules :
          [
            {
              test : /\.tsx?$/,
              use : 'ts-loader',
              exclude : /node_modules/,
              // fullySpecified : false,
            },
            {
              test : /\.css$/i,
              use : [ 'style-loader', 'css-loader' ],
              // fullySpecified : false,
            },
            {
              test : /\.m?js$/,
              resolve : {
                fullySpecified : false,
              },
            },
          ],
  },
  devServer : {
    static : {
      directory : path.join(__dirname, 'dist'),
    },
    compress : false,
    port : 3000,
  },
  resolve : {
    extensions : [ '.ts', '.js', '.d.ts' ],
    fullySpecified : false,
  },
  externals : {
    //three : 'THREE'
      //jquery : 'jquery',
  },
  output : {
    filename : 'index.js',
    path : path.resolve(__dirname, 'dist'),
    clean : true,
  },
};
