var express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    _ = require('./views/static/underscore.js');

console.log('dirname: ' + __dirname);

app.use(express.static(path.join(__dirname, 'views')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// ONLY FOR TESTING PURPOSES. DON'T JUDGE ME.
var _id = 3;

var orders = [
    {
        id: 1,
        name: 'Steve',
        drink: 'Water'
    },
    {
        id: 2,
        name: 'Eric',
        drink: 'Coke'
    }
];

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/orders', function(req, res) {
    res.json(orders);
});

app.post('/orders', function(req, res) {
    console.log('In /orders path.');
    req.body.id = _id++;
    orders.push(req.body);
    res.json(req.body);
});

// WHY DID I WRITE THESE. Should have known that the 2nd argument in express.static(path.join()) is the folder, NOT THE PATH TO THE FOLDER. SO MUCH STRESS!
// app.get('/static/index.js', function(req, res) {
//     res.sendFile(path.join(__dirname, '/views/index.js'));
// })
//
// app.get('/static/mustache.js', function(req, res) {
//     res.sendFile(path.join(__dirname, '/node_modules/mustache/mustache.js'));
// })

app.delete('/orders/:id', function(req, res) {
    // req.params.id is a string, not a number.
    orders = _.reject(orders, function(order) {
        return order.id === parseInt(req.params.id);
    });

    res.json(orders);
});

app.put('/orders/:id', function(req, res) {
    if (req.body) {
        var id = req.params.id;
        req.body.id = id;
        orders[id - 1] = req.body;
        res.json(req.body);
    } else {
        res.json('Failure');
    }
})

app.listen(8000, function() {
    console.log('Listening on Port 8000');
});
