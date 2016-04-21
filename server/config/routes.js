var users = require('../controllers/users');
var polls = require('../controllers/polls');

module.exports = function(app){
    app.get('/', function(req, res){
        console.log("Hello, I'm working!");
    });

    app.get('/logout', function(req, res){
        console.log('logged out');
    });

    app.post('/login', function(req, res){
        users.login(req, res);
    });

    app.get('/polls', function(req, res){
        polls.index(req, res);
    });

    app.post('/polls/new', function(req, res){
        polls.create(req, res);
    });

    app.get('/polls/show/:id', function(req, res){
        polls.show(req, res);
    })

    app.post('/polls/vote/:id', function(req, res){
        polls.vote(req, res);
    })

    app.post('/polls/delete/:id', function(req, res){
        polls.delete(req, res);
    })

}
