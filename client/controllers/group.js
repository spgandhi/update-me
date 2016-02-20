var app = angular.module('update-me');

// Display
app.controller('Group', ['$scope', 'alldata' ,'$location', '$meteor', 'toastr', '$stateParams', function($scope, alldata, $location, $meteor, toastr, $stateParams){

  
  $scope.removeToast = function(){
    toastr.success('Group Deleted', 'Success');
  }


  // Redirecting if user cannot manage groups
  // if( ! Roles.userIsInRole( Meteor.userId(), ['can-manage'], $stateParams['id'] ) ){
  //   $location.path('/home');
  // }


  $scope.org_id = $stateParams['id'];

  var promise = alldata.check();

  promise.then(function(){
    console.log(Roles.getGroupsForUser( Meteor.userId() ) );
    $scope.groups = Groups.find({orgId: {$in:Roles.getGroupsForUser( Meteor.userId() )} }).fetch();
    console.log($scope.groups);
  })

  $scope.removeGroup = function(group){
    Groups.remove(group._id);
    $scope.groups = Groups.find({orgId: {$in:Roles.getGroupsForUser( Meteor.userId() )} }).fetch();
  }
  
}])

app.controller('Group-Create', ['$scope', 'alldata', 'toastr', '$stateParams', function($scope, alldata, toastr, $stateParams){
  
  var promise = alldata.check();

  promise.then(function(){
    $scope.organizations = Organizations.find({_id: {$in: Roles.getGroupsForUser( Meteor.userId() ) }}).fetch();  
  })
  

  $scope.grpInit = function(){
    $scope.newGroup = {
      createdAt: new Date(),
      createdBy: Meteor.userId(),
      updatedAt: new Date(),
      options: {
        isPrivate: false,
        posts: 0,
        manager_draft: false
      },
      roles: {
        'can-manage': [Meteor.user().emails[0].address],
        'is-subscribed': [Meteor.user().emails[0].address]
      }
    }
  }
   

  $scope.tokenfield = function(){
    $('#group-admins').tokenfield({
      minLength: 3,
      createTokensOnBlur: true,
      delimiter: [' ', ','],
      inputType: 'email'
    });
  }

  $scope.grpInit();
  $scope.tokenfield();


  $scope.addGroup = function(){
    
    err = false;

    if(!$scope.newGroup.name){
      toastr.error('Please enter a name', 'Error');
      err = true;
    }
    
    if(!$scope.newGroup.orgId){
      toastr.error('Please select a organization.');
      err = true;
    }

    if(err)
      return;

    var admins = $('#group-admins').tokenfield('getTokensList').split(' ');
    
    if(admins!=""){
      angular.forEach(admins, function(value, key){
        $scope.newGroup.roles['can-manage'].push(value);
        $scope.newGroup.roles['is-subscribed'].push(value);
      })
    }
    
    Groups.insert($scope.newGroup, function(){
      toastr.success('Group Added!', 'Success');
      $scope.grpInit();
      $('#group-admins').tokenfield('destroy');
      $scope.tokenfield();
      alldata.subscribeGroup();
    });

  }


}])

// Edit
app.controller('Group-Edit', ['$scope', 'alldata', '$meteor', 'toastr', '$stateParams', function($scope, alldata, $meteor, toastr, $stateParams){
  
  $scope.grp_admin = [];

  $('#group-admins').tokenfield({
    minLength: 3,
    createTokensOnBlur: true,
    delimiter: [' ', ',']
  });

  var promise = alldata.check();

  promise.then(function(){
    
    $scope.grp = Groups.findOne({_id: $stateParams['grp_id']});
    angular.forEach($scope.grp.roles['can-manage'], function(value, key){

        $('#group-admins').tokenfield()
          .on('tokenfield:removetoken', function(e){
            if(e.attrs.value == Meteor.user().emails[0].address){
              toastr.error('Sorry! You cannot remove yourself as an admin.', 'Error');
              event.preventDefault();
              return false;
            }
            if(e.attrs.value == $scope.grp.roles['can-manage'][0] ){
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

          $('#group-admins').tokenfield('createToken', {value: value, label:value});
    })

  })  

  $scope.isSuperAdmin = function(org_id){
    console.log(org_id);
    return alldata.isSuperAdmin({org_id:org_id});
  }

  $scope.editGroup = function(){
    $scope.grp.roles['can-manage'] = $scope.grp_admin;

    angular.forEach($scope.grp_admin, function(value, key){
      if($scope.grp.roles['is-subscribed'].indexOf(value)<0)
        $scope.grp.roles['is-subscribed'].push(value);
    })


    Groups.update({_id: $scope.grp._id}, $scope.grp);
    toastr.success('Group Updated!','Success');
  }

}]);

// Single Display
app.controller('Group-Single', ['$scope', 'alldata', '$meteor', '$stateParams', 'toastr', function($scope, alldata, $meteor, $stateParams, toastr){
  $scope.org_id = $stateParams['id'];
  
  var promise = alldata.check();

  promise.then(function(){
    $scope.grp = Groups.findOne({_id: $stateParams['grp_id']});
  })
  
}])


app.controller('Groups-Favourite', ['$scope', function($scope){
  // var promise = alldata.check();
  
  
  $scope.checkIfFavourite = function(grp_id){
    if( Meteor.user() && 'profile' in Meteor.user() && 'favourites' in Meteor.user().profile ){
          if( Meteor.user().profile.favourites.indexOf(grp_id) != -1)
            return true;
      }else{
        Meteor.users.update( {_id:Meteor.userId()}, {$set: {'profile.favourites': []}});
      }
    
    return false;
  }

  $scope.updateFavourites = function(value, button){
    if(Meteor.user().profile.favourites)
    
    if( !$('#'+value._id).hasClass('active') )
      Meteor.users.update( Meteor.userId(), { $push: { 'profile.favourites' : value._id } } );
    else
      Meteor.users.update( Meteor.userId(), { $pull: { 'profile.favourites' : value._id } } );
    
  }

  // promise.then(function(){
  
    console.log($scope.groupsloaded);
    Meteor.call('delayfn',10000, function(){
      Meteor.subscribe('all-groups', function(){
        $scope.favs = Groups.find({}).fetch();  
        $scope.groupsloaded = true;
        $scope.$digest();
      })  
    })
    
    
  // })
}])

app.controller('Group-Subscribe', ['$scope', 'alldata', 'toastr', function($scope, alldata, toastr){
  
  var promise = alldata.check();


  promise.then(function(){
    Meteor.subscribe('all-groups', function(){
      $scope.grps = Groups.find({}).fetch();
      // console.log($scope.grps);
    })
  })

  $scope.isSubscribed = function(group_id){
    return Roles.userIsInRole(Meteor.userId(), 'is-subscribed', group_id);
  }

  $scope.groupSubscribe = function(group_id, groupName){
    Meteor.call('groupSubscribe', group_id, function(err, result){
      if(!err)
        toastr.success('Subscribed!', 'Success');
      else
        toastr.error('Subscription Failed!', 'Error');
    })
  }

    $scope.groupUnsubscribe = function(group_id, groupName){
    Meteor.call('groupUnsubscribe', group_id, function(err, result){
      if(!err)
        toastr.success('Unsubscribed', 'Success');
      else
        toastr.error('Unsubscription Failed!', 'Error');
    })
  }

}])
