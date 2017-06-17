var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('rpg', server);
 
db.open(function(err, db) {
    if(!err) {
       console.log("Connected to 'rpg' database for setup");
       
       db.createCollection('users');
       var users = db.collection('users');
       users.insert({name:"Jose Garcia",username:"jose",password:"J123!",email:"jose.garcia12@upr.edu",
                    studentId: "802122645",student: true },function(err,data){
           console.log("Done");
        });
        users.insert({username:"stephan",name:"Stephan",email:"stephan.elias@upr.edu",studentId: "802122645",password: "J123!",student: true },function(err,data){
           console.log("Done");
        });

        db.createCollection('items');
        var items = db.collection('items');
        items.insert({sprite: 'yellow-potion.png', classId:'1', className:'CIIC5995', name:'Item 1', effect:'Testing'},function(err,data){
           console.log("Done");
        });
        items.insert({sprite: 'scroll.png', classId:'2', className:'ICOM5995', name:'Item 2' ,effect:'Testing 2'},function(err,data){
           console.log("Done");
        });
        

        
        


    }
});
