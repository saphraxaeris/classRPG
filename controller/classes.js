

/* Classes */
exports.getClasses = function(req,res){
    res.sendFile('classes.html',{root:"./view/classes"});
};

exports.classes = function(req,res){
    res.send([{id: '1', name:'Test class 1', department:'Department', code:'ICOM4998', professor: { name: 'Amir'}}, {id: '2', name:'Test class 2', department:'Department', code:'CIIC4998', professor: { name: 'Amir'}}]);
};

/* Class */
exports.class = function(req,res){
    //res.sendFile('classStudent.html',{root:"./view/classes"});
    res.sendFile('classProfessor.html',{root:"./view/classes"});
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