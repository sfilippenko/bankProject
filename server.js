const express = require('express');
const path = require('path');

const app = express();
const port = process.env.port || 7000;

app.use(express.static('dist'));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => console.log(`server started on port ${port}`));