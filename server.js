let webpack = require('webpack');
let webpackDevMiddleware = require('webpack-dev-middleware');
let webpackHotMiddleware = require('webpack-hot-middleware');
let config = require('./webpack.dev.config.js');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');


let app = new (require('express'))();
let port = 8080;

let compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: config.output.publicPath}));
app.use(webpackHotMiddleware(compiler));

app.use(cookieParser());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

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