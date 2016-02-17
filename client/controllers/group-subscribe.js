var app = angular.module('update-me');

app.controller('Subscribe', ['$scope', 'toastr', '$stateParams', '$meteor', function($scope, toastr, $stateParams, $meteor){
  Meteor.subscribe('all-groups', function(){
    $scope.groups = Groups.find().fetch();
  })

  $scope.addGroup = function(grp){
    grp.roles['is-subscribed'].push(Meteor.userId());
  }

  $scope.class = function(grp){
    
    angular.forEach(grp.roles['is-subscribed'], function(value, key){
      console.log('comparing ' + value + ' = ' + grp._id + ' for ' + grp.name);
      if(value == grp._id)
        return false
    })

    return true;
  }

}])