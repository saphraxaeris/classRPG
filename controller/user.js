var path = require('path');
var shortid = require('shortid');

db = {};
exports.setVars = function(DB)
{
    db = DB;
}

exports.login = function(req,res){
    var users = db.collection('users');
    console.log(req.body);
    users.findOne({username:req.body.username}).then(function(user) {
        console.log(shortid.generate());
        user.key = shortid.generate();
        console.log(user);
        users.update({_id:user._id},user,function(err, results) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
             } else {
                delete(user.password);
                res.send(user);
            }
        });
      });
   };

exports.register = function (req,res){
var users = db.collection('users');
users.findOne({username:req.body.username}).then(function(user) {
    user.key = shortid.generate();
    users.update({_id:user._id},user,function(err, results) {
        if (err) {
            res.send({'error':'An error has occurred - ' + err});
            } else {
            delete(user.password);
            res.send(user);
        }
    });
    });
};

exports.getLogin = function(req,res){
    res.sendFile('login.html',{root:"./view/user"});
}