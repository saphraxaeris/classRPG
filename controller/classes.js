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
            console.log(classList);
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
                                console.log(cl);
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
    assignments.findOne({_id:req.query.assignmentId}).then(function(assignment){
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
    assignments.findOne({_id:new BSON.ObjectId(req.body.assignmentId)}).then(function(assignment){
        if(assignment){
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
            var answers = db.collection('answers');
            answers.insert(req.body,function(err,data){
                if(err){
                    res.status(400);
                    res.send("Error inserting answers");
                }
                else{
                    res.send(200);
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
                    var items = db.collection('items');
                    items.find({class_id:cl._id}).then(function(items){
                        if(items){
                            res.send({classInfo:cl,items:items});
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
                    res.send(200);
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
            items.insert(req.body,function(err,result){
                if(err){
                    res.status(400);
                    res.send('Error - couldn\'t insert item');
                }
                else{
                    res.send(200);
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
    assignments.insert(req.body,function(err,result){
        if(err){
            res.status(400);
            res.send('Error - Could not insert '+ err);
        }
    });

};

exports.assignments = function(req, res){
    var users = db.collection('users');
    var assignments = db.collection('assignment');
    var answers = db.collection('answers');
    users.findOne({_id:new BSON.ObjectId(req.query.userId)}).then(function(user){
        if(user){
            assignments.find({class_id:new BSON.ObjectId(req.query.classId)}).then(function(assignment){
                    if(assignment){
                        if(user.student){
                            for(var i in assignment){
                                answers.findOne({assigment_id:assignment._id,user_id:user._id}).then(function(answer){
                                    if(answer){
                                        i.hasTaken = true;
                                    }
                                });
                            }
                            delete(i.questions);
                        }
                        res.send(assignment);
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
    users.findOne({_id:new BSON.ObjectId(req.query.user_id)}).then(function(user){
        if(user && !user.student){
            answers.find({class_id:new BSON.ObjectId(req.query.classId),assignment_id:new BSON.ObjectId(req.query.assignmentId)}).then(function(answer){
                if(answer){
                    for(var i in answer){
                        users.findOne({_id:i.user_id}).then(function(student){
                            if(student){
                                i.name = student.name;
                                istudentId = student.studentId;
                            }
                            else{
                                res.status(400);
                                res.send('Error - Student not found');
                            }
                        });
                    }
                    res.send(answer);
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
    answers.find({class_id:new BSON.ObjectId(req.query.classId),user_id:new BSON.ObjectId(req.query.userId)}).then(function(answer){
        if(answer){
            var assignments = db.collection('assignments');
            for(var i in answer){
                assignments.findOne({_id:i.assignment_id}).then(function(assignment){
                    if(assignment){
                    i.assignmentName = assignment.name;
                    }
                    else{
                        res.status(400);
                        res.send('Error - could not find assignment');
                    }
                }); 
            }
            res.send(answer);
        }
        else{
            res.status(400);
            res.send('Error - answers not found');
        }        
    });
};

exports.deleteAssignment = function(req, res) {
    var asnwers = db.collection('answers');
    answers.remove({user_id:new BSON.ObjectId(req.body.userId),assignment_id:new BSON.ObjectId(req.body.assignmentId)},function(err,result){
        if(err){
            res.status(400);
            res.send('Error - could not remove');
        }else{
            res.send(200);
        }
    });
};