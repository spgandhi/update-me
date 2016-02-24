angular.module('update-me').config(function($urlRouterProvider, $stateProvider, $locationProvider){

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'client/templates/pages/home.html',
      data: {
        pageTitle: 'Dashboard',
        requireLogin: true,
        onlySuperAdmin: false
      },
      controller: 'Home'  
      
    })

    .state('organization',{
      url: '/organization',
      templateUrl: 'client/templates/pages/organization/organization.html',
      data: {
        requireLogin: true,
        onlySuperAdmin: true
      },
      controller: 'Organization'
    })

    .state('organization-create',{
      url: '/organization/create',
      templateUrl: 'client/templates/pages/organization/create.html',
      data: {
        requireLogin: true,
        onlySuperAdmin: true
      },
      controller: 'Organization'
    })

    .state('org',{
      url: '/organization/:id',
      templateUrl: 'client/templates/pages/organization/single.html',
      data: {
        requireLogin: true,
        onlySuperAdmin: true
      },
      controller: 'Organization-Single'
    })

    .state('login',{
      url: '/login',
      views:{
        "login" : {
          templateUrl: 'client/templates/layout/login.html',
          controller: 'Login'
        }
      },
      
      data: {
        requireLogin: false,
        onlySuperAdmin: false
      }
    })

    .state('register',{
      url: '/register',
      views:{
        "register": {
          templateUrl: 'client/templates/layout/register.html',    
          controller: 'Register'
        }
      },
      data: {
        requireLogin: false,
        onlySuperAdmin: false
      },
      
    })

    .state('group-create',{
      url: '/group/create',
      templateUrl: 'client/templates/pages/groups/create.html',
      data: {
        requireLogin: true,
        onlySuperAdmin: false
      },
      controller: 'Group-Create'
    })

    .state('groups', {
      url: '/groups',
      templateUrl: 'client/templates/pages/groups/groups.html',
      data: {
        requireLogin: true,
        onlySuperAdmin: false
      },
      controller: 'Group'
    })

    .state('group-edit',{
      url: '/group/:grp_id/edit',
      templateUrl: 'client/templates/pages/groups/edit.html',
      data: {
        requireLogin: true,
        onlySuperAdmin: false
      },
      controller: 'Group-Edit'
    })

    .state('org-edit', {
      url: '/organization/:id/edit',
      templateUrl: 'client/templates/pages/organization/edit.html',
      data: {
        requireLogin: true,
        onlySuperAdmin: true
      },
      controller: 'Org-Edit'
    })

    .state('group-single',{
      url: '/organization/:id/group/:grp_id',
      templateUrl: 'client/templates/pages/groups/single.html',
      data: {
        requireLogin: true,
        onlySuperAdmin: false
      },
      controller: 'Group-Single'
    })

    .state('post-create', {
      url: '/post/create',
      templateUrl: 'client/templates/pages/posts/create.html',
      data: {
        requireLogin: true,
        onlySuperAdmin: false
      },
      controller: 'Post-Create'
    })

    .state('posts', {
      url: '/posts',
      templateUrl: 'client/templates/pages/posts/posts.html',
      data: {
        requireLogin: true,
        onlySuperAdmin: false
      },
      controller : 'Posts'
    })

    .state('posts-edit',{
      url: '/posts/:id/edit',
      templateUrl: 'client/templates/pages/posts/edit.html',
      data: {
        requireLogin: true,
        onlySuperAdmin: false
      },
      controller : 'Posts-Edit'
    })

    .state('resendVerification', {
      url: '/resendverification',
      views:{
        'others': {
          templateUrl: 'client/templates/pages/accounts/resendVerification.html',
          controller: 'ResendVerification'
        }
      },
      data: {
        requireLogin: false,
        onlySuperAdmin: false
      }

    })

    .state('forgotPassword', {
      url: '/forgotpassword',
      views: {
        'others': {
          templateUrl: 'client/templates/pages/accounts/forgotPassword.html',
          controller: 'ForgotPassword'
        }  
      },
      data: {
        requireLogin: false,
        onlySuperAdmin: false
      },
    })

    .state('reset-password',{
      url: '/reset-password/:token',
      views:{
        'others':{
          templateUrl: 'client/templates/pages/accounts/reset-password.html',    
          controller: 'ResetPassword'
        }
      },
      data:{
        requireLogin: false,
        onlySuperAdmin: false
      }
    })

    .state('verifyEmail', {
      url: '/verify-email/:token',
      views:{
        'others': {
          templateUrl: 'client/templates/pages/accounts/verify-email.html',    
          controller: 'VerifyEmail'
        }
      },
      
      data:{
        requireLogin: false,
        onlySuperAdmin: false
      }
      

    })

    .state('favourites', {
      url: '/favourites',
      templateUrl: 'client/templates/pages/groups/groups-favourite.html',
      data: {
        requireLogin: true,
        onlySuperAdmin: false
      },
      controller: 'Groups-Favourite'
    })

    .state('email',{
      url: '/email',
      views:{
        'others':{
          templateUrl: 'client/templates/emails/events.html',    
          controller: 'Event-Email',
        }
      },
      data:{
        requireLogin: true,
        onlySuperAdmin: false
      }
      
    })

    .state('profile', {
      url: '/profile',
      templateUrl: 'client/templates/pages/accounts/profile.html',
      controller: 'Profile',
      data:{
        requireLogin: true,
        onlySuperAdmin: false
      }
      
    })

    .state('subscribe', {
      url: '/subscribe',
      templateUrl: 'client/templates/pages/groups/subscribe.html',
      controller: 'Group-Subscribe',
      data: {
        requireLogin: true,
        onlySuperAdmin: false
      }
    })

  $urlRouterProvider.otherwise("/home");
});