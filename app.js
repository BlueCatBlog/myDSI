// Environment variable
require('dotenv').config();
// Requirements
var express = require('express'),
    app = express(),
    port = process.env.PORT,
    bodyParser = require('body-parser');

// App config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// App routes
app.get('/', function(req, res) {
    res.send("index");
});

// App listen
app.listen(port, function() {
    console.log("APP IS RUNNING ON PORT " + process.env.PORT);
})