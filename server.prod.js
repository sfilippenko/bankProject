const express = require('express');

const app = new express();
const port = process.env.PORT || 8080;

app.use(express.static('dist'));

app.get('/', function (req, res) {
    res.sendFile('index.html');
});

app.listen(port, function (error) {
    if (error) {
        console.error(error);
    } else {
        console.info('you are listening to port', port);
    }
});