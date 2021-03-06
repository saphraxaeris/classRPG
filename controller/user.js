var path = require('path');
var shortid = require('shortid');
var BSON = require('bson');
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

exports.profiler = function(req,res){
    var users = db.collection('users');
    console.log('Here');
    users.findOne({username:req.body.username}).then(function(user) {
        console.log(user);
        if(user){
            user.password = req.body.password;
            users.update({username:req.body.username},user,function(err, results) {
                res.send(true);
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
    //console.log(req.body);
    users.findOne({username:req.body.username}).then(function(user) {
        if(user){
            itemList = []
            var items = db.collection('items');
            for(var i in user.items){
                itemList.push(user.items[i].item_id);
            }
            items.find({_id:{$in:itemList}}).toArray(function(err,result){
               
                user.items = result;
                res.send(result);
            });
            

        }
        else{
            res.status(400);
            res.send('An error has occurred - User does not exist');
        }
    });
    
};