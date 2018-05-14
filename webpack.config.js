const environment = process.env.NODE_ENV // production || development

const webpack = require('webpack') //访问内置的插件
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextWebpackPlugin({
  filename: (getPath) => {
    return getPath('[name][contenthash].css')
  }
});
const extractLESS = new ExtractTextWebpackPlugin({
  filename: (getPath) => {
    return getPath('[name][contenthash].css')
  }
});

//webpack-hot-middleware/client?reload=true 必填，实现刷新浏览器
const buildHMWArray = (fileArray) => {
  const array = environment === 'development' ? fileArray.concat(['webpack-hot-middleware/client?noInfo=true&path=/__webpack_hmr&timeout=20000&reload=true']) : fileArray
  
  return array
}

// 入口文件列表
const entries = require('./utils.js').entries

// html模板HtmlWebpackPlugin列表
let templates = require('./utils.js').templates
let htmlWebpackPluginList = []

for (let item in entries) {
  entries[item] = buildHMWArray([entries[item]])
}

for (let item in templates) {
  const chunks = ['load', 'vendor', 'common', item]

  // 开发环境为所有页面添加路由
  if (environment === 'development') {
    chunks.push('routes')
  }

  htmlWebpackPluginList.push(new HtmlWebpackPlugin({
    filename: './' + item +'.html',
    template: templates[item],
    favicon: '',
    hash: true,
    chunks: chunks,
    chunksSortMode: 'manual'
  }))
}

const webpackConfig = {
  entry: Object.assign({
    vendor: ['jquery'],
    routes: './src/routes.js'
  }, entries),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,//一个匹配loaders所处理的文件的拓展名的正则表达式，这里用来匹配js和jsx文件（必须）
        exclude: /(node_modules|bower_components)/, //屏蔽不需要处理的文件（文件夹）（可选）
        use: {
          loader: 'babel-loader'
        }
      },
      // { 
      //   // test: /\.(css|less)$/, 
      //   test: /\.css$/, 
      //   use: extractCSS.extract({
      //     fallback: "style-loader",
      //     use: ["css-loader"]
      //   })
      // },
      {
        test: /\.css$/,
        use: extractCSS.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              minimize: true //css压缩
            }
          }]
        })
      },
      {
        test: /\.less$/i,
        use: extractLESS.extract({
          use: [{
            loader: 'css-loader',
            options: {
              minimize: true //css压缩
            }
          }, 'less-loader']
        })
      },
      { test: /\.(png|svg|jpg|gif)$/, use: ['file-loader?name=assets/images/[name][hash].[ext]'] },
      // { test: /\.(png|svg|jpg|gif)$/, use: ['url-loader?limit=1024&name=assets/images/[name].[ext]'] },
      { test: /\.(woff|woff2|eot|ttf|otf)$/, use: ['file-loader'] },
      {
        test: /\.html$/,
        loader: 'html-withimg-loader'
      }
    ],
  },
  resolve: {
    alias: {
      buriedPointStatistics: environment === 'buildProduct' ? path.resolve(__dirname, 'src/public/js/public/buriedPointStatistics.js') : path.resolve(__dirname, 'src/public/js/public/buriedPointStatisticsDev.js')
    }
  },
  plugins: [
    // new CleanWebpackPlugin(['dist']),
    new webpack.ProvidePlugin({
      jQuery: "jquery",
      $: "jquery"
    }),
    new HtmlWebpackPlugin({
      // filename: './routes.html',
      template: './src/index.html',
      favicon: '',
      hash: true,
      chunks: ['load', 'routes'],
      chunksSortMode: 'manual'
    }),
    extractCSS,
    extractLESS,
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['common', 'vendor', 'load'], // 指定公共 bundle 的名称。
      // filename: '[name][hash].js',
      minChunks: 2
    }),
    // new UglifyJSPlugin({
    //   test: /\.js($|\?)/i
    // })
  ],
  output: {
    filename: './[name][hash].js',
    //__dirname是node.js中的一个全局变量，它指向当前执行脚本所在的目录
    path: path.resolve(__dirname, 'dist'),
    // publicPath: '/'
  }
}

webpackConfig.plugins = webpackConfig.plugins.concat(htmlWebpackPluginList)

module.exports = webpackConfig