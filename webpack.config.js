const path = require("path");
const webpack = require("webpack")
const env = require("./env")

var environment = process.argv.indexOf('-p') !== -1 ? 'production' : 'development';

// Frontend - bundle for client
const frontend = {
    entry: {
      frontend: "./src/Client.tsx",
    },
    devtool: 'inline-source-map',
    output: {
      path: path.resolve(__dirname, './static'),
      filename: "client.js"
    },
    devServer: {
      contentBase: path.resolve(__dirname, './static'),
      port: 4000
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use:
          {
            loader: "babel-loader"
          }
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use:
          {
            loader: "ts-loader"
          }
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    plugins: [
      new webpack.DefinePlugin({
        'API_URL': JSON.stringify(env.API_URL[environment])
      })
    ]
  };

module.exports = [frontend];