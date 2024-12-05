const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "../builds/front"),
      filename: "bundle.js",
      publicPath: "/", // Ensures all assets are served from the root
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx"],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
        favicon: "./src/assets/img/logo.ico",
        title: "Licenta",
      }),
      new Dotenv({
        path: isProduction
          ? path.resolve(__dirname, ".env.production")
          : path.resolve(__dirname, ".env.development"), // Load .env.production or .env.development dynamically
      }),
    ],
    devServer: {
      static: path.join(__dirname, "dist"),
      compress: true,
      port: 3000,
      host: "0.0.0.0",
      historyApiFallback: true,
    },
  };
};
