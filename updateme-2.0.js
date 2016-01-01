Organizations = new Mongo.Collection('organizations');
Groups = new Mongo.Collection('groups');
// orgUsers = new Mongo.Collection('users');

if (Meteor.isClient) {
  
  angular.module('update-me',['angular-meteor', 'accounts.ui', 'ui.router', 'ngAnimate', 'toastr']);

  angular.module('update-me').config(function($urlRouterProvider, $stateProvider, $locationProvider){
 
      $stateProvider
        .state('home-page', {
          url: '/',
          templateUrl: 'client/templates/pages/home.html',
          data: {
            pageTitle: 'Dashboard',
            requireLogin: false
          },
          controller: 'Main'
        })

        .state('organization',{
          url: '/organization',
          templateUrl: 'client/templates/pages/organization/organization.html',
          data: {
            requireLogin: true
          },
          controller: 'Organization'
        })

        .state('organization-create',{
          url: '/organization/create',
          templateUrl: 'client/templates/pages/organization/create.html',
          data: {
            requireLogin: true
          },
          controller: 'Organization'
        })

        .state('org',{
          url: '/organization/:id',
          templateUrl: 'client/templates/pages/organization/single.html',
          data: {
            requireLogin: true
          },
          controller: 'Organization-Single'
        })

        .state('login',{
          url: '/login',
          templateUrl: 'client/templates/pages/accounts/login.html',
          data: {
            requireLogin: false
          },
          controller: 'Login'
        })

        .state('register',{
          url: '/register',
          templateUrl: 'client/templates/pages/accounts/register.html',
          data: {
            requireLogin: false
          },
          controller: 'Register'
        })

        .state('group-create',{
          url: '/organization/:id/group/create',
          templateUrl: 'client/templates/pages/groups/create.html',
          data: {
            requireLogin: true
          },
          controller: 'Group'
        })

        .state('group', {
          url: '/organization/:id/group',
          templateUrl: 'client/templates/pages/groups/groups.html',
          data: {
            requireLogin: true
          },
          controller: 'Group'
        })

        .state('group-edit',{
          url: '/organization/:id/group/:grp_id/edit',
          templateUrl: 'client/templates/pages/groups/edit.html',
          data: {
            requireLogin: true
          },
          controller: 'Group-Edit'
        })

        .state('org-edit', {
          url: '/organization/:id/edit',
          templateUrl: 'client/templates/pages/organization/edit.html',
          data: {
            requireLogin: true
          },
          controller: 'Org-Edit'
        })

        .state('group-single',{
          url: '/organization/:id/group/:grp_id',
          templateUrl: 'client/templates/pages/groups/single.html',
          data: {
            requireLogin: true
          },
          controller: 'Group-Single'
        })
 
      $urlRouterProvider.otherwise("/");
    });

  angular.module('update-me').controller('Group-Single', ['$scope', '$meteor', '$stateParams', 'toastr', function($scope, $meteor, $stateParams, toastr){
    Meteor.subscribe('groups',$stateParams['id'], function(){
      $scope.grp = Groups.findOne({_id: $stateParams['grp_id']});
      console.log($scope.grp);
    })
  }])

  // angular.module('update-me').factory('group_single_promise', ['$stateParams', function($stateParams){
  //   var o = {
  //     group: []
  //   }

  //   o.getGroup = function(){
  //     console.log($stateParams);
  //     console.log($stateParams['grp_id']);
  //     Meteor.subscribe('groups', $stateParams['id'], function(){
        
  //       grp = Groups.find({_id: $stateParams['grp_id']}).fetch();
  //       console.log(grp);
  //         // angular.copy(doc, o.group);
  //         // console.log('promise over');
  //         // return;
  //       // })
  //     });
  //   }

  //   return o;

  // }])

  angular.module('update-me').controller('Org-Edit', ['$scope', '$meteor', 'toastr', '$stateParams', function($scope, $meteor, toastr, $stateParams){
      Meteor.subscribe('organizations', function(){
        $scope.org = Organizations.findOne({_id: $stateParams['id']});
        console.log($scope.org);
        $scope.allowed_domains = $scope.org.options['domainAllowed'];
        $('#allowed-domains').tokenfield({
          minLength: 3,
          createTokensOnBlur: true,
          delimiter: [' ', ',']
        });
        $('#allowed-domains').tokenfield('setTokens', $scope.allowed_domains);
      });

      // $('#allowed-domains').tokenfield()
      //   .on('tokenfield:removetoken', function(e){
      //     $scope.org.options['domainAllowed'].splice($scope.org.options['domainAllowed'].indexOf(e.attrs.value),1)
      //   }).on('tokenfield:createdtoken', function(e){
      //     $scope.org.options['domainAllowed'].push(e.attrs.value);
      //   })

      $scope.updateOrg = function(){
        var domain = $('#allowed-domains').tokenfield('getTokensList').split(' ');

        $scope.org.options['domainAllowed'] = [];

        if(domain!=''){
          angular.forEach(domain, function(value, key){
            $scope.org.options['domainAllowed'].push(value);
          })
        }

        Organizations.update({_id: $scope.org._id}, $scope.org);
        toastr.success('Organization Updated!', 'Success');
      }

  }])

  angular.module('update-me').controller('Group-Edit', ['$scope', '$meteor', 'toastr', '$stateParams', function($scope, $meteor, toastr, $stateParams){
    
    $scope.grp_admin = [];

    $('#group-admins').tokenfield({
      minLength: 3,
      createTokensOnBlur: true,
      delimiter: [' ', ',']
    });

    Meteor.subscribe('groups', $stateParams['id'], function(){
      $scope.grp = Groups.findOne({_id: $stateParams['grp_id']})
      $('#group-admins').tokenfield('setTokens', $scope.grp.roles['can-manage']);
    });

    $scope.grp_admin = [];

    $('#group-admins').tokenfield()
      .on('tokenfield:removetoken', function(e){
        if(e.attrs.value == Meteor.user().emails[0].address){
          toastr.error('Sorry! Super admin email cannot be removed', 'Error');
          event.preventDefault();
          return false;
        }else{
          $scope.grp_admin.splice($scope.grp_admin.indexOf(e.attrs.value),1);
        }
      })
      .on('tokenfield:createdtoken', function(e){
        $scope.grp_admin.push(e.attrs.value);
      })


    
    $scope.editGroup = function(){
      $scope.grp.roles['can-manage'] = $scope.grp_admin;
      Groups.update({_id: $scope.grp._id}, $scope.grp);
      toastr.success('Group Updated!','Success');
    }
  
  }]);


  angular.module('update-me').controller('Main', ['$scope', 'Page-Title',
    function ($scope, $page) {
      if(Meteor.user()){
        $scope.currentUser = Meteor.user();
      }
    }
  ]);

  angular.module('update-me').controller('Group', ['$scope', '$location', '$meteor', 'toastr', '$stateParams', function($scope, $location, $meteor, toastr, $stateParams){
  
    $scope.org_id = $stateParams['id'];

    Meteor.subscribe('groups', $stateParams['id'], function(){
      $scope.groups = $meteor.collection(Groups);
    });

    $scope.newGroup = {
      options: {
        isPrivate: false
      }
    }

    $('#group-admins').tokenfield({
      minLength: 3,
      createTokensOnBlur: true,
      delimiter: [' ', ','],
      inputType: 'email'
    });

    $scope.removeToast = function(){
      toastr.success('Group Deleted', 'Success');
    }

    $scope.addGroup = function(){
      
      if(!$scope.newGroup.name){
        return;
      }

      $scope.newGroup.roles = {
          'can-manage': [Meteor.user().emails[0].address]
      };

      $scope.newGroup['created_by'] = Meteor.userId();

      var admins = $('#group-admins').tokenfield('getTokensList').split(' ');
      
      if(admins!=""){
        angular.forEach(admins, function(value, key){
          $scope.newGroup.roles['can-manage'].push(value);
        })
      }

      $scope.newGroup['org_id'] = $stateParams['id'];
      
      Groups.insert($scope.newGroup, function(){
        toastr.success('Group Added!', 'Success');
        $scope.newGroup = [];
        $('#group-admins').tokenfield('destroy');
      });

    }
    
  }])

  angular.module('update-me').controller('Organization', ['$scope', '$meteor', 'toastr', '$location', '$stateParams', function($scope, $meteor, toastr, $location, $stateParams){
    
    Meteor.subscribe('organizations', function(){
      $scope.organizations = $meteor.collection(Organizations);  
    });

    // Default New Organization Values
    $scope.newOrganization = {
      options: {
        domainAllowed: [],
        isPrivate: false
      },
      groups: []
    };

    $('#allowed-domains').tokenfield({
      minLength: 3,
      createTokensOnBlur: true,
      delimiter: [' ', ',']
    }).on('tokenfield:removedtoken', function(e){
      alert('removed' + e.attrs.value);
      var index = $scope.newOrganization.options['domainAllowed'].indexOf(e.attrs.value);
      $scope.newOrganization.options['domainAllowed'].splice(index, 1);
    })

    $scope.removeToast = function(){
      toastr.success('Organization deleted!', 'Success');
    }

    $scope.addOrganization = function(){

      if(!$scope.newOrganization.name){
        toastr.error('Please enter an organiztion name', 'Error');
      }else{

        $scope.newOrganization.options['domainAllowed'] = [];

        var domain = $('#allowed-domains').tokenfield('getTokensList').split(' ');

        if(domain!=''){
          angular.forEach(domain, function(value, key){
            $scope.newOrganization.options['domainAllowed'].push(value);
          })
        }

        if(Meteor.user()){
          
          $scope.newOrganization['roles'] = {
            'can-manage' : [Meteor.user().emails[0].address]
          }

          var org_id = Organizations.insert($scope.newOrganization, function(){
            toastr.success('Organization Added!', 'Success');
            $scope.newOrganization = [];
            $('#allowed-domains').tokenfield('destroy');
          });  

        }else{
          toastr.error('Please login!', 'Error');
          $location.path('/login');
        }
        
      }
    }

  }])

  angular.module('update-me').controller('Register', ['$scope', 'toastr', function($scope, toastr){
    
    $scope.register = function(){
      Accounts.createUser({email: $scope.newUser.email, password: $scope.newUser.password}, function(err){
        
        if(err){
          toastr.error(err.reason, 'Error');
        }else{
          toastr.success('Registration Successful', 'Success');
          $scope.newUser = [];
        }

      });
    }
  }])

  angular.module('update-me').controller('Login', ['$scope', 'toastr','$location', function($scope, toastr, $location){
    
    $scope.Login = function(){

      
      Meteor.loginWithPassword($scope.user.email, $scope.user.password, function(err){
        
        if(err){
          toastr.error(err.reason, 'Error');
        }else{
          toastr.success('Welcome back!', 'Success');
          $location.path('/organization')
        }

      });
    }
  }])

  angular.module('update-me').controller('Organization-Single', ['$scope', '$meteor','$stateParams', 'toastr', function($scope, $meteor, $stateParams, $toastr){

    Meteor.subscribe('organizations', function(){
      $scope.org = Organizations.findOne($stateParams['id']);
    });

  }])
  
  angular.module('update-me').run(function ($rootScope, $location) {

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
      var requireLogin = toState.data.requireLogin;
      if (requireLogin && !Meteor.user() ) {
          // $location.path('/login');
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

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.publish('groups', function(orgId){
    return Groups.find({org_id: orgId});
  })

  Meteor.publish('organizations', function(){
    return Organizations.find({_id: {$in: Roles.getGroupsForUser( this.userId ) }});
  });

  Meteor.publish('allUsers', function(){
    return Meteor.users.find({},{'emails':1});
  })

  Organizations.after.insert(function(userId, doc){
    Roles.addUsersToRoles(userId, ['can-manage'], this._id);
  })

  Groups.after.insert(function(userId, doc){

    for(i=0; i< doc.roles['can-manage'].length; i++){
      id = Meteor.users.findOne({'emails.address':doc.roles['can-manage'][i]}, {'_id':1});  
      if(id != userId)
        Roles.addUsersToRoles(id, ['can-manage'], this._id)
    };
  
    Organizations.update({_id: doc.org_id}, {$push: {groups: doc._id}});
  
  })

  Groups.after.remove(function(userId, doc){

    for(i=0;i<doc.roles['is-subscribed'].length; i++){
      user_id = Meteor.users.findOne({'emails.address': doc.roles['is-subscribed'][i]})._id;
      Roles.setUserRoles(user_id, [], doc._id);
    }

    for(i=0; i<doc.roles['can-manage'].length; i++){
      user_id = Meteor.users.findOne({'emails.address': doc.roles['can-manage'][i]})._id;
      Roles.setUserRoles(user_id, [], doc._id); 
    }

    Organizations.update({_id: doc.org_id}, {$pullAll: {groups: [doc._id]}});

  });

  Groups.after.update(function(userId, doc, fieldNames, modifier, options){
    Array.prototype.diff = function(a) {
      return this.filter(function(i) {return a.indexOf(i) < 0;});
    };

    to_add = doc.roles['can-manage'].diff(this.previous.roles['can-manage']);
    
    for(i=0; i<to_add.length; i++){
      user_id = Meteor.users.findOne({'emails.address': to_add[i]});
      Roles.addUsersToRoles(user_id, ['can-manage'], doc._id)
    }

    to_remove = this.previous.roles['can-manage'].diff(doc.roles['can-manage']);

    for(i=0; i<to_remove.length; i++){

      user_id = Meteor.users.findOne({'emails.address': to_remove[i]});
      Roles.setUserRoles(user_id, [], doc._id);
    }

  })

}
