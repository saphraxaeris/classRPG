var path = require('path');
var shortid = require('shortid');
var BSON = require('bson');

db = {};
exports.setVars = function(DB)
{
    db = DB;
}

/* Classes */
exports.getClasses = function(req,res){
    res.sendFile('classes.html',{root:"./view/classes"});
};

exports.classes = function(req,res){
   
    var users = db.collection('users');
    //console.log(req.body);
    id = new BSON.ObjectId(req.body._id);
    //console.log(id);
    users.findOne({_id:id}).then(function(user){
        if(user){
            //console.log(user);
            var classes = db.collection('classes');
            classList = []
            for(var i in user.classes){
               // console.log(user.classes);
               // console.log(user.classes[i].class_id);
               classList.push(new BSON.ObjectId(user.classes[i].class_id));
            }
            //console.log(classList);
                classes.find({_id:{$in:classList}}).toArray(function(err,cl){
                    if(cl){
                        //console.log(cl);
                        //console.log(classList);
                        profList = [];
                        for(var j in cl){
                            profList.push(new BSON.ObjectId(cl[j].professor_id));
                        }

                        users.find({_id:{$in:profList}}).toArray(function(err,prof){
                            if(prof){
                                
                                for(var k in prof){
                                    for(var l in cl){
                                        if(cl[l].professor_id.toString()==prof[k]._id.toString()){
                                            cl[l].professor = prof[k];}
                                    }
                                }
                                //console.log(cl);
                                res.send(cl);
                            }else{
                                //console.log('Nope');
                                //console.log(prof);
                                //console.log(classList);
                                res.status(400);
                                res.send('error');
                             }
                        });                        
                    }
                    else{
                        //console.log('Nope');
                        //console.log(cl);
                        //console.log(classList);
                        res.status(400);
                        res.send('error');
                    }
                });
        }
        else{
            res.status(400);
            res.send("Error - user not found.");
        }
    });
};

/* Class */
exports.class = function(req,res){
    var users = db.collection('users');
    users.findOne({_id:new BSON.ObjectID(req.query.userId)}).then(function(user){
        if(user){
            if(user.student){
                res.sendFile('classStudent.html',{root:"./view/classes"});
            }
            else{
                res.sendFile('classProfessor.html',{root:"./view/classes"});
            }
        }
        else{
            res.status(400);
            res.send("Error incorrect User");
        }
    });
};


exports.assignmentQuestions = function(req, res) {
    var assignments = db.collection('assignments');
    assignments.findOne({_id:new BSON.ObjectId(req.query.assignmentId)}).then(function(assignment){
        if(assignment){
            for(var i in assignment.questions){
                if(i.type =='fill-blank'){
                    delete(i.fillAnswer);
                }
                else{
                    delete(i.correct_choice);
                }
            }
            res.send(assignment);
        }
        else{
            res.status(400);
            res.send("Error - Incorrect assignment id");
        }
    });
    
};

exports.submitAssignment = function(req, res) {
    var assignments = db.collection('assignments');
    //console.log(req.body);
    assignments.findOne({_id:new BSON.ObjectId(req.body.assignmentId)}).then(function(assignment){
        if(assignment){
           // console.log(assignment);
            var questions = assignment.questions;
            var points = 0;
            for(var i =0;i<questions.length;i++)
            {
                if(questions[i].type=='fill-blank'&&questions[i].fillAnswer == req.body.answers[i].answer){
                    points++;
                }
                else if(questions[i].type=='mult-choice'&&questions[i].correct_choice == req.body.answers[i].answer){
                    points++;
                }
            }
            req.body.grade =  points*100/questions.length; 
            req.body.classId = new BSON.ObjectId(req.body.classId);
            req.body.assignmentId = new BSON.ObjectId(req.body.assignmentId);
            req.body.userId = new BSON.ObjectId(req.body.userId);
            var answers = db.collection('answers');
            answers.insert(req.body,function(err,data){
                if(err){
                    res.status(400);
                    res.send("Error inserting answers");
                }
                else{
                    res.send(true);
                }
            });
        }
        else{
            res.status(400);
            res.send('Error - Assignment could not be found');
        }
    });
};

