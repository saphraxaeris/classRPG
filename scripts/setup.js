var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('rpg', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'assignment' database");
       db.createCollection('users');
       var users = db.collection('users');
       users.insert({_id:"123",name:"Jose Garcia",username:"jose",password:"password",email:"jose.garcia12@upr.edu"},function(err,data){
           console.log("Done");
        });
    }
});
