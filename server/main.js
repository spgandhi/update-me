Meteor.startup(function () {
  // code to run on server at startup


  Accounts.config({
    sendVerificationEmail: true
  });

  Meteor.methods({

    'getUsersOrg': function(){
      console.log( Roles.getGroupsForUser( Meteor.userId() ) ); 
      return Roles.getGroupsForUser( Meteor.userId() )
    },

  	'checkEmail' : function(email){
  		console.log(email);
  		

  		if( Meteor.users.findOne({'emails.address': email}).emails[0].verified )
  			return true;
  		else
  			return false;
  	},

  	'resendVerificationEmail' : function(email){
  		if( Meteor.users.findOne({'emails.address': email}).emails[0].verified )
  			return false;
  		else
  			return true;
  	},

  	'passwordRecovery' : function(email){
  		if( Meteor.users.findOne({'emails.address': email}) )
  			return true;
  		else
  			return false;	
  	},

    'delayfn' : function(){
      console.log('Started Delay');
      Meteor._sleepForMs(2000);
      console.log('Ended Delay');
      return true;
    }

  })

});