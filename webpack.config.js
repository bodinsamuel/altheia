const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    bundle: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: 'altheia',
    libraryTarget: 'window'
  },
  plugins: [
    new UglifyJSPlugin()
  ]
};
