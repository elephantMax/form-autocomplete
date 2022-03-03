const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = {
  entry: './app/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js',
  },
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.(js)$/, use: 'babel-loader' },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Form autocomplete',
      template: path.resolve(__dirname, './app/index.html'),
      filename: 'index.html',
    }),
  ],
  mode: 'none',
}

module.exports = (env, argv) => {
  if (env.deploy) {
    config.mode = 'production'
    config.output.publicPath = ''
  }

  return config
}
