module.exports = {
    entry: {
        app: './src/webcomponent.js'
    },
    output: {
        filename: 'vdemy-online.js',
        path: __dirname + '/dist'
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use:  ['babel-loader']
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        },
        {
            // Some change here
              test: /\.scss$/,
              use: ['style-loader', 'css-loader','sass-loader']
        },
        {
            // Some change here
              test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
              //use: ['file-loader']
              use: [
                {
                  loader: 'file-loader',
                  options: {
                    name: '[name].[ext]',
                    outputPath: 'fonts/'
                  }
                }
              ]
        },
        {
            // Some change here
              test: /\.(png|jpe?g|gif)$/i,
              use: ['file-loader']
        }
      ],
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
      },
  };