exports.classInfoStudent = function(req,res){
    var classes = db.collection('classes');
    classes.findOne({_id:new BSON.ObjectID(req.query.classId)}).then(function(cl){
        if(cl){
            var users = db.collection('users');
            users.findOne({_id:new BSON.ObjectID(cl.professor_id)}).then(function(user){
                if(user){
                    delete(user.password);
                    cl.professor = user;
                    res.send(cl);
                }
                else{
                    res.status(400);
                    res.send("Error- Professor not found")
                }
            });
        }
        else{
            res.status(400);
            res.send('Error - Class not found');
        }
    });
};

exports.classInfoProfessor = function(req,res){
    var classes = db.collection('classes');
    classes.findOne({_id:new BSON.ObjectID(req.query.classId)}).then(function(cl){
        if(cl){
            var users = db.collection('users');
            users.findOne({_id:new BSON.ObjectID(cl.professor_id)}).then(function(user){
                if(user){
                    delete(user.password);
                    cl.professor = user;
                    //console.log(cl);
                    var items = db.collection('items');
                    items.find({classId:new BSON.ObjectId(cl._id)}).toArray(function(err,item){
                        if(item){
                            res.send({classInfo:cl,items:item});
                        }
                        else{
                            res.status(400);
                            res.send("Error - items not found");
                        }
                    });
                    
                }
                else{
                    res.status(400);
                    res.send("Error- Professor not found")
                }
            });
        }
        else{
            res.status(400);
            res.send('Error - Class not found');
        }
    });
};

exports.updateClassInfo = function(req,res){
    var classes = db.collection('classes');
    classes.findOne({_id:new BSON.ObjectId(req.body.classId)}).then(function(cl){
        if(cl){
            cl.officeHours = req.body.officeHours;
            classes.update({_id:cl._id},cl, function(err,results){
                if(err){
                    res.status(400);
                    res.send("Error Updating "+err);
                }
                else{
                    res.send(true);
                }
            });
        }
        else{
            res.status(200);
            res.send("Error - couldn't find class");
        }
    });
};

exports.addItem = function(req,res){
    var items = db.collection('items');
    var classes = db.collection('classes');
    classes.findOne({_id: new BSON.ObjectId(req.body.classId)}).then(function(cl){
        if(cl){
            req.body.className = cl.name;
            req.body.classId = new BSON.ObjectId(req.body.classId); 
            items.insert(req.body,function(err,result){
                if(err){
                    res.status(400);
                    res.send('Error - couldn\'t insert item');
                }
                else{
                    res.send(true);
                }
            });
        }
        else{
            res.status(400);
            res.send('Error - couldn\'t find class');
        }
    });
};

exports.assignment = function(req, res) {
    res.sendFile('assignment.html',{root:"./view/classes"});
};

exports.addAssignment = function(req, res){
    var assignments = db.collection('assignments');
    //
    req.body.class_id = new BSON.ObjectId(req.body.classId);
    assignments.insert(req.body,function(err,result){
        console.log(req.body);
        //console.log(result);
        if(err){
            res.status(400);
            res.send('Error');
        }else{
            res.send(true);
        }
    });

};
// exports.assignments = function(req,res){
//     res.send([{assignmentId:new BSON.ObjectId('abcdefghijkl'),name:'Guess the Age',classId:new BSON.ObjectId('abcdefghijkl'),
//         description:'Guess their ages to get the full grade.',startDate: "2017-05-12", endDate: "2017-12-31",
//         questions:[{description:"Stephan's Age?",type:'fill-blank',fillAnswer:'23'},
//         {description:"Jose's Age?",type:'mult-choice',correct_choice:'choice2',choice1:'22',choice2:'23',choice3:'25',choice4:'timeless'}]}])

