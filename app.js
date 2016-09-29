const express = require('express')
const path = require('path')
const http = require('http')
global.NODE_ENV = process.env.NODE_ENV || 'production'
const PORT = 8080
const isDev = NODE_ENV === 'development'
const app = express()
const router = require('./server/routers/router')
const template = require('art-template')
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./build/webpack.prod.conf')
  : require('./build/webpack.dev.conf')

app.set('views', path.join(__dirname, 'server/views'))
// app.set('view engine', 'ejs')
//添加template模板
// template.config('base', path.join(__dirname, 'server/view'));
template.config('extname', '.html');
app.engine('.html', template.__express);
app.set('view engine', 'html');
app.use(router)

if (isDev) {
    // local variables for all views
    app.locals.env = NODE_ENV;
    app.locals.reload = true;
    
    // static assets served by webpack-dev-middleware & webpack-hot-middleware for development
    const webpack = require('webpack')
   var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)
console.log(hotMiddleware)
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

    const server = http.createServer(app)

    app.use(express.static(path.join(__dirname, 'public')))

    server.listen(PORT, function(){
        console.log('App (dev) is now running on PORT '+ PORT +'!')
    })
} else {
    // static assets served by express.static() for production
    app.use(express.static(path.join(__dirname, 'public')))
    
    app.listen(PORT, function () {
        console.log('App (production) is now running on PORT '+ PORT +'!')
    })
}
