var mongo = require('mongodb');
var BSON = require('bson');

var Server = mongo.Server,
    Db = mongo.Db;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('rpg', server);
 
db.open(function(err, db) {
    if(!err) {
       console.log("Connected to 'rpg' database for setup");
       
       db.createCollection('users');
       var users = db.collection('users');
       users.insert({name:"Jose Garcia",username:"jose",password:"J123!",email:"jose.garcia12@upr.edu",
                    studentId: "802122645",student: true,gold:1000,
                items:[{item_id:new BSON.ObjectId('abcdefghijkl')},{item_id:new BSON.ObjectId('bcdefghijklm')}],
             classes:[{class_id:new BSON.ObjectId('abcdefghijkl')}] },function(err,data){
           console.log("Done");
        });
        users.insert({username:"stephan",name:"Stephan",email:"stephan.elias@upr.edu",studentId: "802122645",
        password: "J123!",student: true,gold:2000, classes:[{class_id:new BSON.ObjectId('abcdefghijkl')}] },function(err,data){
           console.log("Done");
        });
        users.insert({_id:new BSON.ObjectId('abcdefghijkl'),name:"Amir Chinaei",username:"amir",password:"J123!",email:"ahchinaei@upr.edu",office:"OF-310",
                    student: false,
                classes:[{class_id:new BSON.ObjectId('abcdefghijkl')}] },function(err,data){
           console.log("Done");
        });

        db.createCollection('items');
        var items = db.collection('items');
        items.insert({_id:new BSON.ObjectId('abcdefghijkl'),sprite: 'yellow-potion.png', classId:new BSON.ObjectId('abcdefghijkl'), className:'Web dev App', name:'No Sweat', effect:'Automatic A'},function(err,data){
           console.log("Done");
        });
        items.insert({_id:new BSON.ObjectId('bcdefghijklm'),sprite: 'scroll.png', classId:new BSON.ObjectId('abcdefghijkl'), className:'Web dev App', name:'Get Out of Jail' ,effect:'Eliminate worse grade'},function(err,data){
           console.log("Done");
        });
        
        db.createCollection('classes');
        var classes = db.collection('classes');
        classes.insert({_id:new BSON.ObjectId('abcdefghijkl'),name:'Web dev App',professor_id:new BSON.ObjectId('abcdefghijkl'),department:'CIIC',code:"5995",officeHours:'11:00pm-12:00am'},function(err,data){console.log('Done')});


        db.createCollection('assignments');
        var assignments = db.collection('assignments');
        assignments.insert({_id:new BSON.ObjectId('abcdefghijkl'),name:'Guess the Age',class_id:new BSON.ObjectId('abcdefghijkl'),
        description:'Guess their ages to get the full grade.',startDate: "2017-05-12", endDate: "2017-12-31",
        questions:[{description:"Stephan's Age?",type:'fill-blank',fillAnswer:'23'},
        {description:"Jose's Age?",type:'mult-choice',correct_choice:'2',choice1:'22',choice2:'23',choice3:'25',choice4:'timeless'}]},function(err,data){console.log('Done')});


        db.createCollection('answers');
        var answers = db.collection('answers');

        
        db.close();

    }
});
