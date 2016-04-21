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
    .when('/show/:id', {
        templateUrl: 'partials/showpoll.html',
        controller: 'pollsController as PC'
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
        console.log(id);
        $http.get('/polls/show/' + id).success(function(output){
            that.poll = output;
            callback(that.poll);
        })
    }

    factory.getPoll = function(){
        console.log(that.poll);
        return that.poll;
    }

    factory.vote = function(thePoll){
        var id = thePoll._id;
        $http.post('/polls/vote/' + id, thePoll).success(function(output){
            console.log(output)
            that.poll = output;
        })
    }

    factory.delete = function(id){
        $http.post('/polls/delete/' + id).success(function(output){
            console.log(output);
        })
    }

    return factory;
})
//Poll controller
pollsApp.controller('pollsController', function(userFactory, pollFactory, $location, $routeParams){
    var that = this;
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
        $location.url('/home');
    };

    this.show = function(id){
        var id = $routeParams.id;
        console.log("my id, ", id)
        pollFactory.show(id, function(data){
            that.thePoll = data;
            console.log("Got poll back! ", that.thePoll);
            $location.url('/show/'+id);
        });
    };

    this.vote = function(ind){
        that.thePoll.options[ind].votes++
        console.log("Voting!", that.thePoll.options)
        pollFactory.vote(that.thePoll, function(data){
            that.thePoll = data;
        });
    };

    this.delete = function(ind){
        console.log(that.polls[ind]);
        var id = that.polls[ind]._id;
        pollFactory.delete(id);
        that.index();
    };

});

