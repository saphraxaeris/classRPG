var express = require('express');
var home = require('./controller/home');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();
app.use(bodyParser.json());
//app.use(express.static('view'));
app.use(express.static('assets'));
app.use(express.static('styles'));
app.use(express.static('scripts'));

app.get('/',home.index)

app.get('/test', function(req,res){
    res.sendFile(path.join(__dirname + '/view/home/index.html'));
});

app.get('/test2', function(req,res){
    res.sendFile(path.join(__dirname + '/view/user/login.html'));
});


app.listen(8080);