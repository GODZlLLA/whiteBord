const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: { presets: ['@babel/preset-env', '@babel/react'] },
          },
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, 'tsconfig.json'),
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader', 'import-glob-loader']
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3000,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      '~src': path.resolve(__dirname, './src'),
    }
  },
  target: 'web',
};