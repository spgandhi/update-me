angular.module('update-me').service('alldata', ['$q', function($q){
  
  var o = {
    content: Posts.find({}),
    organizations: Organizations.find({}),
    groups: Groups.find({}),
    allPosts: false,
    allOrganizations: false,
    allGroups: false,
    currentUser: ''
  }

  // o.getPosts = function(){
  //   console.log('something called');
  //   Meteor.subscribe('posts', function(){
  //     o.content = Posts.find({}).fetch();
  //     console.log(o.content);
  //     o.allPosts = true;
  //   })
  // }

  o.subscribeGroup = function(){
    Meteor.subscribe('groups');
  }

  o.content.observe({
    added: function(id, fields){
    }
  });

  o.groups.observe({
    added: function(id, fields){
    }
  })

  o.add = function(type, content){
    
    var deferred = $q.defer();

    if(type == 'post'){
      Posts.insert(content);
      deferred.resolve();
    } else if(type == 'group'){
      Groups.insert(content);
      deferred.resolve();
    }else if(type == 'organization'){
      Organizations.insert(content);
      deferred.resolve();
    }

    return deferred.promise;
  }

  o.removePost = function(post){    
    Posts.remove({_id:post._id});
    o.content.splice(o.content.indexOf(post), 1);
  }

  o.check= function(){

    var deferred = $q.defer();

    if(!o.currentUser){
      if(Meteor.userId())
        o.currentUser = Meteor.userId();
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


angular.module('update-me').controller('Home', ['$scope', 'alldata', '$meteor', 'toastr', function($scope, alldata, $meteor, toastr){

  var promise = alldata.check();
  
  promise.then(function(data){
    $scope.currentUser = alldata.currentUser;
    $scope.posts = Posts.find({}).fetch();
  })

}])

angular.module('update-me').controller('Main', ['$scope','$rootScope', 'alldata' ,'Page-Title', 'toastr','$location', function ($scope, $rootScope, alldata, $page, toastr, $location) {  

  $scope.ifUser = function(){
    if(Meteor.userId()){
      $scope.currentUser = Meteor.user().emails[0].address;
      return true;
    }
    else
      return false;
  }

 

 


    // $scope.events = Posts.find({"options.isEvent": true}).fetch();
    
    $scope.isNowEvent = function(post){
      
      if(post.options.isEvent){
        if( post.start_time < Date.now() && post.end_time > Date.now() )
          return true;
      }
      
      return false;

    }
    
    $scope.isTodayEvent = function(post){
      if(post.options.isEvent){
        if( moment(post.start_time).isSame(Date.now(), 'day'))
          return true;
      }
      
      return false;

    }
      
    $scope.isTomorrowEvent = function(post){
      if(post.options.isEvent){
        if( moment(post.start_time).isSame( moment(Date.now()).add(1,'day'), 'day') )
          return true;
      }
      
      return false;

    }

  $scope.logout = function(){
    Meteor.logout(function(err){
      if(err)
        toastr.error('Could not logout!', 'Error');
      else
        toastr.success('Loged Out!', 'Success');
        $location.path('/login');    
    });
    

  }
}]);

  
angular.module('update-me').run(function ($rootScope, $location) {

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    var requireLogin = toState.data.requireLogin;
    if (requireLogin && !Meteor.userId() ) {
      $location.path('/login');
    }

    var onlySuperAdmin = toState.data.onlySuperAdmin;
    if( Meteor.user() && onlySuperAdmin ){
      
      Meteor.subscribe('organizations', function(){
        org_id = Organizations.findOne({'name': 'DAIICT'}, {'fields': {'_id':1}})._id;
        if( !Roles.userIsInRole(Meteor.userId(), ['can-manage'], org_id) ){
          $location.path('/home');
        }  
      })

      
    }

  });

});

angular.module('update-me').factory('Page-Title', function() {
   var title = 'default';
   return {
     title: function() { return title; },
     setTitle: function(newTitle) { title = newTitle }
   };
});

angular.module('update-me').run(function($rootScope, $location) {
    $rootScope.logout = function() {
        Meteor.logout();
        $location.path('/');
    };
});

angular.module('update-me').config(function($provide) {
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