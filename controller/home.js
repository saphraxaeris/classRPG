var path = require('path')

exports.getHome = function(req,res){

    res.sendFile(path.join(__dirname+'/view/home/index.html'));

}