// };
exports.assignments = function(req, res){
    var users = db.collection('users');
    var assignments = db.collection('assignments');
    
    users.findOne({_id:new BSON.ObjectId(req.query.userId)}).then(function(user){
        if(user){
            //console.log(user);
            assignments.find({class_id:new BSON.ObjectId(req.query.classId)}).toArray(function(err,assignment){
                    if(assignment){
                        //console.log(assignment);
                        if(user.student){
                            for(var i in assignment){
                                delete(assignment[i].questions);
                            }
                            
                            assignmentList = [];
                            for(var i in assignment){
                                assignmentList.push(new BSON.ObjectId(assignment[i]._id));
                            }
                            var answers = db.collection('answers');
                            answers.find({userId:new BSON.ObjectId(user._id),assignmentId:{$in:assignmentList}}).toArray(function(err,answer){
                                if(answer){
                                    //console.log(answer);
                                    for(var j in answer){
                                        for(var k in assignment){
                                            if(new BSON.ObjectId(assignment[k]._id).toString()==new BSON.ObjectId(answer[j].assignmentId).toString()){
                                                assignment[k].hasTaken = true;
                                            }
                                        }
                                    }
                                    //console.log(assignment);
                                    res.send(assignment);
                                }
                            });
                        }else{
                            //console.log(assignment);
                            res.send(assignment);
                        }
                       
                    }
                    else{
                        res.status(400);
                        res.send('Error - assignment was not found');
                    }
                });
        }
        else{
            res.status(400);
            res.send('Error - user was not found');
        }
    });
};

exports.whoHasTaken = function(req, res) {
    var users = db.collection('users');
    var answers = db.collection('answers');
    users.findOne({_id:new BSON.ObjectId(req.query.userId)}).then(function(user){
        //console.log(user);
        if(user && !user.student){
            answers.find({classId:new BSON.ObjectId(req.query.classId),assignmentId:new BSON.ObjectId(req.query.assignmentId)}).toArray(function(err,answer){
                if(answer){
                    studentList = [];
                    for(var i in answer){
                        studentList.push(new BSON.ObjectId(answer[i].userId));
                    }
                    users.find({_id:{$in:studentList}}).toArray(function(err,student){
                        if(student){
                            for(var j in answer){
                                for(var k in student){
                                    if(new BSON.ObjectId(answer[j].userId).toString() == new BSON.ObjectId(student[k]._id).toString()){
                                        answer[j].name = student[k].name;
                                        answer[j].studentId = student[k].studentId;
                                    }
                                }
                            }
                            //console.log(answer);
                            res.send(answer);
                        }
                        else{
                            res.status(400);
                            res.send('Error - Student not found');
                        }
                    });
                }
                else{
                    res.status(400);
                    res.send('Error - Answers not found');
                }
            });
        }
        else{
            res.status(401);
            res.send('Error - User is not a professor');
        }
    });
};

exports.whatHasTaken = function(req, res) {
    var answers = db.collection('answers');
    //console.log(req.query);
    answers.find({classId:new BSON.ObjectId(req.query.classId),userId:new BSON.ObjectId(req.query.userId)}).toArray(function(err,answer){
        if(answer){
            var assignments = db.collection('assignments');
            assignmentList =[]
            //console.log(answer);
            for(var i in answer){
               // console.log(i);
                assignmentList.push(new BSON.ObjectId(answer[i].assignmentId));
            }
            //console.log(assignmentList);
            assignments.find({_id:{$in:assignmentList}}).toArray(function(err,assignment){
                    if(assignment){
                        //console.log(assignment);
                        for(var j in assignment){
                            for(var k in answer){
                                if(new BSON.ObjectId(assignment[j]._id).toString()==new BSON.ObjectId(answer[k].assignmentId).toString())
                                {
                                    answer[k].assignmentName = assignment[i].name;
                                }
                            }
                        }
                        //console.log(answer);
                        res.send(answer);
                    }
                    else{
                        res.status(400);
                        res.send('Error - could not find assignment');
                    }
                }); 
        }
        else{
            res.status(400);
            res.send('Error - answers not found');
        }        
    });
};

exports.deleteAssignment = function(req, res) {
    var assignments = db.collection('assignments');
    //console.log(req.body);
    assignments.remove({_id:new BSON.ObjectId(req.body.assignmentId)},function(err,result){
        if(err){
            res.status(400);
            res.send('Error - could not remove');
        }else{
            res.send(true);
        }
    });
};