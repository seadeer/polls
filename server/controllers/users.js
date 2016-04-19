var mongoose = require('mongoose');
var User = mongoose.model('User');
var Poll = mongoose.model('Poll');

module.exports = {
    login: function(req, res){
        console.log("Logging in... ", req.body);
        User.findOne({name:req.body.name}, function(err, user){
            if(err){
                res.json(err);
            }
            else{
                if(user){
                    console.log("User exists: ", user);
                    res.json(user);
                }
                else{
                    var user = new User(req.body);
                    user.save(function (err, user){
                        console.log(user, " saving new user");
                        if(err){
                            res.json(err);
                        }
                        else{
                            res.json(user);
                        }
                    });
                };
            }
        });
    }
}
