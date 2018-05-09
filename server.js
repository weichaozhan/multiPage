const express = require('express')
const webpack = require('webpack')
const merge = require('webpack-merge');
const proxy = require('http-proxy-middleware');
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require("webpack-hot-middleware")


const port = process.env.PORT || 3001

const app = express()
const config = merge(require('./webpack.config.js'), {
  devtool: 'eval-source-map'
})
const compiler = webpack(config)

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));

app.use(webpackHotMiddleware(compiler));

// proxy
var proxyObj = {
  target: 'http://localhost:9090',
  changeOrigin: true
}

app.use(proxy(['/api'], proxyObj));

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!\n`)
});