var mongoose = require('mongoose');
var User = mongoose.model('User');
var Poll = mongoose.model('Poll');

module.exports = {
    index: function(req, res){
        Poll.find({}).populate('_user').exec(function(err, polls){
            if(polls.length < 1){
                res.json("No polls yet!");
            }
            else if(err){
                res.json(err);
            }
            else{
                res.json(polls);
            }
        });
    },

    create: function(req, res){
        console.log(req.body);

        Poll.findOne({question: req.body.question}, function(err, poll){
            if(err){
                res.json(err);
            }
            else{
                if(poll){
                    res.json("Poll already exists!");
                }
                else{
                    User.findOne({_id:req.body.author}, function(err, user){
                        var poll = new Poll({
                        question: req.body.question,
                        _user: req.body.author,
                        options: req.body.options,
                        });
                        //set reference to user
                        poll._user = req.body.author;
                        user.polls.push(poll);
                        //save poll to db
                        poll.save(function(err, poll){
                        console.log(poll, "saving new poll");
                        if(err){
                            res.json(err);
                            }
                        else{res.json(poll)};
                    })
                   
                    });
                }
            }
        });
         
    },

    show: function(req, res){
        Poll.findById(req.params.id, function(err, poll){
            if(err){
                res.json(err)
            }
            else{
                console.log(poll);
                res.json(poll);
            }
        })
    },

    vote: function(req, res){
        console.log("Voting! ", req.body);
        Poll.update({_id: req.body._id}, {options: req.body.options}, function(err, poll){
             if(err){
                res.json(err);
            }
            else{
                res.json(poll);
                }
            }
        );
    },

    delete: function(req, res){
        Poll.remove({_id:req.params.id}, function(err, polls){
            if(err){
                res.json(err)
            }
            else{
                res.json("Deleted 1 poll!")
            }
        })
    }

    
};
