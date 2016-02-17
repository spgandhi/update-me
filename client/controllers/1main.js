var app = angular.module('update-me');

app.constant('url', 'http://localhost:3000/#/home');

app.service('alldata', ['$q', 'toastr', function($q, toastr){

  var o = {
    content: Posts.find({}),
    organizations: Organizations.find({}),
    groups: Groups.find({}),
    allPosts: false,
    allOrganizations: false,
    allGroups: false,
    currentUser: '',
    loading: false,
    userData: ''
  }

  o.updateUser = function(){
    o.currentUser = Meteor.user();
  }

  o.isSuperAdmin = function(data){
    if(data && data.org_id){
      org = Organizations.findOne({_id: data.org_id});
      if(org){
        return Roles.userIsInRole(Meteor.userId(), 'can-manage', org._id);
      }
    }
    return false;
  }

  o.subscribeGroup = function(){
    Meteor.subscribe('groups');
  }

  o.check= function(){

    var deferred = $q.defer();

    if(o.currentUser==''){
      if(Meteor.userId())
        o.currentUser = Meteor.user();
    }
    
    if(!o.allPosts && o.currentUser){
      
      Meteor.subscribe('posts', function(){
        // console.log('Posts Subscribed');
        o.content = Posts.find({}).fetch();
        o.allPosts = true;
        
        if(o.allGroups && o.allOrganizations)
          deferred.resolve(o.content);

      })

    }

    if(!o.allGroups && o.currentUser){
      Meteor.subscribe('groups', function(){
        // console.log('Groups Subscribed');
        o.groups = Groups.find({}).fetch();
        o.allGroups = true;

        if(o.posts && o.allOrganizations)
          deferred.resolve(o.groups);
      })
    }

    if(!o.allOrganizations && o.currentUser){
      Meteor.subscribe('organizations', function(){
        // console.log('Orgs Subscribed');
        o.organizations = Organizations.find({}).fetch();
        o.allOrganizations = true;

        if(o.allGroups && o.allPosts)
          deferred.resolve(o.organizations);
      })
    }

    if(o.allGroups && o.allOrganizations && o.allPosts)
      deferred.resolve();

    return deferred.promise;
        
  }

  return o;

}])


app.controller('Home', ['$scope', 'alldata', '$meteor', 'toastr', function($scope, alldata, $meteor, toastr){

  $scope.yesGroup = false;
  
  var promise = alldata.check();
  
  promise.then(function(data){
    
    var start = new Date();
    start.setHours(0,0,0,0);

    var end = new Date();
    end.setHours(23,59,59,999);

    var tomorrow_start =  new Date();
    tomorrow_start.setDate(tomorrow_start.getDate() + 1);
    tomorrow_start.setHours(0,0,0,0);

    $scope.currentUser = alldata.currentUser;

    $scope.posts = Posts.find({post_status: 'publish'}).fetch();
    $scope.todayEvents = Posts.find({post_status: 'publish', 'options.isEvent': true, start_time: {$gte: start, $lt:end} }).fetch();
    $scope.upcomingEvents = Posts.find({'post_status':'publish', 'options.isEvent':true, start_time: {$gte: tomorrow_start}}).fetch();
    
    $scope.favourites = Meteor.user().profile.favourites;

    $scope.deadlinePost = Posts.find({'options.hasDeadline': true, deadline: {$gte: start}}).fetch();


  })

  $scope.getGroupPost = function(id){
    group = Groups.findOne( {_id:id} , {fields: {'name':1}});

    if(!group){
      return false;
    }

    posts = Posts.find( { 'group._id' : group._id, post_status: 'publish' } ).fetch();
    if(posts.length > 0){
      $scope.yesGroup = true;
    }
    return posts;

  }

  $scope.getGroupName = function(fav){
    return Groups.findOne({_id: fav}, {'fields': {'name':1}});
  }

  $scope.eventFilter = function() {
    
    if(!$scope.filter.options.isEvent){ 
      $scope.filter.options.isEvent = undefined;
      if(!$scope.filter.options.hasDeadline)
        $scope.filter.options.hasDeadline = undefined;
    }else{
      $scope.filter.options.hasDeadline = false;
    }
  }

  $scope.deadlineFilter = function() {
    
    if(!$scope.filter.options.hasDeadline){
      $scope.filter.options.hasDeadline = undefined;
      if(!$scope.filter.options.isEvent)
        $scope.filter.options.isEvent = undefined;
    }
    else
      $scope.filter.options.isEvent = false;
  }

  $scope.isNowEvent = function(post){
    
    if(post.options.isEvent){
      if( post.start_time < Date.now() && post.end_time > Date.now() ){
        $scope.nowEvent = true;
        return true;
      }
    }
    
    return false;

  }
    

  $scope.postOpen = function(id, location){
    Posts.update({_id: id}, {$push: {'options.clicks' : {location: location, time: Date.now()}}})
  }

}])

app.controller('Main', ['$scope','$rootScope', 'alldata' ,'Page-Title', 'toastr','$location', function ($scope, $rootScope, alldata, $page, toastr, $location) {  



  var promise = alldata.check();
  
  promise.then(function(data){
    $scope.posts = Posts.find({}).fetch();
    
    org = Organizations.findOne({name: 'DAIICT'});
    
    if(org)
      $scope.org_id = org._id;

    if(alldata.currentUser){
      if("profile" in alldata.currentUser && "name" in alldata.currentUser.profile){
        $scope.user = alldata.currentUser.profile.name;
      }else{
        $scope.user = alldata.currentUser.emails[0].address;
      }
    }

  })


  $scope.ifUser = function(){
    if(Meteor.userId()){
      $scope.currentUser = Meteor.user().emails[0].address;
      return true;
    }
    else
      return false;
  }

    // $scope.events = Posts.find({"options.isEvent": true}).fetch();
    
  

  $scope.logout = function(){
      
    Meteor.call('logoutServer', function(err, result){
      if(err)
        toastr.error('Could not logout!', 'Error');
      else{
        
        alldata.currentUser = '';
        alldata.userData = 'dirty';
        console.log(alldata.currentUser);

        toastr.success('Loged Out!', 'Success');
        $location.path('/login');    
      }
    })

  }

    
}]);


  
app.run(function ($rootScope, $location) {

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    var requireLogin = toState.data.requireLogin;
    if (requireLogin && !Meteor.userId() ) {
      $location.path('/login');
    }

    var onlySuperAdmin = toState.data.onlySuperAdmin;
    if( Meteor.user() && onlySuperAdmin ){
      
      Meteor.subscribe('organizations', function(){
        org = Organizations.findOne({'name': 'DAIICT'}, {'fields': {'_id':1}});

        if(!org || !Roles.userIsInRole(Meteor.userId(), ['can-manage'], org._id) ){
          $location.path('/home');
        }  
      })

      
    }

  });

});

app.factory('Page-Title', function() {
   var title = 'default';
   return {
     title: function() { return title; },
     setTitle: function(newTitle) { title = newTitle }
   };
});

app.run(function($rootScope, $location) {
    $rootScope.logout = function() {
        Meteor.logout();
        $location.path('/');
    };
});

app.config(function($provide) {
    $provide.decorator('$state', function($delegate, $stateParams) {
        $delegate.forceReload = function() {
            return $delegate.go($delegate.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        };
        return $delegate;
    });
});

app.filter("sanitize", ['$sce', function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  }
}]);