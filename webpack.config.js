const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,          // Matches .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",    // Use babel-loader for transpiling
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],     // Resolve these extensions
  },
  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 3000,
    host: "0.0.0.0",                // Ensure the server is accessible externally
  },
};
