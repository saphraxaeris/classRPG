

/* Classes */
exports.getClasses = function(req,res){
    res.sendFile('classes.html',{root:"./view/classes"});
};

exports.classes = function(req,res){
    res.send(true);
};

/* Class */
exports.class = function(req,res){
    res.sendFile('classStudent.html',{root:"./view/classes"});
    //res.sendFile('classProfessor.html',{root:"./view/classes"});
};