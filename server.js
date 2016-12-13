var express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser');

console.log('dirname: ' + __dirname);

app.use(express.static(path.join(__dirname, 'views')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))

var orders = [
    {
        name: 'Steve',
        drink: 'Water'
    },
    {
        name: 'Eric',
        drink: 'Coke'
    }
];

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.get('/orders', function(req, res) {
    res.json(orders);
})

app.post('/orders', function(req, res) {
    // console.log('ARG');
    console.log('In /orders path.');
    orders.push(req.body);
    res.json(req.body);
})

// WHY DID I WRITE THESE. Should have known that you don't need to specify routes for static files. Just use express.static and don't forget
// that when using path.join, the 2nd argument is the folder, NOT THE PATH TO THE FOLDER.
// app.get('/static/index.js', function(req, res) {
//     res.sendFile(path.join(__dirname, '/views/index.js'));
// })
//
// app.get('/static/mustache.js', function(req, res) {
//     res.sendFile(path.join(__dirname, '/node_modules/mustache/mustache.js'));
// })

app.listen(8000, function() {
    console.log('Listening on Port 8000');
})
