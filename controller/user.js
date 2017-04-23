var path = require('path');

db = {};
exports.setVars = function(DB)
{
    db = DB;
}

exports.login = function(req,res){
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

exports.regiser = function (req,res){
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

exports.getLogin(req,res)
{
    res.sendFile(path.join(__dirname+'/view/user/login.html'));
}