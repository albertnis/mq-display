const path = require("path");

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
    }
  };

module.exports = [frontend];