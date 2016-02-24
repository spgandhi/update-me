var app = angular.module('update-me');
// Create
app.controller('Post-Create', ['$scope', 'alldata', '$meteor', 'toastr', function($scope, alldata, $meteor, toastr){
  
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

        $('.editable').keyup(function(){
          $scope.contentLength = $('.editable').text().length;
          $scope.$digest();          
        })
    });

  })

  $scope.newPost = {
    title: '',
    content: '',
    options: {
      isEvent:false,
      hasDeadline: false,
      clicks: []
    },
    created_by: Meteor.userId(),
    created_at: moment(),
    post_status: 'publish'
  }

  $('#start-time').datetimepicker({
    sideBySide: true,
    useCurrent: true
  })

  $('#end-time').datetimepicker({
    sideBySide: true,
    useCurrent: false
  })

  $('#start-time').on('dp.change', function(e){
     $('#end-time').data("DateTimePicker").minDate(e.date);
  })

  $('#end-time').on('dp.change', function(e){
     $('#start-time').data("DateTimePicker").maxDate(e.date);
  })


  $('#deadline').datetimepicker({
    sideBySide: true,
    useCurrent: true
  })

  $scope.contentLength = $('.editable').text().length;

  $scope.checkboxChange = function(box){
    if(box == 'event' && $scope.newPost.options.isEvent){
      $scope.newPost.options.hasDeadline = false;
    }

    if(box == 'deadline' && $scope.newPost.options.hasDeadline){
      $scope.newPost.options.isEvent = false;
    }

  }

  $scope.editorInit = function(){
      var editor = new MediumEditor('.editable');
  }

  $scope.addPost = function(element){
    
    var l = Ladda.create(document.querySelector( '#add-post-btn' ));
    l.start();

    err = '';

    // Checking for errors
    if($scope.newPost.options.isEvent && $('#start-time').val().length == 0)
      err = 'Please choose a start time'
    if($scope.newPost.options.hasDeadline && $('#deadline').val().length == 0)
      err = 'Please choose a deadline';
    if($scope.newPost.group === undefined || $scope.newPost.group == '')
      err = 'Please choose a group.';
    if($scope.newPost.content === undefined || $('.editable').text().length < 4 || $('.editable').text().length > 500)
      err = 'Content should be min 4 and max is 500 characters.';
    if($scope.newPost.title === undefined || $scope.newPost.title.length < 4)
      err = 'Title should be min 4 characters.';

    if(err != ''){
      toastr.error(err, 'Error');
      err = '';
      return;
    }

    $scope.newPost.content = $('.editable').html();


    if( $scope.newPost.options.isEvent && $('#start-time').val().length > 0 ){
      $scope.newPost.start_time =  new Date($('#start-time').val());
      
      if( $('#end-time').val().length > 0){
        $scope.newPost.end_time = new Date($('#end-time').val());
      }

    }else if($scope.newPost.options.hasDeadline && $('#deadline').val().length > 0){
      $scope.newPost.deadline = new Date($('#deadline').val());
    }

    var grp = Groups.findOne({_id: $scope.newPost.group._id});

    if(grp.options.manager_draft){
      
      if(Roles.userIsInRole(Meteor.userId(), 'can-manage', grp.orgId)){
        $scope.newPost.post_status = 'publish';
      }else{
        $scope.newPost.post_status = 'draft';
      }

    }

    
      Posts.insert($scope.newPost, function(){

        if($scope.newPost.post_status == 'publish')
          toastr.success('New Post Added!', 'Success');
        else if($scope.newPost.post_status == 'draft')
          toastr.success('Saved as draft. Requires admin approval', 'Success');

        $scope.newPost = {
          title: '',
          content: '',
          options: {
            isEvent:false,
            hasDeadline: false,
            clicks: []
          },
          created_by: Meteor.userId(),
          created_at: Date.now(),
          post_status: 'publish'
        }
        $('.editable').text(''); 
        $('#start-time').val('');
        $('#end-time').val('');
        $('#deadline').val('');

        l.stop();

      })      

    }

  $scope.charLimit = function(limit, what){

    if(what == 'title'){
      if($scope.newPost.title.length > limit)
        $scope.newPost.title = $scope.newPost.title.substr(0, limit);
    }

    if(what == 'content'){
      if($scope.newPost.content.length > limit)
        $scope.newPost.content = $scope.newPost.content.substr(0, limit);
    }

  }

  $scope.editorLength = function(){
    $scope.editorLength =  $('.editable').text().length
      
  }

}])

