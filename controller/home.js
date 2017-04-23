var path = require('path')

exports.getHome = function(req,res){

    res.sendFile('index.html',{root:"./view/home"});

}