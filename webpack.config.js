const VueLoaderPlugin = require("vue-loader/lib/plugin");
const path = require("path");
const Webpack = require("webpack");

module.exports = {
  entry: [
    // path.join(__dirname, )
    // 'webpack-hot-middleware/client?reload=true',
    "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
    "./resource/assets/js/main.js"
  ],
  devtool: 'source-map',

  output: {
    path: `${__dirname}/public/js`,
    filename: "app.js",
    publicPath: `${__dirname}/public/js`
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],

              plugins: [
                "@babel/plugin-proposal-object-rest-spread",
                "@babel/plugin-transform-runtime"
              ]
            }
          }
        ]
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: "vue-loader"
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          "vue-style-loader",
          "css-loader",
          {
            loader: "sass-loader",
          }
        ]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },

  plugins: [new VueLoaderPlugin(), new Webpack.HotModuleReplacementPlugin()],

  resolve: {
    /**
     * Vue v2.x 之後 NPM Package 預設只會匯出 runtime-only 版本，若要使用 standalone 功能則需下列設定
     */
    alias: {
      vue: "vue/dist/vue.js"
    }
  }
};
