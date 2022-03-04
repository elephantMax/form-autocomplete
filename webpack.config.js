const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Dotenv = require('dotenv-webpack')

const config = {
  entry: './app/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js',
  },
  devServer: {
    watchFiles: ['./app/index.html'],
  },
  module: {
    rules: [
      {
        test: /\.(s*)css$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      { test: /\.(js)$/, use: 'babel-loader' },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Form autocomplete',
      template: path.resolve(__dirname, './app/index.html'),
      filename: 'index.html',
    }),
    new Dotenv(),
  ],
  mode: 'development',
}

module.exports = (env, argv) => {
  if (env.deploy) {
    config.mode = 'production'
    config.output.publicPath = ''
  }

  return config
}
