var app = angular.module('update-me');

app.controller('Profile', ['$scope', 'toastr', function($scope, toastr){
  
  $scope.user = {
    currentPassword: '',
    newPassword: '',
  };

  u = Meteor.user();

  if(u){
    
    if('name' in u.profile)
      $scope.user.name = u.profile.name;
    $scope.user.email = u.emails[0].address;
  }

  $scope.updateUser = function(){

    Meteor.users.update(Meteor.userId(), {$set: {'profile.name':$scope.user.name}}, function(err){
      if(!err)
        toastr.success('Profile Updated Successfully', 'Success');
    });
  }

  $scope.changePassword = function(){

    if($scope.user.currentPassword == ''){
      toastr.error('Current Password cannot be empty.', 'Error');
      return;
    }

    if($scope.user.newPassword == '' || $scope.user.newPassword.length <= 5){
      toastr.error('New Password should be min 6 characters.', 'Error');
      return;
    }


    if($scope.user.currentPassword && $scope.user.currentPassword == $scope.user.newPassword){
      toastr.error('Password cannot be same', 'Error')
    }else{
      
      if($scope.user.currentPassword){
        Accounts.changePassword($scope.user.currentPassword, $scope.user.newPassword, function(err){
          if(err)
            toastr.error(err.message, 'Error');
          else
            toastr.success('Password changed Successfully', 'Success');
            
        })
      }
      
    }

  }

}])

app.controller('Register', ['$scope', 'toastr','$location', function($scope, toastr, $location){
  
  if(Meteor.user()){
    $location.path('/home');
  }

  $scope.register = function(){

    Accounts.createUser({email: $scope.newUser.email, password: $scope.newUser.password, profile : {'name':$scope.newUser.name, 'favourites':[]}}, function(err){
      
      if(err){
        toastr.error(err.reason, 'Error');
      }else{
        toastr.success('Registration Successful', 'Success');
        $scope.newUser = [];
        Meteor.call('userCheckRolesOnRegister', Meteor.user().emails[0].address , Meteor.userId(), function(err, result){
          if(!err){
            Meteor.logout(function(error){
            if(!error)
              $location.path('/login');
            })  
          }
        })
        
      }

    });
  }
}])

app.controller('Login', ['$scope', 'toastr', 'alldata', '$location',  function($scope, toastr, alldata, $location){
    
  if(Meteor.user()){
    $location.path('/home');
  }

  $scope.Login = function(username, password){

    Meteor.call('checkEmail',(username), function(err,value){
      
      // if(value){
        Meteor.loginWithPassword(username, password, function(err){
        
          if(err){
            toastr.error(err.reason, 'Error');
          }else{

            var promise = alldata.check();
            
            promise.then(function(){
              
              if("profile" in alldata.currentUser && "name" in alldata.currentUser.profile){
                $scope.$parent.user = alldata.currentUser.profile.name;
              }else{
                $scope.$parent.user = alldata.currentUser.emails[0].address;
              }

              $scope.$parent.org_id = false;
              org = Organizations.findOne({name: 'DAIICT'});
              if(org){
                $scope.$parent.org_id = org._id;
              }

            })
            toastr.success('Welcome back!', 'Success');
            $location.path('/home');
          }

        });
      // }else{
        // toastr.error('You have not verifed your email.', 'Error');
      // }
    })
    
  }

}])

app.controller('ResendVerification', ['$scope', 'toastr', '$location', function($scope, toastr, $location){

  if(Meteor.user())
    $location.path('/home');

  $scope.resendVerificationEmail = function(email){
    Meteor.call('resendVerificationEmail', (email), function(err, value){
      if(value)
        toastr.success('Email sent!', 'Success');
      else
        toastr.error('Either your email is not registered or is already verified', 'Error');
    })
  }

}])

app.controller('ForgotPassword', ['$scope', 'toastr', '$location', function($scope, toastr, $location){

  if(Meteor.user())
    $location.path('/home');

  $scope.passwordRecovery = function(email){
    Meteor.call('passwordRecovery', (email), function(err, value){
      if(value){
        Accounts.forgotPassword({email: email}, function(error){
          if(!error){
            toastr.success('Password reset link sent on your email.', 'Success');    
          }
        })
        
      }
      else
        toastr.error('Email does not exist!', 'Error');
    })
  }

}])



app.controller('ResetPassword', ['$scope', 'toastr', '$location', '$stateParams', function($scope, toastr, $location, $stateParams){

  if(Meteor.user())
    $location.path('/home');

  $scope.token = $stateParams['token'];

  $scope.passwordReset = function(password){
    Accounts.resetPassword($scope.token, password, function(err){
      if(!err){
        toastr.success('Password Reset Successful!', 'Success');
        $location.path('/home');
      }else{
        toastr.error('Password Reset Failed!', 'Error');
      }
    })
  }

}])

app.controller('VerifyEmail', ['$scope', 'toastr', '$location', '$stateParams', function($scope, toastr, $location, $stateParams){

  if(Meteor.user())
    $location.path('/home');

  Accounts.verifyEmail($stateParams['token'], function(err){
    if(err){
      toastr.error('There was a problem verifying your account.', 'Error');
    } else {
      Meteor.logout(function(err){
        if(!err){
          toastr.success('Account Verified', 'Success');
          $location.path('/login');
        }
      })
    }
  })

}])