// Edit
app.controller('Posts-Edit', ['$scope', 'alldata' ,'toastr', '$stateParams', function($scope, alldata , toastr, $stateParams){
  
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

    
    editor.setContent($scope.post.content, 0);

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
    if($scope.post.content === undefined || $('.editable').text().length < 4 || $('.editable').text().length > 500)
      err = 'Content should be min 4 and max is 500 characters.';
    if($scope.post.title === undefined || $scope.post.title.length < 4)
      err = 'Title should be min 4 characters.';

    if(err != ''){
      toastr.error(err, 'Error');
      err = '';
      return;
    }

    $scope.post.content = $('.editable').html();

    // if( $scope.post.options.isEvent && $('#start-time').val().length > 0 ){
    //   $scope.post.start_time =  new Date($('#start-time').val());
    //   $scope.post.end_time = new Date($('#end-time').val());
    // }else if($scope.post.options.hasDeadline && $('#deadline').val().length > 0){
    //   $scope.post.deadline = new Date($('#deadline').val());
    // }

    if( $scope.post.options.isEvent && $('#start-time').val().length > 0 ){
      $scope.post.start_time =  new Date($('#start-time').val());
      
      if( $('#end-time').val().length > 0){
        $scope.post.end_time = new Date($('#end-time').val());
      }

    }else if($scope.post.options.hasDeadline && $('#deadline').val().length > 0){
      $scope.post.deadline = new Date($('#deadline').val());
    }


    Posts.update({_id:$scope.post._id}, $scope.post, function(){
      toastr.success('Post updated!', 'Success');
    });

  }

}])

// Display
app.controller('Posts', ['$scope', 'alldata', 'toastr','$location', '$rootScope', function($scope, alldata, toastr, $location, $rootScope){

  $rootScope.updateme_loading = true;

  $scope.user_id = Meteor.userId();
  
  var promise = alldata.check();

  $scope.print = function(data){
    console.log(data);
  }


  promise.then(function(data){

      $scope.orgs = Organizations.find({},{fields:{_id:1}}).fetch();

      $scope.org_ids = [];
      $scope.grp_ids = [];

      angular.forEach($scope.orgs, function(value, key){
        $scope.org_ids.push(value._id); 
      })

      
      $scope.groups = Groups.find({$or: [ {orgId: {$in: $scope.org_ids}}, {_id: {$in: Roles.getGroupsForUser(Meteor.userId())}}] }, {fields: {_id:1}}).fetch();

      angular.forEach($scope.groups, function(value, key){
        $scope.grp_ids.push(value._id); 
      })

      $scope.posts = Posts.find({ $or: [ { 'group._id': { $in: $scope.grp_ids } } , {'created_by': Meteor.userId() } ] } ).fetch();

      $rootScope.updateme_loading = false;

  });

  $scope.canPublish = function(group_id){
    grp = Groups.findOne({_id: group_id}, {fields: {'_id':1, 'orgId':1}});
    if(grp){
      org = Organizations.findOne({_id:grp.orgId}, {fields: {'_id':1}});
      if(org){
        if( Roles.userIsInRole(Meteor.userId(), 'can-manage', org._id) ) 
          return true;
        else{
          return false;
        }
      }
    }
    return false;
  }

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

  $scope.findAuthor = function(id){
    
    Meteor.subscribe('allUsers', function(){
      return Meteor.users.findOne({_id:id}).emails[0].address;
    })
    
  }


  $scope.publish = function(post){
    post.post_status = 'publish';
    Posts.update({_id: post._id}, {$set: {post_status : 'publish'}});
    toastr.success('Post Published!', 'Success');
  }
  

}])