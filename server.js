var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static(__dirname + '/client/'));
app.use(bodyParser.json());
//import routes
require('./server/config/mongoose.js')
require('./server/config/routes.js')
var routes_setter = require('./server/config/routes.js')
routes_setter(app);

app.listen(8000, function(){
    console.log("Listening on 8000");
})
