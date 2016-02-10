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
      // resolve: {
      //   postPromise: ['alldata', function(alldata){
      //     return alldata.check();
      //   }]
      // }
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
      templateUrl: 'client/templates/pages/accounts/login.html',
      data: {
        requireLogin: false,
        onlySuperAdmin: false
      },
      controller: 'Login'
    })

    .state('register',{
      url: '/register',
      templateUrl: 'client/templates/pages/accounts/register.html',
      data: {
        requireLogin: false,
        onlySuperAdmin: false
      },
      controller: 'Register'
    })

    .state('group-create',{
      url: '/organization/:id/group/create',
      templateUrl: 'client/templates/pages/groups/create.html',
      data: {
        requireLogin: true,
        onlySuperAdmin: false
      },
      controller: 'Group'
    })

    .state('groups', {
      url: '/organization/:id/groups',
      templateUrl: 'client/templates/pages/groups/groups.html',
      data: {
        requireLogin: true,
        onlySuperAdmin: false
      },
      controller: 'Group'
    })

    .state('group-edit',{
      url: '/organization/:id/group/:grp_id/edit',
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

    .state('subscribe', {
      url: '/subscribe',
      templateUrl: 'client/templates/pages/subscribe.html',
      data: {
        requireLogin: true,
        onlySuperAdmin: true
      },
      controller: 'Subscribe'
    })

    // .state('all-groups', {
    //   url: '/groups',
    //   templateUrl: 'client/templates/pages/groups/all-groups.html',
    //   data: {
    //     requireLogin: true
    //   },
    //   controller: 'All-Groups'
    // })

    .state('resendVerification', {
      url: '/resendverification',
      templateUrl: 'client/templates/pages/accounts/resendVerification.html',
      data: {
        requireLogin: false,
        onlySuperAdmin: false
      },
      controller: 'ResendVerification'
    })

    .state('forgotPassword', {
      url: '/forgotpassword',
      templateUrl: 'client/templates/pages/accounts/forgotPassword.html',
      data: {
        requireLogin: false,
        onlySuperAdmin: false
      },
      controller: 'ForgotPassword'
    })

    .state('reset-password',{
      url: '/reset-password/:token',
      templateUrl: 'client/templates/pages/accounts/reset-password.html',
      data:{
        requireLogin: false,
        onlySuperAdmin: false
      },
      controller: 'ResetPassword'
    })

    .state('verifyEmail', {
      url: '/verify-email/:token',
      templateUrl: 'client/templates/pages/accounts/verify-email.html',
      data:{
        requireLogin: false,
        onlySuperAdmin: false
      },
      controller: 'VerifyEmail'

    })

  $urlRouterProvider.otherwise("/home");
});