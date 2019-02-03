var webpack = require('webpack');

module.exports = {
    entry: './js/routeApp',
    
    output: {
    filename: 'bundle.js'
    },
    
    devtool: 'source-map',
    
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
        })
    ],
    
    module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
