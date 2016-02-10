// Create
angular.module('update-me').controller('Post-Create', ['$scope', 'alldata', '$meteor', 'toastr', function($scope, alldata, $meteor, toastr){
  
  testing = false;

  var promise = alldata.check();

  promise.then(function(){

      Meteor.call('getUsersOrg', function(err,userOrgs){

        $scope.groups = Groups.find(
        { 
          $or: [
            {'roles.can-manage': { $in: [ Meteor.user().emails[0].address ] } }, 
            {'orgId': { $in: userOrgs } }
          ]
        }, 
        {
          fields: {'name':1}
        })
        .fetch();  
    });

  })
  
    

  $scope.newPost = {
    title: '',
    content: '',
    options: {
      isEvent:false,
      hasDeadline: false
    },
    created_by: Meteor.userId(),
    created_at: Date.now(),
    post_status: 'publish'
  }

  $('#start-time').datetimepicker({
    sideBySide: true
  })
  .on('dp.change', function(e){
    $('#end-time').data('DateTimePicker').minDate(e.date);
  });

  $('#end-time').datetimepicker({
    sideBySide: true,
    useCurrent: false
  })
  .on('dp.change', function(e){
    $('#start-time').data('DateTimePicker').maxDate(e.date);
  });

  $('#deadline').datetimepicker({
    sideBySide: true,
    useCurrent: true
  })

  $scope.checkboxChange = function(box){
    if(box == 'event' && $scope.newPost.options.isEvent){
      $scope.newPost.options.hasDeadline = false;
    }

    if(box == 'deadline' && $scope.newPost.options.hasDeadline){
      $scope.newPost.options.isEvent = false;
    }

  }

  $scope.addPost = function(){

    $scope.appLoading = true;

    err = '';

    // Checking for errors
    if($scope.newPost.options.isEvent && $('#start-time').val().length == 0)
      err = 'Please choose a start time'
    if($scope.newPost.options.hasDeadline && $('#deadline').val().length == 0)
      err = 'Please choose a deadline';
    if($scope.newPost.group === undefined || $scope.newPost.group == '')
      err = 'Please choose a group.';
    if($scope.newPost.content === undefined || $scope.newPost.content.length < 4)
      err = 'Content should be min 4 characters.';
    if($scope.newPost.title === undefined || $scope.newPost.title.length < 4)
      err = 'Title should be min 4 characters.';

    if(err != ''){
      toastr.error(err, 'Error');
      err = '';
      return;
    }

    if( $scope.newPost.options.isEvent && $('#start-time').val().length > 0 ){
      $scope.newPost.start_time =  new Date($('#start-time').val());
      
      if( $('#end-time').val().length > 0){
        $scope.newPost.end_time = new Date($('#end-time').val());
      }

    }else if($scope.newPost.options.hasDeadline && $('#deadline').val().length > 0){
      $scope.newPost.deadline = new Date($('#deadline').val());
    }

    if(testing){
      console.log($scope.newPost)
    } else {

      // var promise = alldata.add('post', $scope.newPost);
      Posts.insert($scope.newPost, function(){

        toastr.success('New Post Added!', 'Success');
        $scope.newPost = {
          title: '',
          content: '',
          options: {
            isEvent:false,
            hasDeadline: false
          },
          created_by: Meteor.userId(),
          created_at: Date.now()
        }
        $('#start-time').val('');
        $('#end-time').val('');
        $('#deadline').val('');

      })      

    }

  }

}])

