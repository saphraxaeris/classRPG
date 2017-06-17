var path = require('path');
var shortid = require('shortid');

db = {};
exports.setVars = function(DB)
{
    db = DB;
}

/* Login */
exports.getLogin = function(req,res){
    res.sendFile('login.html',{root:"./view/user"});
};

exports.login = function(req,res){
    var users = db.collection('users');
    console.log(req.body);
    users.findOne({username:req.body.username}).then(function(user) {
        console.log(shortid.generate());
        user.key = shortid.generate();
        console.log(user);
        users.update({_id:user._id},user,function(err, results) {
            if (err) {
                res.status(400);
                res.send('An error has occurred - ' + err);
             } else {
                delete(user.password);
                res.send(user);
            }
        });
      });
   };

/* Register */
exports.getRegister = function(req,res){
    res.sendFile('register.html',{root:"./view/user"});
};

exports.register = function (req,res){
var users = db.collection('users');
users.findOne({username:req.body.username}).then(function(user) {
    if(user){
        res.status(400);
        res.send('An error has occurred - User Exists');
    }
    else{
        users.insert(req.body,function(err,data){
           delete(req.body.password);
           res.send(req.body);
        });
    }    
});
};

/* Profile */
exports.getProfile = function(req,res){
    res.sendFile('profile.html',{root:"./view/user"});
};

exports.profile = function(req,res){
    var users = db.collection('users');
    users.findOne({username:req.body.username}).then(function(user) {
        if(user){
            user.password = req.body.password;
            users.update({_id:user._id},user,function(err, results) {
                if (err) {
                    res.status(400);
                    res.send('An error has occurred - ' + err);
                } else {
                    res.send(200);
                }
        });
        }
        else{
            res.status(400);
            res.send('An error has occurred - ');
        }    
    });
};

/* Inventory */
exports.getInventory = function(req,res){
    res.sendFile('inventory.html',{root:"./view/user"});
};

exports.inventory = function(req,res){
    var users = db.collection('users');
    users.findOne({username:req.body.username}).then(function(user) {
        if(user){
            itemList = []
            var items = db.collection('items');
            for(var i in user.items){
                items.findOne({_id:i._id}).then(function(item){
                    if(item){itemList.push(item);}
                });
            }
            res.send(itemList);

        }
        else{
            res.status(400);
            res.send('An error has occurred - User does not exist');
        }
    });
    
};