let webpack = require('webpack');
let webpackDevMiddleware = require('webpack-dev-middleware');
let webpackHotMiddleware = require('webpack-hot-middleware');
let config = require('./webpack.dev.config.js');


let app = new (require('express'))();
let port = 8080;

let compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: config.output.publicPath}));
app.use(webpackHotMiddleware(compiler));

app.get('*', function (req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});

app.listen(port, function (error) {
    if (error) {
        console.error(error);
    } else {
        console.info('you are listening to port', port);
    }
});