Meteor.startup(function () {


  Picker.route( '/documents/:_id', function( params, request, response, next ) {
  
  var getDocument = Posts.findOne( { "_id": params._id } );

  if ( getDocument ) {
    response.setHeader( 'Content-Type', 'application/json' );
    response.statusCode = 200;
    response.end( JSON.stringify( getDocument ) );
  } else {
    response.setHeader( 'Content-Type', 'application/json' );
    response.statusCode = 404;
    response.end( JSON.stringify( { error: 404, message: "Document not found." } ) );
  }

});

  // code to run on server at startup

    // process.env.MAIL_URL = "smtp://postmaster@sandbox817726d09c0545b2ac7b5b07d7f5685a.mailgun.org:e92982c9eb9e63e5c1b9874ccf42b658@smtp.mailgun.org:587/";
    process.env.MAIL_URL = "smtp://shreyans.p.gandhi@gmail.com:aerogandhi@95@smtp.gmail.com:465/"

  Accounts.config({
    sendVerificationEmail: true
  });

  Meteor.methods({

    'groupSubscribe' : function(group_id){
      return Roles.addUsersToRoles(Meteor.userId(), 'is-subscribed', group_id);
    },

    'groupUnsubscribe' : function(group_id){
      query = {};
      query['roles.'+group_id] = 'is-subscribed';
      Meteor.users.update({_id: Meteor.userId()}, {$pull: query }, function(err){
        if(!err)
          return true;
        else
          return false;
      });
    },

    'logoutServer': function(){
      Meteor.users.update( {_id: Meteor.userId()}, {$set: {'services.resume.loginTokens': []}} );
      console.log('user logged out');
      return true;
    },

    'userCheckRolesOnRegister': function(email, newUserId){
      orgs = Organizations.find({}).fetch();

      for(i=0; i<orgs.length; i++){
        if( orgs[i].admins.indexOf(email) != -1)
          Roles.addUsersToRoles(newUserId, 'can-manage', orgs[i]._id);
      }

      groups = Groups.find({}).fetch();

      for(i=0; i<groups.length; i++){
        if(groups[i].roles['can-manage'].indexOf(email) != -1)
          Roles.addUsersToRoles(newUserId, 'can-manage', groups[i]._id);
      }

      console.log('roles assigned to new user');
    },

    'getUser': function(){
      return Meteor.user();
    },

    'getUsersOrg': function(){
      return Roles.getGroupsForUser( Meteor.userId() )
    },

  	'checkEmail' : function(email){
  		

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

    'delayfn' : function(val){
      
        Meteor._sleepForMs(val);

      return true;
    }

  })

});

