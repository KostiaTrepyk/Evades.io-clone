const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = config = {
  mode: process.env.NODE_ENV ?? "development",
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  
  devServer: {
    static: {
      directory: path.join(__dirname, "/src/public"),
    },
    compress: true,
    port: 3000,
  },

  resolve: {
    extensions: [".ts", ".js"],
  },

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/public/index.html",
    }),
  ],
};
