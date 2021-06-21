const path = require('path')
module.exports = {
  mode: 'development',
  devtool: false,
  entry: __dirname + '/browser/index.jsx',
  output: {
    filename: 'main.js',
    path: __dirname + '/node/source/',
  },
  module: {
    rules: [
      {
        test: /\.tsx$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      },
    ],
  },
}
