var express = require('express');
var home = require('./controller/home');
var user = require('./controller/user');
var classes = require('./controller/classes');
var bodyParser = require('body-parser');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('rpg', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'rpg' database");
        user.setVars(db);

    }
});
//require('connect-ensure-login').ensureLoggedIn()
passport.use(new Strategy(
  function(username, password, cb) {
    var users = db.collection('users');
    users.findOne({username:username}).then(function(user) {
        console.log(user);
      if (!user||user.password != password) { return cb(null, false);}
      return cb(null, user);
    });
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user._id);
});

passport.deserializeUser(function(id, cb) {
  var users = db.collection('users');

  users.findOne({_id:id}).then(function (user) {
    if (user) { return cb(null,user); }
    cb(null, false);
  });
});



var app = express();
app.use(bodyParser.json());
//app.use(express.static('view'));
app.use(express.static('assets'));
app.use(express.static('styles'));
app.use(express.static('scripts'));

app.use(passport.initialize());
app.use(passport.session());

app.post('/user/login',passport.authenticate('local'),user.login);
app.get('/user/login',user.getLogin);

app.get('/user/register',user.getRegister);
app.post('/user/register',user.register);

app.get('/user/profile',user.getProfile);
app.post('/user/profile', user.profile);

app.get('/user/getInventory',user.getInventory);
app.get('/user/inventory', user.inventory);

app.get('/classes/getClasses',user.getClasses);
app.get('/classes/classes', user.classes);
app.get('/classes/class', user.class);

app.get('/',home.getHome);


app.listen(8080);