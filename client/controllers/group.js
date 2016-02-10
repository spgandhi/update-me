// Display
angular.module('update-me').controller('Group', ['$scope', 'alldata' ,'$location', '$meteor', 'toastr', '$stateParams', function($scope, alldata, $location, $meteor, toastr, $stateParams){

  $scope.grpInit = function(){
    $scope.newGroup = {
      createdAt: new Date(),
      createdBy: Meteor.userId(),
      updatedAt: new Date(),
      options: {
        isPrivate: false,
        posts: 0
      },
      roles: {
        'can-manage': [Meteor.user().emails[0].address],
        'is-subscribed': [Meteor.user().emails[0].address]
      },
      orgId: $stateParams['id']
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

  $scope.removeToast = function(){
    toastr.success('Group Deleted', 'Success');
  }

  $scope.addGroup = function(){
    
    if(!$scope.newGroup.name)
      toastr.error('Please enter a name', 'Error');
    
    if($scope.newGroup.orgId == '')
      toastr.error('There was error. Please report the problem.');

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
    });

  }

  // Redirecting if user cannot manage groups
  if( ! Roles.userIsInRole( Meteor.userId(), ['can-manage'], $stateParams['id'] ) ){
    $location.path('/home');
  }

  $scope.tokenfield();
  $scope.grpInit();

  $scope.org_id = $stateParams['id'];

  var promise = alldata.check();

  promise.then(function(){
    $scope.groups = Groups.find({}).fetch();
  })
  
}])

// Edit
angular.module('update-me').controller('Group-Edit', ['$scope', 'alldata', '$meteor', 'toastr', '$stateParams', function($scope, alldata, $meteor, toastr, $stateParams){
  
  $scope.grp_admin = [];

  $('#group-admins').tokenfield({
    minLength: 3,
    createTokensOnBlur: true,
    delimiter: [' ', ',']
  });

  var promise = alldata.check();

  promise.then(function(){
    
    $scope.grp = Groups.findOne({_id: $stateParams['grp_id']});
    console.log($scope.grp);
    angular.forEach($scope.grp.roles['can-manage'], function(value, key){

        $('#group-admins').tokenfield()
          .on('tokenfield:removetoken', function(e){
            console.log( $scope.grp.roles['can-manage'][0] );
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
angular.module('update-me').controller('Group-Single', ['$scope', 'alldata', '$meteor', '$stateParams', 'toastr', function($scope, alldata, $meteor, $stateParams, toastr){
  $scope.org_id = $stateParams['id'];
  
  var promise = alldata.check();

  promise.then(function(){
    $scope.grp = Groups.findOne({_id: $stateParams['grp_id']});
  })
  
}])
