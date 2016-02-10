angular.module('update-me').controller('Register', ['$scope', 'toastr','$location', function($scope, toastr, $location){
  
  if(Meteor.user()){
    $location.path('/home');
  }

  $scope.register = function(){
    

    Accounts.createUser({email: $scope.newUser.email, password: $scope.newUser.password}, function(err){
      
      if(err){
        toastr.error(err.reason, 'Error');
      }else{
        toastr.success('Registration Successful', 'Success');
        $scope.newUser = [];
        Meteor.logout(function(err){
          if(!err)
            $location.path('/login');
        })
      }

    });
  }
}])

angular.module('update-me').controller('Login', ['$scope', 'toastr','$location', function($scope, toastr, $location){
    
  if(Meteor.user()){
    $location.path('/home');
  }

  $scope.Login = function(){

    Meteor.call('checkEmail',($scope.user.email), function(err,value){
      
      // if(value){
        Meteor.loginWithPassword($scope.user.email, $scope.user.password, function(err){
        
          if(err){
            toastr.error(err.reason, 'Error');
          }else{
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

angular.module('update-me').controller('ResendVerification', ['$scope', 'toastr', '$location', function($scope, toastr, $location){

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

angular.module('update-me').controller('ForgotPassword', ['$scope', 'toastr', '$location', function($scope, toastr, $location){

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



angular.module('update-me').controller('ResetPassword', ['$scope', 'toastr', '$location', '$stateParams', function($scope, toastr, $location, $stateParams){

  if(Meteor.user())
    $location.path('/home');

  $scope.token = $stateParams['token'];

  $scope.passwordReset = function(password){
    console.log(password);
    Accounts.resetPassword($scope.token, password, function(err){
      if(!err)
        toastr.success('Password Reset Successful!', 'Success');
      else
        toastr.error('Password Reset Failed!', 'Error');
    })
  }

}])

angular.module('update-me').controller('VerifyEmail', ['$scope', 'toastr', '$location', '$stateParams', function($scope, toastr, $location, $stateParams){

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