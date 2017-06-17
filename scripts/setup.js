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
                    studentId: "802122645",student: true,gold:1000,
                items:[{_id:'1'},{_id:'2'}],
             classes:[{_id:'1'}] },function(err,data){
           console.log("Done");
        });
        users.insert({username:"stephan",name:"Stephan",email:"stephan.elias@upr.edu",studentId: "802122645",
        password: "J123!",student: true,gold:2000, classes:[{_id:'1'}] },function(err,data){
           console.log("Done");
        });
        users.insert({_id:'3',name:"Amir Chinaei",username:"amir",password:"J123!",email:"ahchinaei@upr.edu",office:"OF-310",
                    student: false,
                classes:[{_id:'1'}] },function(err,data){
           console.log("Done");
        });

        db.createCollection('items');
        var items = db.collection('items');
        items.insert({_id:'1',sprite: 'yellow-potion.png', classId:'1', className:'CIIC5995', name:'Item 1', effect:'Testing'},function(err,data){
           console.log("Done");
        });
        items.insert({_id:'2',sprite: 'scroll.png', classId:'2', className:'ICOM5995', name:'Item 2' ,effect:'Testing 2'},function(err,data){
           console.log("Done");
        });
        
        db.createCollection('classes');
        var classes = db.collection('classes');
        classes.insert({_id:'1',name:'Web dev App',professor_id:'3',department:'CIIC',code:"5995",officeHours:'11:00pm-12:00am'},function(err,data){console.log('Done')});


        db.createCollection('assignments');
        var assignments = db.collection('assignments');
        assignments.insert({_id:'1',name:'Guess the Age',class_id:'1',
        description:'Guess their ages to get the full grade.',startDate: "2017-05-12", endDate: "2017-12-31",
        questions:[{description:"Stephan's Age?",type:'fill-blank',fillAnswer:'23'},
        {description:"Jose's Age?",type:'mult-choice',correct_choice:'choice2',choice1:'22',choice2:'23',choice3:'25',choice4:'timeless'}]},function(err,data){console.log('Done')});


        db.createCollection('answers');
        


    }
});
