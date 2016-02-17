var app = angular.module('update-me');
// Add + Main
app.controller('Organization', ['$scope', 'alldata','$meteor', 'toastr', '$location', '$stateParams', function($scope, alldata, $meteor, toastr, $location, $stateParams){

  var promise = alldata.check();

  promise.then(function(){
    $scope.organizations = Organizations.find({}).fetch();
  })

  $scope.orgInit = function(){
    $scope.newOrganization = {
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: Meteor.userId(),
      options: {
        domainAllowed: [],
        isPrivate: false
      },
      groups: [],
      roles: {
        'can-manage' : [Meteor.userId()]
      }
    }
  }

  $scope.tokenfield = function(){ 

    $('#org-admins').tokenfield({
      minLength: 3,
      createTokensOnBlur: true,
      delimiter: [' ', ','],
      inputType: 'email'
    });

    $('#allowed-domains').tokenfield({
      minLength: 3,
      createTokensOnBlur: true,
      delimiter: [' ', ',']
    }).on('tokenfield:removedtoken', function(e){
      var index = $scope.newOrganization.options['domainAllowed'].indexOf(e.attrs.value);
      $scope.newOrganization.options['domainAllowed'].splice(index, 1);
    })
  }

  $scope.postDeleteToast = function(){
    toastr.success('Organization deleted!', 'Success');
  }

  $scope.addOrganization = function(){

    $scope.newOrganization.admins = [Meteor.user().emails[0].address];

    // 1. Check Before Insert
    if(!$scope.newOrganization.name){
      toastr.error('Please enter an organiztion name', 'Error');
      return;
    }

    var domain = $('#allowed-domains').tokenfield('getTokensList').split(' ');
    if(domain!=''){
      angular.forEach(domain, function(value, key){
        $scope.newOrganization.options['domainAllowed'].push(value);
      })
    }

    var admins = $('#org-admins').tokenfield('getTokensList').split(' ');
    if(admins!=''){
      angular.forEach(admins, function(value, key){
        $scope.newOrganization.admins.push(value);
      })
    }

    console.log($scope.newOrganization);
    // return;

    Organizations.insert($scope.newOrganization, function(){
      toastr.success('Organization Added!', 'Success');
      $scope.newOrganization = [];
      $('#allowed-domains').tokenfield('destroy');
      $('#org-admins').tokenfield('destroy');
      $scope.tokenfield();
      $scope.orgInit(); 
    });  

  }

  $scope.search = function(text){
    Organizations.find( { $text: { $search: text } } ).fetch();
    // console.log(Organizations);
  }

  $scope.tokenfield();  // Initializing the tokenfield

  $scope.orgInit();

}])

// Single
app.controller('Organization-Single', ['$scope', 'alldata', '$meteor','$stateParams', 'toastr', function($scope, alldata, $meteor, $stateParams, $toastr){

  var promise = alldata.check();

  promise.then(function(){
    $scope.org = Organizations.findOne($stateParams['id']);
    
    grp = Groups.find({org_id:$stateParams['id']}).fetch();

    totalPosts = 0;
    angular.forEach(grp, function(value, key){
      totalPosts = totalPosts + value.options.posts;
    })
    $scope.totalPosts = totalPosts;

  })
    
}])

// Edit
app.controller('Org-Edit', ['$scope', 'alldata', '$meteor', 'toastr', '$stateParams', function($scope, alldata, $meteor, toastr, $stateParams){
   
    var promise = alldata.check();

    promise.then(function(){

      $scope.org = Organizations.findOne({_id: $stateParams['id']});
      $scope.allowed_domains = $scope.org.options['domainAllowed'];
      
      $('#allowed-domains').tokenfield({
        minLength: 3,
        createTokensOnBlur: true,
        delimiter: [' ', ',']
      });
      $('#allowed-domains').tokenfield('setTokens', $scope.allowed_domains);

      $('#org-admins').tokenfield({
        minLength: 3,
        createTokensOnBlur: true,
        delimiter: [' ', ',']
      });
      $('#org-admins').tokenfield('setTokens', $scope.org.admins);

      $('#org-admins').tokenfield()
        .on('tokenfield:removetoken', function(e){
          
          if(e.attrs.value == Meteor.user().emails[0].address){
            toastr.error('Sorry! You cannot remove yourself as an admin.', 'Error');
            event.preventDefault();
            return false;
          }
          if(e.attrs.value == $scope.org.admins[0] ){
            toastr.error('Sorry! Super admin email cannot be removed', 'Error');
            event.preventDefault();
            return false;
          }else{

            $scope.org.admins.splice($scope.org.admins.indexOf(e.attrs.value),1);
          }
        })
        .on('tokenfield:createdtoken', function(e){
          $scope.org.admins.push(e.attrs.value);
        })

    })


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