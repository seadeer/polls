var pollsApp = angular.module('pollsApp', ['ngRoute', 'ngStorage']);

//CONFIG
    pollsApp.config(function($routeProvider){
    $routeProvider

    .when('/', {
        templateUrl: 'partials/login.html'
    })
    .when('/login', {
        templateUrl: 'partials/login.html'
        })
    .when('/home', {
        templateUrl: 'partials/pollsdash.html'
        })
    .when('/show', {
        templateUrl: 'partials/showpoll.html'
    })
    .when('/newpoll', {
        templateUrl: '/partials/newpoll.html'
    })

    .when('/logout', {
        redirectTo: '/login'
    })
    .otherwise({
        redirectTo: '/login'
    })
})

//User factory
pollsApp.factory('userFactory', function($http, $sessionStorage){
    var factory = {};
    //initialize session storing user
    $sessionStorage.currUser;

    //get user name from db (or create new in db) and store in session
    factory.login = function(newUser, callback){
        console.log("Factory sending off ", newUser)
        $http.post('/login', newUser).success(function(output){
            $sessionStorage.currUser = output;
            console.log($sessionStorage.currUser);
            callback(output);
        });
    };

    factory.logout = function(){
        console.log("logged out!");
        $sessionStorage.$reset();
    };

    factory.user = function(){
        return $sessionStorage.currUser;
    };

    return factory;
})
//User controller
pollsApp.controller('usersController', function(userFactory, $location){
    var that = this;
    this.login = function(){
        userFactory.login(that.newUser, function(data){
            that.newUser = data;
            $location.url('/home');
        });
    };

    this.logout = function(){
        console.log(that.user);
        $location.url('/login');
        that.user = {}
        usersFactory.logout()
    }

})
//Poll factory
pollsApp.factory('pollFactory', function($http){
    var factory = {};
    var that = this;

    factory.index = function(callback){
        $http.get('/polls').success(function(output){
            polls = output;
            callback(polls);
        })
    }

    factory.create = function(poll, callback){
        $http.post('/polls/new', poll).success(function(output){
            callback(output)
        })
    }

    factory.show = function(id, callback){
        $http.get('/polls/show/' + id).success(function(output){
            that.poll = output;
            callback(factory.poll);
        })
    }

    factory.getPoll = function(){
        console.log(that.poll);
        return that.poll;
    }

    factory.vote = function(ind){
        var id = that.poll._id;
        $http.post('/polls/vote/' + id, ind).success(function(output){
            that.poll = output;
        })
    }

    return factory;
})
//Poll controller
pollsApp.controller('pollsController', function(userFactory, pollFactory, $location){
    var that = this;
    //get poll from show function stored in the factory
    this.thePoll = pollFactory.getPoll();
    console.log("The Poll: ", this.thePoll);
    //get user stored in session in userFactory
    this.user = userFactory.user();
    this.index = function(){
        pollFactory.index(function(data){
            if(data){
                that.polls = data;
            }
        })

    }
    this.index();
   
    this.logout = function(){
        console.log(that.user);
        $location.url('/login');
        that.user = {}
        userFactory.logout();
    }

    this.create = function(){
        var options = that.newPoll.options
        console.log("This is what we get from the form:", that.newPoll.options)
        var poll_options = []
        for(i in options){
            poll_options.push({name: options[i], votes:0})
        }
        console.log("Poll options", poll_options);
        var poll = {
            question: that.newPoll.question,
            options: poll_options,
            author: that.user._id
        }
        console.log(poll)
        pollFactory.create(poll, function(data){
            console.log(data);
            that.newPoll = {};
        })
    };

    this.show = function(ind){
        console.log(that.polls[ind]);
        var id = that.polls[ind]._id;
        that.thePoll = pollFactory.show(id, function(data){
            that.thePoll = data;
            console.log("Got poll back! ", that.thePoll);
        })
    }

    this.vote = function(ind){
        console.log("Voting! ", ind)
        pollFactory.vote(ind, function(data){
            that.thePoll = data;
        })
    }

    this.delete = function(ind){
        console.log(that.polls[ind]);
        var id = that.polls[ind]._id;
        pollFactory.delete(id, function(data){
            
        })

    }

});