// Edit
angular.module('update-me').controller('Posts-Edit', ['$scope', 'alldata' ,'toastr', '$stateParams', function($scope, alldata , toastr, $stateParams){
  
  $scope.userRole = 'user';

  var promise = alldata.check();
  
  promise.then(function(data){
    
    $scope.post = Posts.findOne({_id:$stateParams['id']});
    

    org_id = Organizations.findOne({'name':'DAIICT'})._id;
    
    if(Roles.userIsInRole(Meteor.userId(), ['can-manage'], org_id)){
      $scope.userRole  = 'superAdmin';
    }

    $('#start-time').datetimepicker({
        sideBySide: true,
        defaultDate: $scope.post.start_time
      })
      .on('dp.change', function(e){
        $('#end-time').data('DateTimePicker').minDate(e.date);
      });

    $('#end-time').datetimepicker({
      sideBySide: true,
      useCurrent: false,
      defaultDate: $scope.post.end_time
    })
    .on('dp.change', function(e){
      $('#start-time').data('DateTimePicker').maxDate(e.date);
    });

    $('#deadline').datetimepicker({
      sideBySide: true,
      useCurrent: true
    })

  })

  $scope.checkboxChange = function(box){

    if(box == 'event' && $scope.post.options.isEvent){
      $scope.post.options.hasDeadline = false;
    }

    if(box == 'deadline' && $scope.post.options.hasDeadline){
      $scope.post.options.isEvent = false;
    }

  }


  $scope.checkIfSuperAdmin = function(){
      
      if($scope.userRole == 'superAdmin'){
        return true;
      }else{
        return false;
      }
  }

  $scope.updatePost = function(){

    err = '';

    if($scope.post.options.isEvent && $('#start-time').val().length == 0)
      err = 'Please choose a start time'
    if($scope.post.options.isEvent && $('#start-time').val().length == 0 && $('#end-time').val().length > 0 )
        err = 'Please choose a start time';
    if($scope.post.options.hasDeadline && $('#deadline').val().length == 0)
      err = 'Please choose a deadline';
    if($scope.post.group === undefined || $scope.post.group == '')
      err = 'Please choose a group.';
    if($scope.post.content === undefined || $scope.post.content.length < 4)
      err = 'Content should be min 4 characters.';
    if($scope.post.title === undefined || $scope.post.title.length < 4)
      err = 'Title should be min 4 characters.';

    if(err != ''){
      toastr.error(err, 'Error');
      err = '';
      return;
    }

    if( $scope.post.options.isEvent && $('#start-time').val().length > 0 ){
      $scope.post.start_time =  new Date($('#start-time').val());
      $scope.post.end_time = new Date($('#end-time').val());
    }else if($scope.post.options.hasDeadline && $('#deadline').val().length > 0){
      $scope.post.deadline = new Date($('#deadline').val());
    }

    Posts.update({_id:$scope.post._id}, $scope.post, function(){
      toastr.success('Post updated!', 'Success');
    });

  }

}])

// Display
angular.module('update-me').controller('Posts', ['$scope', 'alldata', '$meteor', 'toastr','$location', function($scope, alldata, $meteor, toastr, $location){

  $scope.userRole = 'user';
  
  var promise = alldata.check();

  promise.then(function(data){

      $scope.org_id = Organizations.findOne({'name':'DAIICT'})._id;
    
      if(Roles.userIsInRole(Meteor.userId(), ['can-manage'], $scope.org_id)){
        $scope.userRole  = 'superAdmin';
      }

      if( $scope.userRole == 'superAdmin' ){
          $scope.posts = Posts.find({}).fetch();
      }else{
          $scope.posts = Posts.find({}).fetch();
      }

  })

  $scope.removePost = function(post){
    Posts.remove(post._id);
    $scope.posts = Posts.find({}).fetch();
  }


  $scope.goto = function(id){
    $location.path('/posts/'+id+'/edit');
  }

  $scope.removeToast = function(){
    toastr.success('Post deleted.', 'Success');
  }

  // $scope.if_user_can_edit = function(id, grp_id){
  //   if( Meteor.userId() == id ){
  //     return true;
  //   } else if ( Roles.userIsInRole( Meteor.userId(), ['can-manage'], grp_id ) || Roles.userIsInRole( Meteor.userId(), ['can-manage'], $scope.org_id ) ) {
  //     console.log('Is Admin');
  //     return true;
  //   } else {
  //     console.log('Not An Admin');
  //     return false;
  //   }
  // }

  // $scope.if_user_can_delete = function(id, grp_id){
  //   if( Meteor.userId() == id ){
  //     return true;
  //   } else if ( Roles.userIsInRole( Meteor.userId(), ['can-manage'], grp_id ) || Roles.userIsInRole( Meteor.userId(), ['can-manage'], $scope.org_id ) ) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  $scope.findAuthor = function(id){
    
    Meteor.subscribe('allUsers', function(){
      return Meteor.users.findOne({_id:id}).emails[0].address;
    })
    
  }

  $scope.publishToast = function(){
    toastr.success('Post Published!', 'Success');
  }

  

}])