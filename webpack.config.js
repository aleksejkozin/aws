/*
Webpack can bundle multiple files into a single file
It produces a single compact bundle.js that can be send via HTTP to clients
Will parse all the node_modules and extract only parts we actually use
Can call Babel to transform code to older standards

Can also split the result bundle into multiple bundles if you use "await import(...)" syntax
This way you make your app faster to load

A video regard Webpack:
https://www.youtube.com/watch?v=X1nxTjVDYdQ
*/

const path = require('path')
const WebpackShellPluginNext = require('webpack-shell-plugin-next')
const NodeExternals = require('webpack-node-externals')
const {merge} = require('webpack-merge')

const base = {
  mode: process.env.NODE_ENV || 'development',
  module: {
    rules: [
      // Process all the code with babel
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      // Also pack binaries, like sharp binaries
      {
        test: /\.node$/,
        loader: 'node-loader',
      },
    ],
  },
  resolve: {
    // What extensions "import" modules can have
    extensions: ['.js', '.jsx', '.ts', '.tsx', '*'],
  },
  ignoreWarnings: [
    // This module is not mandatory, we can skip this warning if it doesn't exist
    /global_environment.json/,
    // Does nothing, some bug in azure, we can skip it
    /applicationinsights-native-metrics/,
  ],
  // This will speed up rebuilds drastically
  cache: {
    type: 'filesystem',
    allowCollectingMemory: true,
  },
  // This is how we can link an error in the compiled code with the original code
  devtool: 'source-map',
}

const backend = merge(base, {
  target: 'node',
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },
  externalsPresets: {node: true},
  externals: [NodeExternals()],
  plugins: [
    new WebpackShellPluginNext({
      // This will execute in dev mode
      onWatchRun: {
        scripts: [
          'cross-env NODE_ENV=development nodemon --watch ./dist/backend/ ./dist/backend/bundle.js',
          'tsc --watch',
        ],
        blocking: false,
        parallel: true,
      },
    }),
  ],
})

module.exports = [backend]
