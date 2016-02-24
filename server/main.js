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

    'morningMail': function(data){
      // Email.send({
      //   from: 'info@updateme.com',
      //   to: 'spgandhi@live.com',
      //   subject: 'Update Me Daily Digest',
      //   html: data,
      // });

      homeurl = "http://localhost:3000/#/";
      var start = new Date();
      start.setHours(0,0,0,0);

      var end = new Date();
      end.setHours(23,59,59,999);

      users = Meteor.users.find({}).fetch();

      for(i=0;i<users.length;i++){
        if('name' in users[i].profile)
          username = users[i].profile.name;
        else
          username = users[i].emails[0].address;

        // var data = '<style>html { font-family: sans-serif; font-size:14px; } body { margin: 0px; } article, aside, details, figcaption, figure, footer, header, hgroup, main, menu, nav, section, summary { display: block; } a { background-color: transparent; } a:active, a:hover { outline: 0px; } b, strong { font-weight: bold; } h1 { margin: 0.67em 0px; font-size: 2em; } mark { color: rgb(0, 0, 0); background: rgb(255, 255, 0); } small { font-size: 80%; } sub, sup { position: relative; font-size: 75%; line-height: 0; vertical-align: baseline; } sup { top: -0.5em; } sub { bottom: -0.25em; } img { border: 0px; } svg:not(:root) { overflow: hidden; } figure { margin: 1em 40px; } hr { height: 0px; box-sizing: content-box; } pre { overflow: auto; } code, kbd, pre, samp { font-family: monospace, monospace; font-size: 1em; } button, input, optgroup, select, textarea { margin: 0px; font-style: inherit; font-variant: inherit; font-weight: inherit; font-stretch: inherit; font-size: inherit; line-height: inherit; font-family: inherit; color: inherit; } button { overflow: visible; } button, select { text-transform: none; } button, html input[type="button"], input[type="reset"], input[type="submit"] { -webkit-appearance: button; cursor: pointer; } button[disabled], html input[disabled] { cursor: default; } textarea { overflow: auto; } table { border-spacing: 0px; border-collapse: collapse; } td, th { padding: 0px; } * { box-sizing: border-box; } ::before, ::after { box-sizing: border-box; } html { font-size: 10px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); } body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.42857; color: rgb(51, 51, 51); background-color: rgb(255, 255, 255); } input, button, select, textarea { font-family: inherit; font-size: inherit; line-height: inherit; } a { color: rgb(51, 122, 183); text-decoration: none; } a:hover, a:focus { color: rgb(35, 82, 124); text-decoration: underline; } a:focus { outline: -webkit-focus-ring-color auto 5px; outline-offset: -2px; } img { vertical-align: middle; } hr { margin-top: 20px; margin-bottom: 20px; border-width: 1px 0px 0px; border-top-style: solid; border-top-color: rgb(238, 238, 238); } [role="button"] { cursor: pointer; } h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6 { font-family: inherit; font-weight: 500; line-height: 1.1; color: inherit; } h1 small, h2 small, h3 small, h4 small, h5 small, h6 small, .h1 small, .h2 small, .h3 small, .h4 small, .h5 small, .h6 small, h1 .small, h2 .small, h3 .small, h4 .small, h5 .small, h6 .small, .h1 .small, .h2 .small, .h3 .small, .h4 .small, .h5 .small, .h6 .small { font-weight: normal; line-height: 1; color: rgb(119, 119, 119); } h4, .h4, h5, .h5, h6, .h6 { margin-top: 10px; margin-bottom: 10px; } h4 small, .h4 small, h5 small, .h5 small, h6 small, .h6 small, h4 .small, .h4 .small, h5 .small, .h5 .small, h6 .small, .h6 .small { font-size: 75%; } h4, .h4 { font-size: 18px; } p { margin: 0px 0px 10px; } .text-center { text-align: center; } ul, ol { margin-top: 0px; margin-bottom: 10px; } ul ul, ol ul, ul ol, ol ol { margin-bottom: 0px; } abbr[title], abbr[data-original-title] { cursor: help; border-bottom-width: 1px; border-bottom-style: dotted; border-bottom-color: rgb(119, 119, 119); } table { background-color: transparent; } table col[class*="col-"] { position: static; display: table-column; float: none; } table td[class*="col-"], table th[class*="col-"] { position: static; display: table-cell; float: none; } .table > thead > tr > td.active, .table > tbody > tr > td.active, .table > tfoot > tr > td.active, .table > thead > tr > th.active, .table > tbody > tr > th.active, .table > tfoot > tr > th.active, .table > thead > tr.active > td, .table > tbody > tr.active > td, .table > tfoot > tr.active > td, .table > thead > tr.active > th, .table > tbody > tr.active > th, .table > tfoot > tr.active > th { background-color: rgb(245, 245, 245); } .table-hover > tbody > tr > td.active:hover, .table-hover > tbody > tr > th.active:hover, .table-hover > tbody > tr.active:hover > td, .table-hover > tbody > tr:hover > .active, .table-hover > tbody > tr.active:hover > th { background-color: rgb(232, 232, 232); } .pull-right { float: right !important; } .pull-left { float: left !important; } html { font-family: sans-serif; } body { margin: 0px; } .col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12 { position: relative; min-height: 1px; padding-right: 15px; padding-left: 15px; } .media, .media-body { overflow: hidden; zoom: 1; } .media, .media .media { margin-top: 15px; } .media:first-child { margin-top: 0px; } .media > .pull-left { margin-right: 10px; } .media > .pull-right { margin-left: 10px; } .list-group { padding-left: 0px; margin-bottom: 20px; } .list-group-item { position: relative; display: block; padding: 10px 15px; margin-bottom: -1px; border: 1px solid rgb(221, 221, 221); background-color: rgb(255, 255, 255); } .list-group-item:first-child { border-top-left-radius: 4px; border-top-right-radius: 4px; } .list-group-item:last-child { margin-bottom: 0px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; } .list-group-item > .badge { float: right; } .list-group-item > .badge + .badge { margin-right: 5px; } .panel { margin-bottom: 20px; border: 1px solid transparent; border-radius: 4px; box-shadow: rgba(0, 0, 0, 0.0470588) 0px 1px 1px; background-color: rgb(255, 255, 255); } .panel-heading { padding: 10px 15px; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: transparent; border-top-left-radius: 3px; border-top-right-radius: 3px; } .panel-heading > .dropdown .dropdown-toggle { color: inherit; } .panel-title { margin-top: 0px; margin-bottom: 0px; font-size: 16px; color: inherit; } .panel-title > a { color: inherit; } .panel > .list-group { margin-bottom: 0px; } .panel > .list-group .list-group-item { border-width: 1px 0px; border-radius: 0px; } .panel > .list-group:first-child .list-group-item:first-child { border-top-width: 0px; border-top-left-radius: 3px; border-top-right-radius: 3px; } .panel > .list-group:last-child .list-group-item:last-child { border-bottom-width: 0px; border-bottom-right-radius: 3px; border-bottom-left-radius: 3px; } .panel-heading + .list-group .list-group-item:first-child { border-top-width: 0px; } .panel-group .panel + .panel { margin-top: 5px; } .panel-group .panel-heading { border-bottom-width: 0px; } .panel-group .panel-heading + .panel-collapse .panel-body { border-top-width: 1px; border-top-style: solid; border-top-color: rgb(221, 221, 221); } .panel-default { border-color: rgb(221, 221, 221); } .panel-default > .panel-heading { color: rgb(51, 51, 51); border-color: rgb(221, 221, 221); background-color: rgb(245, 245, 245); } .panel-default > .panel-heading + .panel-collapse .panel-body { border-top-color: rgb(221, 221, 221); } .panel-default > .panel-footer + .panel-collapse .panel-body { border-bottom-color: rgb(221, 221, 221); } .col-lg-4{ width: 33%; margin:auto; padding:20px; } span.group-name {border: 1px solid;padding: 2px 5px;border-radius: 5px;font-size: 12px;margin: 0 2px;} .group-name-container{ padding:5px; } @media(max-width:960px){.col-lg-4{width:100%}}</style>';
        data = '<html><head><meta name="description" content="update me by spgandhi@live.com" /><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" /> <title>updateme-2.0</title><style>@media(max-width:960px) .col-lg-4{ width:100%;}</style></head><body>\
        <div style="color: rgb(120, 130, 136); margin: auto;float: none; width:100%; font-family: '+ "'Open Sans'" + ', '+"'Helvetica Neue'"+ ', Helvetica, Arial, sans-serif; font-size: 14px; background: #F2F4F8;; padding:20px;"><h2 style="text-align:center">Update Me Daily Digest</h2><hr border: 1px solid rgba(0,0,0,0.1)>';
        
        data += 'Dear ' + username + ',<br><br>We thought you might be intersted in having a quick look at the events of your interest for today.<br><br>';
        
        data += '<section style="border-color: #eaeef1;border-radius: 2px;margin-bottom: 20px;background-color: #fff;border: 1px solid transparent; margin:20px;">\
                  <header style="border-color: #eaeef1;background-color: #f9fafc;border-radius: 2px 2px 0 0;    padding: 10px 15px;    border-bottom: 1px solid transparent;">\
                    <h3 style="margin-top: 0; margin-bottom: 0; font-size: 16px; color: inherit;">Today Events</h3>\
                  </header>\
                  <table border="0" style="margin-top:0;border-radius: 2px;margin-bottom: 0;padding: 0">';
        
        posts = {};
        posts = Posts.find({post_status: 'publish', 'options.isEvent': true, start_time: {$gte: start, $lt:end}, 'group._id': {$in: Roles.getGroupsForUser(Meteor.userId(), 'is-subscribed')} }).fetch();
        for(j=0; j<posts.length; j++){
            value = posts[j];
            // data += '<td style="min-height: 40px;border-width: 1px 0; border-radius: 0;border-color: #f3f5f7;padding-right: 15px;position: relative; display: block; padding: 10px 15px; margin-bottom: -1px; background-color: #fff; border: 1px solid #ddd;">\
              data += '<td>\
                            <div>\
                              <a style="color: #3c4144;text-decoration: none;" href="'+ homeurl +'">'+value.title+'</a>';
          
                            if(value.venue)         
                              data += '<span> @ </span>' + value.venue;

              data += '</div></td>';

              data += '<tr>\
                        <td style="text-align: center; float: right;">\
                          <span>\
                            <span style="color: #a1a8ac; margin-bottom: 3px;font-size: 18px;color: #a1a8ac; padding-bottom: 5px;">' + moment(value.start_time).format("h:mm") + '</span><br><small style="background-color: #f2f4f8; color: #788288;display: inline; padding: .2em .6em .3em; font-size: 75%;">' + moment(value.start_time).format("a") + '</small><br>\
                          </span>\
                        </td>\
                        <td>\
                          <div style="float: right; margin: 5px; border: 1px solid #333; border-radius: 5px;">\
                            <span style="padding: 10px;">'+value.group.name+'</span>\
                          </div>\
                        </td>\
                        </tr>';

        };

        data+='</table></section><br><br>';
        data+='Update Me!<hr border: 1px solid rgba(0,0,0,0.1)>';
        data+='<div style="text-align:center"><span><small><a href="'+ homeurl +'profile">Unsubscribe</a></small></span></div>'
        data+='</div></body></html>';

        console.log(users[i].emails[0].address);

        // if(posts.length>0){
        //   Email.send({
        //     from: 'info@updateme.com',
        //     to: users[i].emails[0].address,
        //     subject: 'Update Me Daily Digest',
        //     html: data,
        //   });  

        //   console.log('Email sent to ' + users[i].emails[0].address);
        // }
        

      }

      return data;
    },

    'groupSubscribe' : function(group_id){
      
      if(!Roles.userIsInRole(Meteor.userId, 'is-subscribed', group_id))
        return Roles.addUsersToRoles(Meteor.userId(), 'is-subscribed', group_id);

      return false
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

