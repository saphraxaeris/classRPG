var express = require('express');
var home = require('./controller/home');
var bodyPaser = require('bodyParser');

var app = express();
app.use(bodyParser.json());
app.use(express.static('view'));
app.use(express.static('assets'));
app.use(express.static('styles'));
app.use(express.static('scripts'));

app.get('/',home.index)

app.listen(8080);