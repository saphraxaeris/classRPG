var path = require('path');
var shortid = require('shortid');
var BSON = require('bson');
  user._id = new BSON.ObjectID(user._id).toString();
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

    users.findOne({_id:req.body._id}).then(function(user){
        if(user){
            var classes = db.collection('classes');
            classList = []
            for(var i in user.classes){
                classes.findOne({_id:i._id}).then(function(cl){
                    if(cl){classList.push(cl);}
                });
            }
            res.send(classList);
        }
        else{
            res.status(400);
            res.send("Error - user not found.");
        }
    });
};

/* Class */
exports.class = function(req,res){
    res.sendFile('classStudent.html',{root:"./view/classes"});
    //res.sendFile('classProfessor.html',{root:"./view/classes"});
};

exports.assignment = function(req, res) {
    res.sendFile('assignment.html',{root:"./view/classes"});
};

exports.assignmentQuestions = function(req, res) {
    var data = { assignmentName: "Test Assignment", assignmentDescription: "Testing the description of this assignment" };
    var questions = [{description: "test test test test test ____ test.", type:"fill-blank"}, {description: "What # follows 1?", type:"mult-choice", choice1: "A", choice2: "34", choice3: "Dog", choice4: "2" }];
    data.questions = questions;
    res.send(data);
};

exports.submitAssignment = function(req, res) {
    res.send(true);
};

exports.classInfoStudent = function(req,res){
    var user = {id: 'test', username: 'ahchinaei', name: 'Amir H. Chinaei', email: 'ahchinaei@ece.uprm.edu', student: false, office: 'OH-326'};
    var classInfo = { id:'test', name:'Wed Development', professor: user, department: 'CIIC', code:'CIIC5995', officeHours: 'Tuesdays & Thursday @ 2:30pm - 3:30pm'  };
    res.send(classInfo);
};

exports.classInfoProfessor = function(req,res){
    var user = {id: 'test', username: 'ahchinaei', name: 'Amir H. Chinaei', email: 'ahchinaei@ece.uprm.edu', student: false, office: 'OH-326'};
    var classInfo = { id:'test', name:'Wed Development', professor: user, department: 'CIIC', code:'CIIC5995', officeHours: 'Tuesdays & Thursday @ 2:30pm - 3:30om'  };
    var items = [{sprite: 'yellow-potion.png', id: '1', classId:'1', className:'CIIC5995', name:'Item 1', effect:'Testing'}, {sprite: 'scroll.png', id: '2', classId:'2', className:'ICOM5995', name:'Item 2' ,effect:'Testing 2'}];
    res.send({ classInfo: classInfo, items:  items});
};

exports.updateClassInfo = function(req,res){
    res.send(true);
};

exports.addItem = function(req,res){
    res.send(true);
};

exports.assignments = function(req, res){
    var data = [{ assignmentId: 0, classId: 0, name: "Test Assignment", description: "Test description", startDate: "28 June, 2017", endDate: "29 June, 2017", hasTaken: true}, { assignmentId: 1, classId: 1, name: "Test Assignment 2", description: "Test description 2", startDate: "28 June, 2017", endDate: "29 June, 2017", hasTaken: false}]
    res.send(data);
};

exports.whoHasTaken = function(req, res) {
    var data = [{ userId: "0", name: "Stephan Elias Remy", studentId: "802-12-2205", grade: "98%", itemEffect: "Test Item was used" }];
    res.send(data);
};

exports.whatHasTaken = function(req, res) {
    var data = [{ assignmentName: "Test", grade: "98%", itemEffect: "Test Item was used" }];
    res.send(data);
};

exports.deleteAssignment = function(req, res) {
    res.send(true);
};